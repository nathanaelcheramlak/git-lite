import type ParsedArgsType from "../types/arg-parser.type";

export default function parseArgs(args: string[]): ParsedArgsType {
  const result: ParsedArgsType = {
    flags: {},
    options: {},
    hash: [],
    positionals: [],
    str: [],
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

    // Check if string is wrapped in quotes
    else if (/^["'].*["']$/.test(arg)) {
      result.str.push(arg);
    }

    // Otherwise positional
    else {
      result.positionals.push(arg);
    }
  }

  return result;
}

function isHash(value: string): boolean {
  return /^[a-f0-9]{40}$/i.test(value);
}

function stripQuotes(str: string): string {
  return str.replace(/^["']|["']$/g, "");
}
