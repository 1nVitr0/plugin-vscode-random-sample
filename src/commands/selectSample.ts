import { Selection, TextEditor, TextEditorEdit, window } from "vscode";
import useRandomItem from "../composables/useRandomItem";
import usePrompts from "../composables/usePrompts";

const { sizePrompt } = usePrompts();

export function selectSample(editor: TextEditor, editBuilder: TextEditorEdit | null, size = 1) {
  const { sample } = useRandomItem([...Array(editor.document.lineCount).keys()]);

  const selections: Selection[] = sample(size).map((line) => {
    const lineStart = editor.document.lineAt(line).range.start;
    const lineEnd = editor.document.lineAt(line).range.end;
    return new Selection(lineStart, lineEnd);
  });

  editor.selections = selections;
}

export async function selectSampleDialog(editor: TextEditor) {
  const size = await sizePrompt(1);
  if (!size) return;

  selectSample(editor, null, parseInt(size));
}
