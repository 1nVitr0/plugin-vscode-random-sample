import { commands } from "vscode";
import { quickSampleDialog } from "../commands/quickSample";
import {
  sampleFromFile,
  sampleFromFileFullDialog,
  sampleFromFileSingleDialog,
  sampleFromFileSizeDialog,
} from "../commands/sampleFromFile";
import { selectSample, selectSampleDialog } from "../commands/selectSample";

export default function contributeCommands() {
  return [
    commands.registerTextEditorCommand("randomSample.selectSample", selectSampleDialog),
    commands.registerTextEditorCommand("randomSample.selectSampleSingle", selectSample),
    commands.registerTextEditorCommand("randomSample.sampleFromFile", sampleFromFileFullDialog),
    commands.registerTextEditorCommand("randomSample.sampleAgainFromFile", sampleFromFileSizeDialog),
    commands.registerTextEditorCommand("randomSample.sampleFromFileSingle", sampleFromFile),
    commands.registerTextEditorCommand("randomSample.sampleAgainFromFileSingle", sampleFromFileSingleDialog),
    commands.registerTextEditorCommand("randomSample.sampleFromQuickSample", quickSampleDialog),
  ];
}
