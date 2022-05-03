import { ConfigurationChangeEvent, ExtensionContext, workspace } from "vscode";
import contributeCommands from "./contribute/commands";

export function activate(context: ExtensionContext) {
  context.subscriptions.push(...contributeCommands());
}

function deactivate(context: ExtensionContext) {
  context.subscriptions.forEach((subscription) => subscription.dispose());
}
