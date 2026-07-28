import type { SpriteSwap } from './sprites';

export type CategoryConfig = {
  id: string;
  label: string;
  spriteKey: string;
  spriteSwap: SpriteSwap | null;
  wash: string;
};

export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'mochi',
    label: 'Mochi',
    spriteKey: 'mochi',
    spriteSwap: { w: '#ffd9e6', p: '#ff6f6f' },
    wash: '#fdeaf1',
  },
  {
    id: 'pancake',
    label: 'Pancakes',
    spriteKey: 'dorayaki',
    spriteSwap: null,
    wash: '#f7ecdc',
  },
  {
    id: 'pastry',
    label: 'Pastries',
    spriteKey: 'macaron',
    spriteSwap: null,
    wash: '#efeafd',
  },
];
