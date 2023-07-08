/* Metrics model (extension) */
export interface MetricsModel {
  overall: Partial<SkillMetricsModel>;
  maps: {
    [key: string]: Partial<SkillMetricsModel & OtherMetricsModel>;
  };
}

/* Skill metrics model (extension) */
export interface SkillMetricsModel extends Record<string, number> {
  matches: number;
  winRate: number;
  avgKills: number;
  avgDeaths: number;
  avgHeadshots: number;
  avgKd: number;
  avgKr: number;
}

/* Other metrics model (extension) */
export interface OtherMetricsModel extends Record<string, number> {
  pickRate: number;
}

/* Drop metrics model (extension) */
export interface DropMetricsModel extends Record<string, number> {
  dropMatches: number;
  dropRate: number;
}
