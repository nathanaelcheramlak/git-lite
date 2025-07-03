import manualLsTree from "../manuals/ls-tree.manual";
import { inflateSync } from "zlib";
import * as fs from "fs";

export default function handleLsTree(args: string[]): void {
  // console.log(args);
  if (args.length === 0) {
    manualLsTree();
    return;
  }

  let treeHash;
  let nameOnly = false;
  if (args[0] == "--name-only") {
    nameOnly = true;
    treeHash = args[1];
  } else {
    treeHash = args[0];
  }
  const objectPath =
    ".git-lite/objects/" + treeHash?.slice(0, 2) + "/" + treeHash?.slice(2);
  try {
    // console.log(objectPath);
    if (!fs.existsSync(objectPath)) {
      console.log("Hash not found!");
      return;
    }

    const buffer = fs.readFileSync(objectPath);
    const data = inflateSync(buffer);
    console.log(data.toString("utf-8").split(/\u0000/g));
  } catch (error) {
    console.error("something went wrong.");
  }
}
