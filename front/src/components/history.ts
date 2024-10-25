import HistoryEntryType from "../types/HistoryTypes";

function get_song_interval(entry: HistoryEntryType): [Date, Date] {
    return convert_to_start(entry);
  }
  
function convert_to_start(entry: HistoryEntryType): [Date, Date] {
// console.log(`Getting song interval for ${endTime} and ${msPlayed}`);
// Convert "endTime" : "2023-08-16 20:02", to a timestamp
const end = new Date(entry.endTime);
// Computes the startTime from the msPlayed
const start = new Date(end.getTime() - entry.msPlayed);
// console.log(`Start: ${start}, end: ${end}`);
return [start, end];
}
export { get_song_interval, convert_to_start };
