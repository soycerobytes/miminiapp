import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { commitPattern, git, requireValue, snapshot } from "./git-tree.mjs";
import {
  projectionHash,
  releaseMessage,
  readEnabledPolicy,
  verifyProjection,
} from "./proof.mjs";

export function verifyPullRequest(baseRoot, checkout, event, environment) {
  const pr = event.pull_request;
  const baseSha = pr?.base?.sha;
  const headSha = pr?.head?.sha;
  const mergeSha = environment.GITHUB_SHA;
  requireValue(
    environment.GITHUB_EVENT_NAME === "pull_request" &&
      pr?.state === "open" &&
      ["main", "selective-rehearsal"].includes(pr?.base?.ref) &&
      [baseSha, headSha, mergeSha].every(
        (sha) => typeof sha === "string" && commitPattern.test(sha),
      ) &&
      git(baseRoot, "rev-parse", "HEAD") === baseSha &&
      git(checkout, "rev-parse", "HEAD") === mergeSha,
    "Unexpected pull request or checkout.",
  );

  const base = snapshot(baseRoot, baseSha);
  const policy = readEnabledPolicy(base);
  requireValue(
    [
      pr.base.repo?.id,
      pr.head.repo?.id,
      environment.GITHUB_REPOSITORY_ID,
    ].every((id) => String(id) === policy.destinationRepositoryId) &&
      pr.user?.login === policy.writerLogin &&
      pr.base.ref === policy.baseBranch,
    "Unexpected repository or writer.",
  );
  requireValue(
    git(checkout, "show", "-s", "--format=%P", headSha) === baseSha &&
      git(checkout, "show", "-s", "--format=%P", mergeSha) ===
        `${baseSha} ${headSha}` &&
      git(checkout, "show", "-s", "--format=%an%n%ae%n%cn%n%ce", headSha) ===
        [
          policy.writerLogin,
          policy.writerEmail,
          policy.writerLogin,
          policy.writerEmail,
        ].join("\n"),
    "Unexpected commit identity or ancestry.",
  );

  const head = snapshot(checkout, headSha);
  const merge = snapshot(checkout, mergeSha);
  requireValue(
    merge.tree === head.tree &&
      projectionHash(merge.files) === projectionHash(head.files),
    "The merge differs from the proposed tree.",
  );
  const release = verifyProjection(base, head, policy);
  requireValue(
    pr.head.ref === `release/${release.releaseId}` &&
      pr.title === releaseMessage(release.releaseId) &&
      typeof pr.body === "string" &&
      pr.body === releaseMessage(release.releaseId) &&
      git(checkout, "show", "-s", "--format=%B", headSha) === pr.title,
    "Unexpected public release metadata.",
  );
  return release;
}

async function main() {
  const [base, candidate] = process.argv.slice(2);
  requireValue(
    base && candidate && process.env.GITHUB_EVENT_PATH,
    "Missing pull request context.",
  );
  const event = JSON.parse(
    await readFile(process.env.GITHUB_EVENT_PATH, "utf8"),
  );
  verifyPullRequest(base, candidate, event, process.env);
  console.log("Release proof and proposed tree verified.");
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  main().catch(() => {
    // Public logs must not repeat input fields, filenames, or untrusted diagnostics.
    console.error("Release verification failed.");
    process.exitCode = 1;
  });
}
