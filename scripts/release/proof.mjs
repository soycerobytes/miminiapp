import { createPublicKey, verify } from "node:crypto";
import {
  changedPaths,
  commitPattern,
  hashPattern,
  requireValue,
  sha256,
} from "./git-tree.mjs";
import {
  fileOwner,
  registryPath,
  selectionPath,
  sortedSlugs,
  verifyCatalogue,
} from "./selection.mjs";

export const POLICY_PATH = ".release/policy.json";
export const PROOF_PATH = ".release/proof.json";

const statementKeys = [
  "baseSha",
  "destinationRepositoryId",
  "releaseId",
  "schemaVersion",
  "updates",
  "treeSha256",
];

function exactKeys(value, keys) {
  return (
    value !== null &&
    typeof value === "object" &&
    Object.keys(value).sort().join(",") === [...keys].sort().join(",")
  );
}

export function statementBytes(value) {
  requireValue(
    exactKeys(value, statementKeys) &&
      value.schemaVersion === 2 &&
      typeof value.releaseId === "string" &&
      /^[a-z][a-z0-9-]{0,48}$/.test(value.releaseId) &&
      typeof value.destinationRepositoryId === "string" &&
      /^[1-9][0-9]{0,19}$/.test(value.destinationRepositoryId) &&
      Array.isArray(value.updates) &&
      value.updates.length > 0 &&
      JSON.stringify(value.updates) ===
        JSON.stringify(sortedSlugs(value.updates)) &&
      typeof value.baseSha === "string" &&
      commitPattern.test(value.baseSha) &&
      typeof value.treeSha256 === "string" &&
      hashPattern.test(value.treeSha256),
    "Invalid release proof fields.",
  );
  return Buffer.from(
    JSON.stringify(statementKeys.map((key) => [key, value[key]])),
  );
}

export function proofBytes({ signature, ...statement }) {
  statementBytes(statement);
  const fields = Object.fromEntries(
    statementKeys.map((key) => [key, statement[key]]),
  );
  return Buffer.from(JSON.stringify({ ...fields, signature }, null, 2) + "\n");
}

export function readEnabledPolicy(base) {
  const entry = base.files.get(POLICY_PATH);
  requireValue(entry && entry.mode === "100644", "Release policy is missing.");
  const policy = JSON.parse(entry.bytes.toString("utf8"));
  requireValue(
    exactKeys(policy, [
      "schemaVersion",
      "mode",
      "destinationRepositoryId",
      "writerLogin",
      "writerEmail",
      "publicKey",
      "baseBranch",
    ]) &&
      policy.schemaVersion === 2 &&
      policy.mode === "selective" &&
      ["main", "selective-rehearsal"].includes(policy.baseBranch) &&
      typeof policy.destinationRepositoryId === "string" &&
      /^[1-9][0-9]{0,19}$/.test(policy.destinationRepositoryId) &&
      typeof policy.writerLogin === "string" &&
      /^[a-z0-9-]+\[bot\]$/.test(policy.writerLogin) &&
      typeof policy.writerEmail === "string" &&
      /^[^\s@]+@users\.noreply\.github\.com$/.test(policy.writerEmail) &&
      typeof policy.publicKey === "string",
    "Release policy is disabled or invalid.",
  );
  requireValue(
    createPublicKey(policy.publicKey).asymmetricKeyType === "ed25519",
    "Invalid key type.",
  );
  return policy;
}

export function projectionHash(files) {
  const entries = [...files.keys()]
    .filter((path) => path !== PROOF_PATH)
    .sort()
    .map((path) => {
      const entry = files.get(path);
      return [path, entry.mode, entry.digest];
    });
  return sha256(JSON.stringify(entries));
}

export function allowedChanges(base, candidate, updates) {
  const previous = verifyCatalogue(base.files);
  const current = verifyCatalogue(candidate.files);
  const touched = new Set(updates);
  requireValue(
    previous.every(({ slug }) =>
      current.some((entry) => entry.slug === slug),
    ) &&
      updates.every((slug) => current.some((entry) => entry.slug === slug)) &&
      current.every(
        (entry) =>
          touched.has(entry.slug) ||
          JSON.stringify(entry) ===
            JSON.stringify(previous.find(({ slug }) => slug === entry.slug)),
      ),
    "Catalogue changes exceed the selected miniapps.",
  );
  const paths = changedPaths(base.files, candidate.files, PROOF_PATH);
  requireValue(
    paths.length > 0 &&
      paths.every((path) => {
        if (path === selectionPath || path === registryPath) return true;
        const before = fileOwner(path, previous);
        const after = fileOwner(path, current);
        return (
          (!base.files.has(path) || touched.has(before)) &&
          (!candidate.files.has(path) || touched.has(after)) &&
          (!before || !after || before === after)
        );
      }),
    "The proposal changes files outside the selected miniapps.",
  );
  return paths;
}

export function releaseMessage(releaseId) {
  return `Release ${releaseId}`;
}

export function verifyProjection(base, candidate, policy) {
  const entry = candidate.files.get(PROOF_PATH);
  requireValue(
    entry?.mode === "100644" && entry.bytes.length <= 8192,
    "Release proof is missing.",
  );
  const proof = JSON.parse(entry.bytes.toString("utf8"));
  requireValue(
    exactKeys(proof, [...statementKeys, "signature"]),
    "Unexpected public proof fields.",
  );
  const { signature, ...statement } = proof;
  const bytes = statementBytes(statement);
  requireValue(
    entry.bytes.equals(proofBytes(proof)),
    "The public proof is not canonical.",
  );
  requireValue(
    typeof signature === "string" && /^[a-z0-9_-]{86}$/i.test(signature),
    "Invalid signature encoding.",
  );
  const decoded = Buffer.from(signature, "base64url");
  requireValue(
    decoded.length === 64 &&
      decoded.toString("base64url") === signature &&
      verify(null, bytes, createPublicKey(policy.publicKey), decoded),
    "Invalid release signature.",
  );
  requireValue(
    statement.destinationRepositoryId === policy.destinationRepositoryId &&
      statement.baseSha === base.sha &&
      statement.treeSha256 === projectionHash(candidate.files),
    "The signed base or files differ from the proposal.",
  );
  allowedChanges(base, candidate, statement.updates);
  return statement;
}
