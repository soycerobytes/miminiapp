import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

export const commitPattern = /^[a-f0-9]{40}$/;
export const hashPattern = /^[a-f0-9]{64}$/;

export function requireValue(condition, message) {
  if (!condition) throw new Error(message);
}

export function git(root, ...args) {
  return execFileSync("git", ["-C", root, ...args], {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  }).trim();
}

export function safePath(path) {
  return (
    typeof path === "string" &&
    path.length <= 256 &&
    /^[a-z0-9._/@\[\]-]+$/i.test(path) &&
    path
      .split("/")
      .every(
        (part) => part && ![".", "..", ".git"].includes(part.toLowerCase()),
      )
  );
}

export function sha256(data) {
  return createHash("sha256").update(data).digest("hex");
}

export function snapshot(root, sha) {
  requireValue(commitPattern.test(sha), "A complete commit SHA is required.");
  requireValue(
    git(root, "cat-file", "-t", sha) === "commit",
    "Expected a commit.",
  );
  const rows = git(root, "ls-tree", "-rz", sha).split("\0").filter(Boolean);
  const entries = rows.map((row) => {
    const match = /^(100644|100755) blob ([a-f0-9]{40})\t(.+)$/.exec(row);
    requireValue(match && safePath(match[3]), "Unsupported tracked file.");
    return { mode: match[1], blob: match[2], path: match[3] };
  });
  const raw = execFileSync("git", ["-C", root, "cat-file", "--batch"], {
    input: entries.map(({ blob }) => blob).join("\n") + "\n",
    maxBuffer: 64 * 1024 * 1024,
  });
  const files = new Map();
  let offset = 0;
  for (const { mode, blob, path } of entries) {
    const end = raw.indexOf(10, offset);
    requireValue(end >= offset, "Missing Git blob header.");
    const header = /^([a-f0-9]{40}) blob ([0-9]+)$/.exec(
      raw.subarray(offset, end).toString("utf8"),
    );
    const size = Number(header?.[2]);
    requireValue(
      header?.[1] === blob &&
        Number.isSafeInteger(size) &&
        size <= 8 * 1024 * 1024,
      "Invalid Git blob header.",
    );
    const bytes = raw.subarray(end + 1, end + 1 + size);
    requireValue(
      bytes.length === size && raw[end + 1 + size] === 10,
      "Incomplete Git blob.",
    );
    files.set(path, { mode, blob, bytes, digest: sha256(bytes) });
    offset = end + size + 2;
  }
  requireValue(offset === raw.length, "Unexpected Git blob data.");
  return { sha, tree: git(root, "rev-parse", `${sha}^{tree}`), files };
}

export function sameFile(a, b) {
  return a?.mode === b?.mode && a?.digest === b?.digest;
}

export function changedPaths(base, candidate, ignored) {
  return [...new Set([...base.keys(), ...candidate.keys()])]
    .filter(
      (path) =>
        path !== ignored && !sameFile(base.get(path), candidate.get(path)),
    )
    .sort();
}
