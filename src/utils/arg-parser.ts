import type ParsedArgsType from "../types/arg-parser.type";
import { isHash } from "./hash";

export default function parseArgs(args: string[]): ParsedArgsType {
  const result: ParsedArgsType = {
    flags: {},
    options: {},
    hash: [],
    positionals: [],
  };

  for (let arg of args) {
    // Handle --key=value
    if (arg.startsWith("--") && arg.includes("=")) {
      const [key, value] = arg.slice(2).split("=");
      if (key && value) result.options[key] = stripQuotes(value);
    }

    // Handle --key
    else if (arg.startsWith("--")) {
      const key = arg.slice(2);
      result.options[key] = true;
    }

    // Handle combined flags like -am
    else if (arg.startsWith("-")) {
      for (const char of arg.slice(1)) {
        result.flags[char] = true;
      }
    }

    // Hash check
    else if (isHash(arg)) {
      result.hash.push(arg);
    }

    // Otherwise positional
    else {
      result.positionals.push(arg);
    }
  }

  return result;
}

function stripQuotes(str: string): string {
  return str.replace(/^["']|["']$/g, "");
}
