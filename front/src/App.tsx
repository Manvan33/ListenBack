import HistoryImport from "./components/HistoryImport";
import HistoryFilesList from "./components/HistoryFilesList";
import Search from "./components/Search";
import "./App.css";

function App() {
  const [historyIndex, setHistoryIndex] = useState(
    localStorage.getItem("index") || {}
  );
  return (
    <>
      <main>
        <h1>
          Welcome to <span className="text-gradient">Listenback</span>
        </h1>
      </main>
      <p className="instructions">
        To get started, import <code>StreamingHistory.json</code> files to your
        browser.
        <br />
      </p>
      <Search />
      <HistoryImport desc="Select StreamingHistory.json file(s)" />
      <HistoryFilesList historyIndex={historyIndex} />
    </>
  );
}

export default App;
