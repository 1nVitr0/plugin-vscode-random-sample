import { TextEditor, TextEditorEdit, Uri, workspace, window } from "vscode";
import useRandomItem from "../composables/useRandomItem";
import useFileData from "../composables/useFileData";
import usePrompts from "../composables/usePrompts";
import { parseUri } from "../composables/useFileData";
import { sampleFromFile } from "./sampleFromFile";

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

export function quickSample(
  editor: TextEditor,
  editBuilder: TextEditorEdit,
  quickSample: QuickSampleFile | QuickSampleEntries
) {
  let entries = "entries" in quickSample ? quickSample.entries : [];

  if ("file" in quickSample) {
    const uri = parseUri(quickSample.file);
    if (!uri) return window.showErrorMessage(`Invalid file URI: ${quickSample.file}`);

    sampleFromFile(editor, editBuilder, uri, quickSample.size);
  } else {
    const { sample } = useRandomItem(entries);
    const items = sample(quickSample.size);

    editor.edit((editBuilder) => editBuilder.insert(editor.selection.active, items.join("\n")));
  }
}

export async function quickSampleDialog(editor: TextEditor, editBuilder: TextEditorEdit) {
  const sample = await quickSamplePrompt();
  if (!sample) return;

  quickSample(editor, editBuilder, sample);
}
