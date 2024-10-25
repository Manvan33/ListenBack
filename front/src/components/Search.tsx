import { HistoryEntryType } from "../types/HistoryTypes";
import { get_song_interval } from "./history";

function history_file_for_moment(moment: Date): string | null {
  const index = JSON.parse(localStorage.getItem("index") || "{}");
  for (const file of Object.keys(index)) {
    const start = new Date(index[file].startTime);
    const end = new Date(index[file].endTime);
    if (start <= moment && moment <= end) {
      return file;
    }
  }
  return null;
}

function search() {
  const input = document.getElementById("search-date") as HTMLInputElement;
  const result = document.getElementById("search-result")!;
  const moment = new Date(input.value);
  const song_result = find_closest_song(moment);
  if (song_result === null) {
    result.innerHTML = "History for this moment is not available.";
    return;
  }
  const [closest_entry, closest_interval, is_in_interval] = song_result;
  if (is_in_interval) {
    const song = closest_entry.trackName;
    const artist = closest_entry.artistName;
    const start = closest_interval[0].toLocaleTimeString();
    const end = closest_interval[1].toLocaleTimeString();
    result.innerHTML = `The song "${song}" by ${artist} was playing between ${start} and ${end}`;
  } else {
    const start = closest_interval[0].toLocaleTimeString();
    const end = closest_interval[1].toLocaleTimeString();
    result.innerHTML = `No song was playing at this exact moment. The closest song was "${closest_entry.trackName}" by ${closest_entry.artistName}. It was playing between ${start} and ${end}`;
  }
}

function find_closest_song(
  moment: Date
): [HistoryEntryType, [Date, Date], boolean] | null {
  /**
   * Finds the closest entry in the history file for a given moment.
   *
   * @param {Date} moment - The moment to find the closest entry for.
   * @returns {Array} - An array containing the closest entry, its interval, and a boolean indicating if the moment is within the interval.
   */
  const history_file = history_file_for_moment(moment);
  // console.log(`${moment} can be found in ${history_file}`);
  if (history_file === null) {
    console.log("No file contains the moment");
    return null;
  }
  const history = JSON.parse(localStorage.getItem(history_file) || "[]");
  let i = 0;
  let closest_entry = history[i];
  let closest_interval = get_song_interval(closest_entry);
  while (closest_interval[0] < moment) {
    if (closest_interval[0] < moment && moment < closest_interval[1]) {
      return [closest_entry, closest_interval, true];
    }
    i += 1;
    closest_entry = history[i];
    closest_interval = get_song_interval(closest_entry);
  }
  return [closest_entry, closest_interval, false];
}

function defaultSearchDate() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 1);
  return d.toISOString().slice(0, 16);
}

function Search() {
  return (
    <>
      <h2>Search in history</h2>
      <input
        id="search-date"
        value={defaultSearchDate()}
        type="datetime-local"
      />
      <input id="search-button" type="button" value="Search" onClick={search} />
      <p id="search-result"></p>
    </>
  );
}

export default Search;
