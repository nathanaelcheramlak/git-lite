import getRootDir from "../utils/get-root-dir";
import * as fs from "fs";
import { getHash } from "../utils/hash";
import { deflateSync } from "zlib";
import path from "path";
import handleHashObject from "./hash-object";

export default function handleWriteTree(): void {
  try {
    const workingDir = getRootDir();
    // when you finish make your variable names readable
    function recurse(workingDir: string) {
      const directoryContent = fs.readdirSync(workingDir);
      if (directoryContent.length == 0) {
        return getHash("tree 0" + "\u0000", "SHA-1");
      }

      const treeContent = [];
      for (let child of directoryContent) {
        if (child === ".git-lite") {
          continue;
        }

        if (fs.statSync(path.join(workingDir, child)).isFile()) {
          let childHash = handleHashObject([path.join(workingDir, child)]);
          childHash = "4000 " + child + "\u0000" + childHash;
          treeContent.push(childHash);
        }

        if (fs.statSync(path.join(workingDir, child)).isDirectory()) {
          let treeHash = recurse(path.join(workingDir, child));
          treeHash = "2400 " + child + "\u0000" + treeHash;
          treeContent.push(treeHash);
        }
      }
      // console.log(workingDir, treeContent);
      let treeContentStr: string = treeContent.join("\u0000");
      const treeContentSize = new Blob([treeContentStr]).size;
      const tree = "tree " + treeContentSize + "  " + "\u0000" + treeContentStr;
      // console.log(tree);
      const treeHash = getHash(tree, "SHA-1");
      const compressedTree = deflateSync(tree);
      const dirPath = ".git-lite/objects/" + treeHash.slice(0, 2);
      // console.log("DirPATH: ", dirPath);
      const treePath = dirPath + "/" + treeHash.slice(2);

      fs.mkdirSync(dirPath, { recursive: true });
      fs.writeFileSync(treePath, compressedTree);
      return treeHash;
    }
    console.log(recurse(workingDir));
  } catch (error) {
    console.error("Something went wrong!", error);
  }
}
