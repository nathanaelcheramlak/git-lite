import handleCatFile from "./commands/cat-file";
import handleHashObject from "./commands/hash-object";
import handleInit from "./commands/init";

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
    let filePath: string;
    let saveFile = false;

    if (args[1] === "-w") {
      filePath = args[2] as string;
      saveFile = true;
    } else {
      filePath = args[1] as string;
    }

    handleHashObject(filePath, saveFile);
    break;

  default:
    console.log(`Unknown command ${command}`);
}
