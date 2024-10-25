import { ChangeEvent } from "react";
import { get_song_interval } from "./history";

interface FileImporterProps {
  desc: string;
}

function index_history(name: string, content: string) {
  console.log("Indexing history: " + name);
  // history = json.load(content)
  const history = JSON.parse(content);
  // Find the interval of time between the first and last songs of the history
  const start = get_song_interval(history[0])[0].toDateString();
  const end = get_song_interval(history[history.length - 1])[1].toDateString();
  const saved_index = localStorage.getItem("index") || "{}";
  const index = JSON.parse(saved_index);
  const entry = {
    startTime: start,
    endTime: end,
  };
  index[name] = entry;
  localStorage.setItem("index", JSON.stringify(index));
}

function importHistory(event: ChangeEvent<HTMLInputElement>) {
  console.log("Importing history");
  const node = event.target;
  const files = (node as HTMLInputElement).files;
  for (let i = 0; i < files!.length; i++) {
    const file = files![i];
    const reader = new FileReader();
    reader.onload = function (e) {
      const content = e.target!.result;
      localStorage.setItem(file.name, content as string);
      index_history(file.name, content as string);
    };
    reader.readAsText(file);
  }
}

export default function HistoryImport({ desc }: FileImporterProps) {
  return (
    <>
      <h2>Import history files</h2>
      <input
        type="file"
        className="history-importer"
        onChange={importHistory}
        multiple
        accept=".json"
        placeholder={desc}
      />
    </>
  );
}
