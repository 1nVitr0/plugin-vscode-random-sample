import { workspace } from "vscode";
export default function useRandomItem<T>(items: T[]) {
  let remaining = items.slice();

  function sample(
    n: number,
    remaining = items.slice(),
    wrapOnEmpty = workspace.getConfiguration("random-sample").get("allowDuplicatesOnOversizedSample")
  ): T[] {
    if (n == 1) return [items[Math.floor(Math.random() * items.length)]];

    const result = [];
    for (let i = 0; i < n && remaining.length; i++) {
      const index = Math.floor(Math.random() * remaining.length);
      result.push(remaining.splice(index, 1)[0]);
    }

    if (wrapOnEmpty && result.length < n) {
      remaining.splice(0, 0, ...items);
      return result.concat(sample(n - result.length, remaining, wrapOnEmpty));
    }

    return result;
  }

  return {
    sample: (n: number) => sample(n),
    sampleContinuous: (n: number) => sample(n, remaining),
    reset: () => (remaining = items.slice()),
  };
}
