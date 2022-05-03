import { window, Uri } from "vscode";

export default function usePrompts() {
  async function sampleFilePrompt(previousUri?: Uri) {
    const url = await window.showInputBox({
      placeHolder: "URL to a data file",
      prompt: "📁 Leave blank to select a local file",
    });

    if (url) return [Uri.parse(url)];

    return await window.showOpenDialog({
      title: "Select a file to sample",
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      openLabel: "Select",
      defaultUri: previousUri,
    });
  }

  async function sizePrompt(defaultValue = 1) {
    return await window.showInputBox({
      prompt: "How many lines do you want to sample?",
      value: defaultValue.toString(),
      valueSelection: [0, 1],
      validateInput: (value) => {
        if (value === "") return "You must enter a number";
        if (Number.isNaN(Number(value))) return "You must enter a number";
        if (Number(value) < 1) return "You must enter a number greater than 0";
        return null;
      },
    });
  }

  return { sampleFilePrompt, sizePrompt };
}
