export default function manualHashObject(): void {
  const manual = `
usage: git-lite hash-object [-t <type>] [-w] <file>...
or: git hash-object
  -t <type>             object type
  -w                    write the object into the object database
`;
  console.log(manual);
}
