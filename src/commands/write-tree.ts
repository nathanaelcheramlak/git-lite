import * as fs from "fs";
import path from "path";
import { deflateSync } from "zlib";
import { getHash } from "../utils/hash";
import getRootDir from "../utils/get-root-dir";
import handleHashObject from "./hash-object";
import parseArgs from "../utils/arg-parser";

export default function handleWriteTree(gitDir: string = ".git-lite"): string {
  const workingDir = getRootDir();

  function buildTreeObject(currentDir: string): string {
    const entries = fs
      .readdirSync(currentDir)
      .filter((e) => e !== path.basename(gitDir));

    if (entries.length === 0) {
      return getHash(`tree 0\0`, "SHA-1");
    }

    const treeEntries: string[] = [];

    for (const entry of entries) {
      const entryPath = path.join(currentDir, entry);
      const stats = fs.statSync(entryPath);

      if (stats.isFile()) {
        let blobHash = handleHashObject(parseArgs(["-w", entryPath]));
        treeEntries.push(`100644 ${entry}\0${blobHash}`);
      } else if (stats.isDirectory()) {
        let subtreeHash = buildTreeObject(entryPath);
        treeEntries.push(`40000 ${entry}\0${subtreeHash}`);
      }
    }

    const treeContent = treeEntries.join("\0");
    const treeSize = Buffer.byteLength(treeContent, "utf8");
    const treeHeader = `tree ${treeSize}\0`;
    const fullTree = treeHeader + treeContent;

    const treeHash = getHash(fullTree, "SHA-1");

    const objectsDir = path.join(gitDir, "objects", treeHash.slice(0, 2));
    const objectPath = path.join(objectsDir, treeHash.slice(2));

    fs.mkdirSync(objectsDir, { recursive: true });
    fs.writeFileSync(objectPath, deflateSync(fullTree));

    return treeHash;
  }

  return buildTreeObject(workingDir);
}
