export const creditPacks = {
  "5": { credits: 5, amount: 900, label: "MindReply 5 credit pack" },
  "20": { credits: 20, amount: 2900, label: "MindReply 20 credit pack" },
} as const;

export type CreditPackKey = keyof typeof creditPacks;

export function isCreditPack(value: string): value is CreditPackKey {
  return value in creditPacks;
}

export function getCreditPack(value: unknown) {
  const key = String(value ?? "");
  return isCreditPack(key) ? creditPacks[key] : null;
}

export function getCreditPackCatalog() {
  return Object.values(creditPacks).map(({ credits, amount, label }) => ({ credits, amount, label }));
}
