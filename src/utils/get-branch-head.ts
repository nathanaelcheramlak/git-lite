import * as path from "path";
import * as fs from "fs";
import getRootDir from "./get-root-dir";
import { isHash } from "./hash";

/**
 * Returns the HEAD commit hash for a given branch,
 * or an empty string if not found or invalid.
 */
export default function getBranchHead(branchName: string): string {
  const headPath = path.join(
    getRootDir(),
    ".git-lite",
    "refs",
    branchName,
    "head"
  );

  try {
    if (!fs.existsSync(headPath)) {
      console.warn(`git-lite: no HEAD found for branch '${branchName}'`);
      return "";
    }

    const headHash = fs.readFileSync(headPath, "utf-8").trim();

    if (!isHash(headHash)) {
      console.error(
        `git-lite: invalid HEAD content for branch '${branchName}'`
      );
      return "";
    }

    return headHash;
  } catch (error) {
    console.error(
      `fatal: could not read HEAD for branch '${branchName}' —`,
      (error as Error).message
    );
    process.exit(1);
  }
}
