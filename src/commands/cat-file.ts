import * as fs from "fs";
import { inflateSync } from "zlib";

export default function handleCatFile(flag: string, objectHash: string): void {
  const objectPath =
    ".git-lite/objects/" + objectHash.slice(0, 2) + "/" + objectHash.slice(2);
  switch (flag) {
    case "-p":
      if (!fs.existsSync(objectPath)) {
        console.log("Hash not found!");
        return;
      }

      const buffer = fs.readFileSync(objectPath);
      const data = inflateSync(buffer).toString("utf-8");
      const fileContent = data.split(/\u0000/g)[1];

      process.stdout.write(fileContent ?? "");
      break;
    default:
      console.log(`cat-file does not have a ${flag} flag`);
  }
}
