import randomItem from "random-item";
import { Selection, TextEditor, TextEditorEdit, window } from "vscode";

export function sampleFromFile(editor: TextEditor, editBuilder: TextEditorEdit, size = 1) {
  const lines = [ ...Array(editor.document.lineCount).keys() ];

  const selections: Selection[] = randomItem.multiple(lines, size).map((line) => {
    const lineStart = editor.document.lineAt(line).range.start;
    const lineEnd = editor.document.lineAt(line).range.end;
    return new Selection(lineStart, lineEnd);
  });

  editor.selections = selections;
}

export async  function sampleFromFileDialog(editor: TextEditor, editBuilder: TextEditorEdit) {
  const n = await window.showInputBox({
    prompt: "How many lines do you want to sample?",
    validateInput: (value) => {
      if (value === "") return "You must enter a number";
      if (Number.isNaN(Number(value))) return "You must enter a number";
      if (Number(value) < 1) return "You must enter a number greater than 0";
      return null;
    },
  });

  if (!n) return;

  sampleFromFile(editor, editBuilder, parseInt(n));
}
