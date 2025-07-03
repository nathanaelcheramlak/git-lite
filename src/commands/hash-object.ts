import * as fs from "fs";
import { getHash } from "../utils/hash";
import { deflateSync } from "zlib";

export default function handleHashObject(args: string[]) {
  let filePath: string;
  let saveFile = false;

  if (args[0] === "-w") {
    filePath = args[1] as string;
    saveFile = true;
  } else {
    filePath = args[0] as string;
  }

  try {
    const fileContent = fs.readFileSync(filePath).toString("utf-8");
    const contentSize = new Blob([fileContent]).size;
    const formattedContent = "blob " + contentSize + "\u0000" + fileContent;

    const fileHash = getHash(formattedContent, "SHA-1");

    if (saveFile) {
      const compressedContent = deflateSync(formattedContent);
      const dirPath = ".git-lite/objects/" + fileHash.slice(0, 2);
      const objectPath = dirPath + "/" + fileHash.slice(2);
      fs.mkdirSync(dirPath, { recursive: true });
      fs.writeFileSync(objectPath, compressedContent);
    }

    // console.log(fileHash);
    return fileHash;
  } catch (error) {
    console.error("Something went wrong!", error);
  }
}
