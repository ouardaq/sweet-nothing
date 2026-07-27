const WASHES: Record<string, string> = {
  strawberry: '#fdeaf1',
  matcha: '#eef6dc',
  ramune: '#e3f3fd',
  soda: '#e3f3fd', // the design labels the ramune flavour "Soda"
  lavender: '#efeafd',
  redbean: '#f7ecdc',
  chocolate: '#f7ecdc', // beyond the spec's six; warm cream suits it
  custard: '#fdf3da',
};

export const DEFAULT_WASH = '#fdeaf1';

function normalise(flavor: string): string {
  return flavor.toLowerCase().replace(/[^a-z]/g, '');
}

export function flavorWash(flavor: string | null | undefined): string {
  if (!flavor) return DEFAULT_WASH;
  return WASHES[normalise(flavor)] ?? DEFAULT_WASH;
}
