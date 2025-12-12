import type { Player, PlayersMap } from '@/lib/types';
import { getPlayers } from '@/server/db/get-players';

const players = await getPlayers();

const playersMap: PlayersMap = new Map<string, Player>();

for (const player of players) {
  playersMap.set(player.firstName + ' ' + player.lastName, player);
}

export { playersMap };
