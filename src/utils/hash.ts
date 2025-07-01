import { createHash } from "crypto";

function getHash(content: string, hashFunction: string): string {
  const hash = createHash(hashFunction);
  return hash.update(content).digest("hex");
}

export { getHash };
