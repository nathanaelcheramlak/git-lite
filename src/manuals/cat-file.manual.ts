export default function manualCatFile(): void {
  const manual = `
usage: git-lite cat-file (-t | -s | -p) <object>

<type> can be one of: blob, tree, commit, tag
    -t                    show object type
    -s                    show object size
    -p                    pretty-print object's content
    `;
  console.log(manual);
}
