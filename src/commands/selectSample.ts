import { Selection, TextEditor, TextEditorEdit, window, workspace } from "vscode";
import useRandomItem from "../composables/useRandomItem";
import usePrompts from "../composables/usePrompts";

const { sizePrompt } = usePrompts();

export function selectSample(editor: TextEditor, editBuilder: TextEditorEdit | null, size = 1) {
  const skipEmptyLines = workspace
    .getConfiguration("random-sample")
    .get<"file" | "selection" | boolean>("skipEmptyLines");

  const verify =
    skipEmptyLines === "selection" || skipEmptyLines === true
      ? (line: number) => !editor.document.lineAt(line).isEmptyOrWhitespace
      : undefined;
  const { sample } = useRandomItem([...Array(editor.document.lineCount).keys()], verify);

  const selections: Selection[] = sample(size).map((line) => {
    const lineStart = editor.document.lineAt(line).range.start;
    const lineEnd = editor.document.lineAt(line).range.end;
    return new Selection(lineEnd, lineStart);
  });

  editor.selections = selections;
}

export async function selectSampleDialog(editor: TextEditor) {
  const size = await sizePrompt(1);
  if (!size) return;

  selectSample(editor, null, parseInt(size));
}
