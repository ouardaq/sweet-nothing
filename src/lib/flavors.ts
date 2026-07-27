export const FLAVOR_WASHES: Record<string, string> = {
  strawberry: '#fdeaf1',
  matcha: '#eef6dc',
  ramune: '#e3f3fd',
  lavender: '#efeafd',
  redbean: '#f7ecdc',
  custard: '#fdf3da',
};

export const DEFAULT_WASH = FLAVOR_WASHES.strawberry;

export function flavorWash(flavor: string | null | undefined): string {
  if (!flavor) return DEFAULT_WASH;
  return FLAVOR_WASHES[flavor] ?? DEFAULT_WASH;
}
