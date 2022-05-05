import { workspace, window } from "vscode";
export default function useRandomItem<T>(items: T[], verify?: (item: T) => boolean) {
  let remaining = items.slice();

  function sample(
    n: number,
    remaining = items.slice(),
    wrapOnEmpty = workspace.getConfiguration("random-sample").get("allowDuplicatesOnOversizedSample")
  ): T[] {
    if (n == 1) return [items[Math.floor(Math.random() * items.length)]];

    let containsValidItems = remaining.length < items.length;
    const result = [];
    while (result.length < n && remaining.length) {
      const index = Math.floor(Math.random() * remaining.length);
      const item = remaining.splice(index, 1)[0];

      if (!verify || verify(item)) {
        result.push(item);
        containsValidItems = true;
      }
    }

    if (result.length < n && wrapOnEmpty && containsValidItems) {
      remaining.splice(0, 0, ...items);
      return result.concat(sample(n - result.length, remaining, wrapOnEmpty));
    } else if (result.length < n) {
      window.showInformationMessage(`Random Sample: Could not find ${n} items, only found ${result.length}.`);
    }

    return result;
  }

  return {
    sample: (n: number) => sample(n),
    sampleContinuous: (n: number) => sample(n, remaining),
    reset: () => (remaining = items.slice()),
  };
}
