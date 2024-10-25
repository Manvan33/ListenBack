import { HistoryIndexType } from "../types/HistoryTypes";

interface HistoryFileEntryProps {
  filename: string;
  startTime: string;
  endTime: string;
}

function HistoryFileEntry({
  filename,
  startTime,
  endTime,
}: HistoryFileEntryProps) {
  return (
    <li>
      {filename} - {startTime} to {endTime}
    </li>
  );
}

function generateList(historyIndex: HistoryIndexType) {
  return Object.keys(historyIndex).map((filename) => {
    const { startTime, endTime } = historyIndex[filename];
    return (
      <HistoryFileEntry
        filename={filename}
        startTime={startTime}
        endTime={endTime}
      />
    );
  });
}

function HistoryFilesList(historyIndex: HistoryIndexType) {
  return (
    <>
      <h3>History files</h3>
      <ul id="storage-list">{generateList(historyIndex)}</ul>
    </>
  );
}

export default HistoryFilesList;
