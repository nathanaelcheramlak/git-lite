import { createHash } from "crypto";

function getHash(content: string, hashFunction: string): string {
  const hash = createHash(hashFunction);
  return hash.update(content).digest("hex");
}

function isHash(value: string | undefined | null): boolean {
  if (typeof value !== "string") return false;
  const SHA1_REGEX = /^[a-f0-9]{40}$/i;
  return SHA1_REGEX.test(value.trim());
}

export { getHash, isHash };
