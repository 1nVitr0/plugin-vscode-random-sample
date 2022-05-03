import { commands } from 'vscode';
import { sampleFromFile, sampleFromFileDialog } from '../commands/selectSample';


export default function contributeCommands() {
  return [
    commands.registerTextEditorCommand('randomSample.selectSample', sampleFromFileDialog), 
    commands.registerTextEditorCommand('randomSample.selectSampleSingle', sampleFromFile),
  ];
}
