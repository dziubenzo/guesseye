import { Badge } from '@/components/ui/badge';
import type { Player } from '@/lib/types';
import { cn, getDifficultyColour } from '@/lib/utils';

type PlayerDifficultyBadgeProps = {
  difficulty: Player['difficulty'];
};

export default function PlayerDifficultyBadge({
  difficulty,
}: PlayerDifficultyBadgeProps) {
  if (difficulty === 'easy') {
    return (
      <Badge className={cn('w-[80px]', getDifficultyColour('easy'))}>
        Easy
      </Badge>
    );
  } else if (difficulty === 'medium') {
    return (
      <Badge className={cn('w-[80px]', getDifficultyColour('medium'))}>
        Medium
      </Badge>
    );
  } else if (difficulty === 'hard') {
    return (
      <Badge className={cn('w-[80px]', getDifficultyColour('hard'))}>
        Hard
      </Badge>
    );
  } else {
    return (
      <Badge className={cn('w-[80px]', getDifficultyColour('very hard'))}>
        Very Hard
      </Badge>
    );
  }
}
