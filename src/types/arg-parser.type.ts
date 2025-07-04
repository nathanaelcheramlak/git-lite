export default interface ParsedArgsType {
  flags: Record<string, boolean | string>;
  options: Record<string, string | boolean>;
  hash: string[];
  positionals: string[];
}
