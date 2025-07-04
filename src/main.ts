import handleCatFile from "./commands/cat-file";
import handleCommitTree from "./commands/commit-tree";
import handleHashObject from "./commands/hash-object";
import handleInit from "./commands/init";
import handleLsTree from "./commands/ls-tree";
import handleWriteTree from "./commands/write-tree";
import parseArgs from "./utils/arg-parser";
import validRepo from "./utils/check-if-repo";

const args = process.argv.slice(2);
const command = args[0];
const parsedArgs = parseArgs(args.slice(1));

if (!validRepo() && command !== "init") {
  console.log(
    "fatal: Not a git-lite repository (or any parent directory). Run 'git-lite init' to create one."
  );
  process.exit(1);
}

switch (command) {
  case "init":
    handleInit();
    break;

  case "cat-file":
    handleCatFile(parsedArgs);
    break;

  case "hash-object":
    console.log(handleHashObject(parsedArgs));
    break;

  case "ls-tree":
    handleLsTree(parsedArgs);
    break;

  case "write-tree":
    console.log(handleWriteTree());
    break;

  case "commit-tree":
    console.log(handleCommitTree(parsedArgs));
    break;

  default:
    console.log(`Unknown command ${command}`);
}
