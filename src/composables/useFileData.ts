import fetch from "node-fetch";
import { readFile } from "fs";
import { Uri } from "vscode";

export default function useFileData(uri: Uri, skipLines: number = 0) {
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
    default:
      throw new Error(`Unsupported scheme: ${uri.scheme}`);
  }

  const lines = content.then((data) => {
    const textLines = data.split(/\r?\n/).slice(skipLines);
    return textLines.map((text, line) => ({ text, line, length: text.length }));
  });

  return {
    content,
    lines,
  };
}
