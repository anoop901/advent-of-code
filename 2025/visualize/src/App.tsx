import { useState, useEffect } from "react";
import "./App.css";

interface Day {
  name: string;
  number: number;
}

interface RunResult {
  success: boolean;
  output?: string;
  stderr?: string | null;
  part1?: string | null;
  part2?: string | null;
  error?: string;
  executionTime: number;
}

type InputSource = "uploaded" | "custom";

const API_URL = "";

function App() {
  const [days, setDays] = useState<Day[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [inputSource, setInputSource] = useState<InputSource>("custom");
  const [customInput, setCustomInput] = useState<string>("");
  const [uploadedInput, setUploadedInput] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [result, setResult] = useState<RunResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch(`${API_URL}/api/days`)
      .then((res) => res.json())
      .then((data: Day[]) => {
        setDays(data);
        if (data.length > 0) {
          setSelectedDay(data[0].name);
        }
      })
      .catch(() =>
        setError(
          "Failed to connect to server. Make sure the backend is running."
        )
      );
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedInput(event.target?.result as string);
        setInputSource("uploaded");
      };
      reader.readAsText(file);
    }
  };

  const currentInput = inputSource === "uploaded" ? uploadedInput : customInput;

  const runSolution = async () => {
    if (!selectedDay || !currentInput.trim()) {
      setError("Please select a day and provide input");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          day: selectedDay,
          input: currentInput,
        }),
      });

      const data: RunResult = await response.json();
      setResult(data);
    } catch {
      setError("Failed to run solution. Check server connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">
            <span className="star">✦</span> Advent of Code Runner
          </h1>
          <p className="subtitle">Run Python solutions with custom input</p>
        </header>

        <div className="control-row">
          <select
            id="day-select"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="select"
          >
            {days.map((day) => (
              <option key={day.name} value={day.name}>
                Day {day.number}
              </option>
            ))}
          </select>
        </div>

        <div className="toggle-group">
          <button
            className={`toggle-button ${
              inputSource === "uploaded" ? "active" : ""
            }`}
            onClick={() => setInputSource("uploaded")}
          >
            📄 Input File
          </button>
          <button
            className={`toggle-button ${
              inputSource === "custom" ? "active" : ""
            }`}
            onClick={() => setInputSource("custom")}
          >
            ✏️ Custom Text
          </button>
        </div>

        {inputSource === "uploaded" ? (
          <>
            <div className="file-picker-row">
              <label htmlFor="file-upload" className="file-picker-button">
                {uploadedFileName ? "📁 Change File" : "📁 Choose File"}
              </label>
              <input
                type="file"
                id="file-upload"
                onChange={handleFileUpload}
                accept=".txt"
                className="file-input-hidden"
              />
              {uploadedFileName && (
                <span className="file-name">{uploadedFileName}</span>
              )}
            </div>

            <textarea
              value={uploadedInput}
              placeholder="No file selected..."
              className="textarea readonly"
              rows={12}
              readOnly
            />
          </>
        ) : (
          <textarea
            id="input-textarea"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Paste your puzzle input here..."
            className="textarea"
            rows={12}
          />
        )}

        <button
          onClick={runSolution}
          disabled={isLoading || !selectedDay || !currentInput.trim()}
          className="run-button"
        >
          {isLoading ? (
            <span className="loading">
              <span className="spinner"></span>
              Running...
            </span>
          ) : (
            <>
              <span className="play-icon">▶</span>
              Run Solution
            </>
          )}
        </button>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠</span>
            {error}
          </div>
        )}

        {result && (
          <div className={`result ${result.success ? "success" : "failure"}`}>
            <div className="result-header">
              <h3>{result.success ? "✓ Solution Output" : "✗ Error"}</h3>
              <span className="execution-time">{result.executionTime}ms</span>
            </div>
            {result.success ? (
              <div className="result-parts">
                <div className="result-part">
                  <span className="part-label">Part 1</span>
                  <span className="part-value">{result.part1 || "—"}</span>
                </div>
                <div className="result-part">
                  <span className="part-label">Part 2</span>
                  <span className="part-value">{result.part2 || "—"}</span>
                </div>
              </div>
            ) : (
              <pre className="result-output">{result.error}</pre>
            )}
            {result.success && (result.output || result.stderr) && (
              <details className="output-details">
                <summary>Show full output</summary>
                {result.output && (
                  <div className="output-section">
                    <div className="output-label">stdout</div>
                    <pre className="output-content">{result.output}</pre>
                  </div>
                )}
                {result.stderr && (
                  <div className="output-section">
                    <div className="output-label">stderr</div>
                    <pre className="output-content stderr">{result.stderr}</pre>
                  </div>
                )}
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
