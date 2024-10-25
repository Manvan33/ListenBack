//{"StreamingHistory1.json":{"startTime":"Sun Aug 20 2023","endTime":"Fri Dec 01 2023"},"StreamingHistory0.json":{"startTime":"Fri Nov 11 2022","endTime":"Sun Aug 20 2023"}}
type HistoryFilesIndexType = {
  [key: string]: {
    startTime: string;
    endTime: string;
  };
};
// {
//     "endTime" : "2022-12-01 09:57",
//     "artistName" : "Muse",
//     "trackName" : "Ghosts (How Can I Move On) [feat. Elisa]",
//     "msPlayed" : 217301
//   }
type HistoryEntryType = {
  endTime: string;
  artistName: string;
  trackName: string;
  msPlayed: number;
};

export type { HistoryEntryType, HistoryIndexType };
