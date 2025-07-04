import * as fs from "fs";
import path from "path";
import { getHash } from "../utils/hash";
import { deflateSync } from "zlib";
import type ParsedArgsType from "../types/arg-parser.type";
import manualHashObject from "../manuals/hash-object.manual";

export default function handleHashObject(args: ParsedArgsType): string | void {
  if (args.positionals.length === 0) {
    manualHashObject();
    return;
  }
  let filePath = args.positionals[0];

  if (!filePath) {
    console.error("git-lite: file not provided");
    return;
  }

  let fileContent: string;
  let fileHash: string;

  try {
    fileContent = fs.readFileSync(filePath, "utf-8");
    const fileSize = Buffer.byteLength(fileContent, "utf-8");
    const blobHeader = `blob ${fileSize}\u0000`;
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
