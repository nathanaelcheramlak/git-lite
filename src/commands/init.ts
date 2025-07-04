import * as fs from "fs";

export default function handleInit(): void {
  try {
    fs.mkdirSync(".git-lite", { recursive: true });
    fs.mkdirSync(".git-lite/objects", { recursive: true });
    fs.mkdirSync(".git-lite/refs/main", { recursive: true });
    fs.writeFileSync(".git-lite/HEAD", "ref: refs/heads/main\n");

    console.log("Initialized git-lite directory");
  } catch (error: any) {
    console.error("Couldn't initialize a git-lite repo\n", error);
  }
}
