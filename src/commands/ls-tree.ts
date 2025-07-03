import manualLsTree from "../manuals/ls-tree.manual";
import { inflateSync } from "zlib";
import * as fs from "fs";
import type ParsedArgsType from "../types/arg-parser.type";
import getRootDir from "../utils/get-root-dir";
import path from "path";

export default function handleLsTree(args: ParsedArgsType): void {
  const treeHash = args.hash[0];
  if (!treeHash) {
    manualLsTree();
    return;
  }

  const objectPath = path.join(
    getRootDir(),
    ".git-lite/objects",
    treeHash.slice(0, 2),
    treeHash.slice(2)
  );

  let decompressed: Buffer;
  let data: string[];

  try {
    if (!fs.existsSync(objectPath)) {
      console.log("git-lite: hash not found!");
      return;
    }

    const buffer = fs.readFileSync(objectPath);
    decompressed = inflateSync(buffer);
    data = decompressed.toString().split(/\u0000/g);
  } catch (error) {
    console.log("git-lite: failed to read object —", (error as Error).message);
    process.exit(1);
  }

  const treeEntries = data.slice(1);
  if (args.flags.d) {
    const onlyTree: string[] = [];

    for (let i of treeEntries.keys()) {
      if (i % 2 || !treeEntries[i]) continue;

      const [type, name] = treeEntries[i].split(" ");
      if (type == "40000" && treeEntries[i] !== undefined)
        onlyTree.push(treeEntries[i] + " " + treeEntries[i + 1]);
    }

    console.log(onlyTree.join("\n"));
  } else if (args.options["name-only"] || args.options["name-status"]) {
    const onlyName: string[] = [];

    for (let i of treeEntries.keys()) {
      if (i % 2 || !treeEntries[i]) continue;
      const [type, name] = treeEntries[i].split(" ");
      onlyName.push(name!);
    }

    console.log(onlyName.sort().join("\n"));
  } else {
    console.log(decompressed.toString());
  }
}
