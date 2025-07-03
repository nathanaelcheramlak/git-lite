import * as fs from "fs";
import { inflateSync } from "zlib";
import * as path from "path";
import getRootDir from "../utils/get-root-dir";
import manualCatFile from "../manuals/cat-file.manual";
import type ParsedArgsType from "../types/arg-parser.type";

export default function handleCatFile(args: ParsedArgsType): void {
  const hash = args.hash[0];
  if (hash === undefined) {
    manualCatFile();
    return;
  }

  const objectPath = path.join(
    getRootDir(),
    ".git-lite",
    "objects",
    hash.slice(0, 2),
    hash.slice(2)
  );

  let data;
  let fileHeader;

  try {
    if (!fs.existsSync(objectPath)) {
      console.error("git-lite: hash doesn't exist");
      process.exit(1);
    }

    const buffer = fs.readFileSync(objectPath);
    data = inflateSync(buffer).toString("utf-8");
    fileHeader = data.split("\u0000")[0] ?? "";
  } catch (error) {
    console.error(
      "git-lite: failed to read object —",
      (error as Error).message
    );
    process.exit(1);
  }

  switch (true) {
    case args.flags.p:
      const fileContent = data.split("\u0000")[1];
      process.stdout.write(fileContent ?? "");
      break;

    case args.flags.t:
      const fileType = fileHeader.split(" ")[0];
      console.log(fileType);
      break;

    case args.flags.s:
      const fileSize = fileHeader.split(" ")[1];
      console.log(fileSize);
      break;

    default:
      manualCatFile();
  }
}
