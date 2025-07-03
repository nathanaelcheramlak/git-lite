import * as fs from "fs";
import path from "path";
import { getHash } from "../utils/hash";
import { deflateSync } from "zlib";
import type ParsedArgsType from "../types/arg-parser.type";
import manualHashObject from "../manuals/hash-object.manual";

enum fileTypeEnum {
  blob = "blob",
  tree = "tree",
  commit = "commit",
}

export default function handleHashObject(args: ParsedArgsType): string | void {
  if (args.positionals.length === 0) {
    manualHashObject();
    return;
  }

  const typeStr = args.positionals[0];
  const isValidType =
    typeStr && Object.values(fileTypeEnum).includes(typeStr as fileTypeEnum);
  if (args.flags.t && (!typeStr || typeStr === "")) {
    console.error("git-lite: -t flag was used but type wasn't provided");
    return;
  }

  let filePath = undefined;
  let fileType = undefined;

  if (isValidType) {
    fileType = args.positionals[0];
    filePath = args.positionals[1];
  }

  filePath = filePath ?? args.positionals[0];
  fileType = fileType ?? "blob";

  if (filePath === undefined || fileType === undefined) {
    console.error("git-lite: file not provided");
    return;
  }

  let fileContent: string;
  let fileHash: string;

  try {
    fileContent = fs.readFileSync(filePath, "utf-8");
    const fileSize = Buffer.byteLength(fileContent, "utf-8");
    const blobHeader = `${fileType} ${fileSize}\u0000`;
    const storeContent = blobHeader + fileContent;

    fileHash = getHash(storeContent, "SHA-1");

    if (args.flags.w) {
      const compressedContent = deflateSync(storeContent);
      const dirPath = path.join(".git-lite", "objects", fileHash.slice(0, 2));
      const objectPath = path.join(dirPath, fileHash.slice(2));

      try {
        fs.mkdirSync(dirPath, { recursive: true });
        fs.writeFileSync(objectPath, compressedContent);
      } catch (error) {
        console.error(
          "git-lite: failed to write object —",
          (error as Error).message
        );
        process.exit(1);
      }
    }
  } catch (error) {
    console.error(
      "git-lite: failed to hash object —",
      (error as Error).message
    );
    process.exit(1);
  }

  return fileHash;
}
