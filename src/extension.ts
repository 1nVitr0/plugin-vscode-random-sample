import { ExtensionContext, workspace } from "vscode";
import { updateInitialSampleFile } from "./commands/sampleFromFile";
import contributeCommands from "./contribute/commands";

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    ...contributeCommands(),
    workspace.onDidChangeConfiguration((change) => {
      if (change.affectsConfiguration("random-sample.initialSampleFile")) updateInitialSampleFile();
    })
  );

  updateInitialSampleFile();
}

function deactivate(context: ExtensionContext) {
  context.subscriptions.forEach((subscription) => subscription.dispose());
}
