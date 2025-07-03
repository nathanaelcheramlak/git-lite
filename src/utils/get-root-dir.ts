import * as fs from "fs";
import path from "path";

export default function getRootDir(startDir: string = process.cwd()): string {
  let dir = startDir;

  while (dir) {
    if (fs.existsSync(path.join(dir, ".git-lite"))) {
      return dir;
    }

    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error("Not a git-lite repository");
    }
    dir = parent;
  }
  // If somehow the loop exits without throwing, throw an error
  throw new Error("Not a git-lite repository");
}
