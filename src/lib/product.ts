export function productAttributes(flavor: string | null | undefined): string[] {
  return [
    'hand-made today',
    'no preservatives',
    ...(flavor ? [`${flavor.toLowerCase()} flavor`] : []),
    'serves 1',
  ];
}
