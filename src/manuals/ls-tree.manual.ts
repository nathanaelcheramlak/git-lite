export default function manualLsTree(): void {
  const manual = `
usage: git ls-tree [<options>] <tree-ish> [<path>...]
  -d                    only show trees
  -l, --long            include object size
  --name-only           list only filenames
  --name-status         list only filenames
    `;
  console.log(manual);
}
