import type { Player, PlayersMap } from '@/lib/types';
import { normaliseToString } from '@/lib/utils';
import { getPlayers } from '@/server/db/get-players';

const players = await getPlayers();

const playersMap: PlayersMap = new Map<string, Player>();
const playersNormalisedMap: PlayersMap = new Map<string, Player>();

for (const player of players) {
  playersMap.set(player.firstName + ' ' + player.lastName, player);
  playersNormalisedMap.set(
    normaliseToString(player.firstName) +
      ' ' +
      normaliseToString(player.lastName),
    player
  );
}

export { playersMap, playersNormalisedMap };
