import getRootDir from "./get-root-dir";

export default function validRepo() {
  try {
    const rootDir = getRootDir();
    return true;
  } catch (error) {
    return false;
  }
}
