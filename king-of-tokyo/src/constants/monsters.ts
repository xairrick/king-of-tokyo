import type { Monster } from '../types/game';

export const MONSTERS: Monster[] = [
  {
    id: 'cyber-kitty',
    name: 'Cyber Kitty',
    emoji: '🐱',
    bgColor: 'bg-cyan-900',
    borderColor: 'border-cyan-400',
    textColor: 'text-cyan-300',
  },
  {
    id: 'gigazaur',
    name: 'Gigazaur',
    emoji: '🦎',
    bgColor: 'bg-green-900',
    borderColor: 'border-green-400',
    textColor: 'text-green-300',
  },
  {
    id: 'meka-dragon',
    name: 'Meka Dragon',
    emoji: '🐉',
    bgColor: 'bg-red-900',
    borderColor: 'border-red-400',
    textColor: 'text-red-300',
  },
  {
    id: 'kong',
    name: 'Kong',
    emoji: '🦍',
    bgColor: 'bg-amber-900',
    borderColor: 'border-amber-400',
    textColor: 'text-amber-300',
  },
  {
    id: 'alienoid',
    name: 'Alienoid',
    emoji: '👾',
    bgColor: 'bg-purple-900',
    borderColor: 'border-purple-400',
    textColor: 'text-purple-300',
  },
];

export const getMonster = (id: string): Monster =>
  MONSTERS.find((m) => m.id === id) ?? MONSTERS[0];
