import fetch from "node-fetch";
import { readFile } from "fs";
import { Uri, workspace, window } from "vscode";
import { join } from "path";

export function parseUri(uri: string) {
  if (uri) {
    if (!/^(https?|file):\/\//.test(uri)) {
      if (/^\//.test(uri)) uri = Uri.file(uri).toString();
      else uri = Uri.file(join(workspace.rootPath ?? "", uri)).toString();
    }
    try {
      return Uri.parse(uri, true);
    } catch (error) {
      return null;
    }
  }
}

export default function useFileData(uri: Uri, skipLines: number = 0, skipEmptyLines: boolean = false) {
  let content: Promise<string>;

  switch (uri.scheme) {
    case "file":
      content = new Promise((resolve, reject) =>
        readFile(uri.path, { encoding: "utf8" }, (err, data) => (err ? reject(err) : resolve(data)))
      );
      break;
    case "http":
    case "https":
      content = fetch(uri.toString()).then((res) => res.text());
      break;
    default:
      throw new Error(`Unsupported scheme: ${uri.scheme}`);
  }

  const lines = content
    .then((data) => {
      let textLines = data.split(/\r?\n/).slice(skipLines);

      const result = textLines.map((text, line) => ({ text, line, length: text.length }));
      if (skipEmptyLines) return result.filter(({ length }) => length > 0);
      else return result;
    })
    .catch((error) => {
      window.showErrorMessage(`Failed to read file: ${uri.toString()}`);
      console.error(error);
      return [];
    });

  return {
    content,
    lines,
  };
}
