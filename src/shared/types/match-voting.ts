/* eslint-disable @typescript-eslint/naming-convention */

/* Match voting (faceit api response) */
export type MatchVotingApiResponse = {
  match_id: string;
  tickets: {
    entities: {
      guid: string;
      status: string;
      random: boolean;
      round: number;
      selected_by: string;
    }[];
    entity_type: string;
    vote_type: string;
  }[];
};
