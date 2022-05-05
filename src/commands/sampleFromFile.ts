import { TextEditor, TextEditorEdit, Uri, window, workspace } from "vscode";
import useRandomItem from "../composables/useRandomItem";
import useFileData from "../composables/useFileData";
import usePrompts from "../composables/usePrompts";
import { parseUri } from "../composables/useFileData";

const { sampleFilePrompt, sizePrompt } = usePrompts();
let previousUri: Uri | undefined = undefined;

export function updateInitialSampleFile() {
  if (previousUri) return;

  let initialSampleFile: string | undefined = workspace.getConfiguration("random-sample").get("initialSampleFile");

  if (initialSampleFile) {
    const uri = parseUri(initialSampleFile);
    if (uri) previousUri = uri;
  }
}

export async function sampleFromFile(
  editor: TextEditor,
  editBuilder: TextEditorEdit,
  uri: Uri | undefined = previousUri,
  size = 1
) {
  if (!uri) return window.showErrorMessage("No file selected. Please use select a file first.");

  const fileExtension = uri.fsPath.split(".").pop() ?? "";
  const skipLines = workspace.getConfiguration("random-sample.skipLines").get<number>(fileExtension) ?? 0;
  const skipEmptyLines = workspace
    .getConfiguration("random-sample")
    .get<"file" | "selection" | boolean>("skipEmptyLines");
  const { lines } = useFileData(uri, skipLines, skipEmptyLines === "file" || skipEmptyLines === true);
  const { sample } = useRandomItem(await lines);

  const items = sample(size);
  const insert = items.map(({ text }) => text).join("\n");

  editor.edit((editBuilder) => editBuilder.insert(editor.selection.active, insert));
}

export async function sampleFromFileFullDialog(editor: TextEditor, editBuilder: TextEditorEdit) {
  const file = await sampleFilePrompt(previousUri);
  if (!file || !file.length) return;

  const size = await sizePrompt(1);
  if (!size) return;

  sampleFromFile(editor, editBuilder, (previousUri = file[0]), parseInt(size));
}

export async function sampleFromFileSizeDialog(editor: TextEditor, editBuilder: TextEditorEdit) {
  const size = await sizePrompt(1);
  if (!size) return;

  sampleFromFile(editor, editBuilder, previousUri, parseInt(size));
}

export async function sampleFromFileSingleDialog(editor: TextEditor, editBuilder: TextEditorEdit) {
  const file = await sampleFilePrompt(previousUri);
  if (!file || !file.length) return;

  sampleFromFile(editor, editBuilder, previousUri, 1);
}
