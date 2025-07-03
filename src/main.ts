import handleCatFile from "./commands/cat-file";
import handleHashObject from "./commands/hash-object";
import handleInit from "./commands/init";
import handleLsTree from "./commands/ls-tree";
import handleWriteTree from "./commands/write-tree";

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case "init":
    handleInit();
    break;

  case "cat-file":
    if (args.length < 3) {
      console.error("Invalid argument");
      process.exit(1);
    }
    handleCatFile(args[1] as string, args[2] as string);
    break;

  case "hash-object":
    console.log(handleHashObject(args.slice(1)));
    break;

  case "ls-tree":
    handleLsTree(args.slice(1));
    break;

  case "write-tree":
    handleWriteTree();
    break;

  default:
    console.log(`Unknown command ${command}`);
}
