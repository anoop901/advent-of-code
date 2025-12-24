import express from "express";
import { spawn } from "child_process";
import { readdir, readFile } from "fs/promises";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOLUTIONS_DIR = join(__dirname, "..");

// Determine which Python to use: prefer venv, fall back to system
const venvPython = join(SOLUTIONS_DIR, ".venv", "bin", "python");
const PYTHON = existsSync(venvPython) ? venvPython : "python3";

const app = express();
app.use(express.json({ limit: "10mb" }));

// Get list of available years
app.get("/api/years", async (req, res) => {
  try {
    const entries = await readdir(SOLUTIONS_DIR, { withFileTypes: true });
    const years = entries
      .filter((entry) => entry.isDirectory() && entry.name.match(/^\d{4}$/))
      .map((entry) => parseInt(entry.name))
      .sort((a, b) => b - a); // newest first
    res.json(years);
  } catch (error) {
    res.status(500).json({ error: "Failed to list years" });
  }
});

// Get list of available days for a year
app.get("/api/days/:year", async (req, res) => {
  const { year } = req.params;
  const yearDir = join(SOLUTIONS_DIR, year);

  try {
    const entries = await readdir(yearDir, { withFileTypes: true });
    const days = entries
      .filter((entry) => entry.isDirectory() && entry.name.match(/^day\d+$/))
      .map((entry) => {
        const num = parseInt(entry.name.replace("day", ""));
        return { name: entry.name, number: num };
      })
      .sort((a, b) => a.number - b.number);
    res.json(days);
  } catch (error) {
    res.status(500).json({ error: "Failed to list days" });
  }
});

// Get input file contents for a day
app.get("/api/input/:year/:day", async (req, res) => {
  const { year, day } = req.params;
  const inputPath = join(SOLUTIONS_DIR, year, day, "input.txt");

  try {
    const content = await readFile(inputPath, "utf-8");
    res.json({ content });
  } catch (error) {
    res.status(404).json({ error: "Input file not found" });
  }
});

// Run a solution with provided input
app.post("/api/run", async (req, res) => {
  const { year, day, input } = req.body;

  if (!year || !day || !input) {
    return res.status(400).json({ error: "Missing year, day, or input" });
  }

  const dayDir = join(SOLUTIONS_DIR, String(year), day);

  // Detect solution type
  let command, args;
  if (existsSync(join(dayDir, "solution.py"))) {
    command = PYTHON;
    args = [join(dayDir, "solution.py")];
  } else if (existsSync(join(dayDir, "main.go"))) {
    command = "go";
    args = ["run", join(dayDir, "main.go")];
  } else if (existsSync(join(dayDir, "main.ts"))) {
    command = "npx";
    args = ["ts-node", join(dayDir, "main.ts")];
  } else {
    return res.status(404).json({
      error: "No solution file found (solution.py, main.go, or main.ts)",
    });
  }

  try {
    const startTime = Date.now();

    const proc = spawn(command, args, {
      cwd: dayDir,
      timeout: 30000, // 30 second timeout
    });

    // Handle stdin errors (e.g., process exits before we can write)
    proc.stdin.on("error", () => {
      // Ignore EPIPE errors - the process will report via stderr
    });

    // Write input to stdin and close it
    proc.stdin.write(input);
    proc.stdin.end();

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    proc.on("close", (code) => {
      const executionTime = Date.now() - startTime;

      if (code === 0) {
        const output = stdout.trim();
        const lines = output.split("\n");
        const lastLine = lines[lines.length - 1] || "";
        const parts = lastLine.trim().split(/\s+/);

        res.json({
          success: true,
          output,
          stderr: stderr.trim() || null,
          part1: parts[0] || null,
          part2: parts[1] || null,
          executionTime,
        });
      } else {
        res.json({
          success: false,
          error: stderr || `Process exited with code ${code}`,
          executionTime,
        });
      }
    });

    proc.on("error", (err) => {
      res.status(500).json({ error: `Failed to run solution: ${err.message}` });
    });
  } catch (error) {
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
