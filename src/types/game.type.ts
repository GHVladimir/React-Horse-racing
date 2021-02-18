export type GameType = {
  betType: string; // V75, V65, V64, V4
  upcoming: Array<GameInfo>;
  results: Array<GameInfo>;
}

export type GameInfo = {
  id: string;
  startTime: string; // YYYY-MM-DDThh:mm:ss
}

export type GameResponse = {
  "@type": string;
  id: string;
  races: Array<GameRace>;
  status?: string;
};

export type GameRace = {
  id: string;
  date: string;
  name: string;
  number: number;
  scheduledStartTime: string;
  starts: Array<RaceStart>;
}

export type RaceStart = {
  number: number;
  driver: {
    firstName: string;
    lastName: string;
  }
  horse: {
    name: string;
    trainer: {
      firstName: string;
      lastName: string;
    },
    pedigree: {
      father: {
        name: string;
      }
    }
  }
}
