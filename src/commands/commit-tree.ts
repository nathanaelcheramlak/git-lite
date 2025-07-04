import manualCommitTree from "../manuals/commit-tree.manual";
import type ParsedArgsType from "../types/arg-parser.type";
import * as path from "path";
import getRootDir from "../utils/get-root-dir";
import getBranchHead from "../utils/get-branch-head";
import { getHash, isHash } from "../utils/hash";
import * as fs from "fs";
import { deflateSync } from "zlib";

export default function handleCommitTree(args: ParsedArgsType): string {
  // Default branch
  const branchName = "main";

  // Validate tree hash
  const treeHash = args.hash[0]?.trim();
  if (!treeHash || !isHash(treeHash)) {
    manualCommitTree();
    process.exit(1);
  }

  // Commit message
  const commitMessage = ((args.flags.m as string) ?? "").trim();
  if (!commitMessage) {
    console.error("fatal: commit message (-m) is required");
    process.exit(1);
  }

  // Parent hash
  let parentHash = getBranchHead(branchName);
  if (args.flags.p) {
    if (!args.hash[1] || !isHash(args.hash[1])) {
      console.error("fatal: -p flag requires a valid parent commit hash");
      process.exit(1);
    }
    parentHash = args.hash[1];
  }

  let commitHash: string;

  try {
    // Build commit lines
    const commitLines = [];
    commitLines.push(`tree ${treeHash}`);
    if (parentHash) commitLines.push(`parent ${parentHash}`);
    commitLines.push(`committer user <user@example.com> ${Date.now()}`);
    commitLines.push(commitMessage);

    // Assemble commit content
    const commitContent = commitLines.join("\u0000");
    const header = `commit ${Buffer.byteLength(commitContent, "utf-8")}\u0000`;
    const commit = header + commitContent;

    // Hash and compress
    commitHash = getHash(commit, "SHA-1");
    const compressedCommit = deflateSync(commit);

    // Write object
    const objectDir = path.join(
      getRootDir(),
      ".git-lite",
      "objects",
      commitHash.slice(0, 2)
    );
    const objectPath = path.join(objectDir, commitHash.slice(2));
    fs.mkdirSync(objectDir, { recursive: true });
    fs.writeFileSync(objectPath, compressedCommit);

    // Update branch HEAD
    const branchPath = path.join(
      getRootDir(),
      ".git-lite",
      "refs",
      branchName,
      "head"
    );
    fs.mkdirSync(path.dirname(branchPath), { recursive: true });
    fs.writeFileSync(branchPath, commitHash);
  } catch (error) {
    console.error("fatal: couldn't commit tree —", (error as Error).message);
    process.exit(1);
  }

  return commitHash;
}
