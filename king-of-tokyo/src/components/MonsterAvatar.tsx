import { getMonster } from '../constants/monsters';

interface MonsterAvatarProps {
  monsterId: string;
  size?: 'sm' | 'md' | 'lg';
  dead?: boolean;
}

const sizeMap = {
  sm: { outer: 'w-12 h-12', emoji: 'text-2xl' },
  md: { outer: 'w-20 h-20', emoji: 'text-4xl' },
  lg: { outer: 'w-28 h-28', emoji: 'text-6xl' },
};

export default function MonsterAvatar({ monsterId, size = 'md', dead = false }: MonsterAvatarProps) {
  const monster = getMonster(monsterId);
  const { outer, emoji } = sizeMap[size];

  return (
    <div
      className={`
        ${outer} rounded-full flex items-center justify-center border-2
        ${dead ? 'bg-gray-800 border-gray-600 grayscale opacity-50' : `${monster.bgColor} ${monster.borderColor}`}
        transition-all duration-300
      `}
      title={monster.name}
    >
      <span className={`${emoji} select-none`} role="img" aria-label={monster.name}>
        {dead ? '💀' : monster.emoji}
      </span>
    </div>
  );
}
