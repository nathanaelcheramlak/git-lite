export default function manualCommitTree(): void {
  const manual = `
usage: git commit-tree [(-p <parent>)...] [-S[<keyid>]] [(-m <message>)...] [(-F <file>)...] <tree>
    -p <parent>           id of a parent commit object
    -m <message>          commit message
`;
  console.log(manual);
}
