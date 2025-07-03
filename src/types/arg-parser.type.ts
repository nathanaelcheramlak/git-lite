export default interface ParsedArgsType {
  flags: Record<string, boolean>;
  options: Record<string, string | boolean>;
  hash: string[];
  positionals: string[];
  str: string[];
}
