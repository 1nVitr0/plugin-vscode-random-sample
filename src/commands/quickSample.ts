import { TextEditor, TextEditorEdit, Uri, workspace, window } from "vscode";
import useRandomItem from "../composables/useRandomItem";
import useFileData from "../composables/useFileData";
import usePrompts from "../composables/usePrompts";
import { parseUri } from "../composables/useFileData";

const { quickSamplePrompt } = usePrompts();

interface QuickSample {
  title: string;
  description?: string;
  size: number;
}

export interface QuickSampleFile extends QuickSample {
  file: string;
}

export interface QuickSampleEntries extends QuickSample {
  entries: string[];
}

export async function quickSample(
  editor: TextEditor,
  editBuilder: TextEditorEdit,
  quickSample: QuickSampleFile | QuickSampleEntries
) {
  let entries = "entries" in quickSample ? quickSample.entries : [];

  if ("file" in quickSample) {
    const uri = parseUri(quickSample.file);
    if (!uri) return window.showErrorMessage(`Invalid file URI: ${quickSample.file}`);

    const fileExtension = quickSample.file.split(".").pop() ?? "";
    const skipLines = workspace.getConfiguration("random-sample.skipLines").get<number>(fileExtension) ?? 0;
    const { lines } = useFileData(uri, skipLines);

    entries = (await lines).map(({ text }) => text);
  }

  const { sample } = useRandomItem(entries);
  const items = sample(quickSample.size);

  editor.edit((editBuilder) => editBuilder.insert(editor.selection.active, items.join("\n")));
}

export async function quickSampleDialog(editor: TextEditor, editBuilder: TextEditorEdit) {
  const sample = await quickSamplePrompt();
  if (!sample) return;

  quickSample(editor, editBuilder, sample);
}
