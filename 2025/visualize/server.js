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

// Get list of available days
app.get("/api/days", async (req, res) => {
  try {
    const entries = await readdir(SOLUTIONS_DIR, { withFileTypes: true });
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
app.get("/api/input/:day", async (req, res) => {
  const { day } = req.params;
  const inputPath = join(SOLUTIONS_DIR, day, "input.txt");

  try {
    const content = await readFile(inputPath, "utf-8");
    res.json({ content });
  } catch (error) {
    res.status(404).json({ error: "Input file not found" });
  }
});

// Run a solution with provided input
app.post("/api/run", async (req, res) => {
  const { day, input } = req.body;

  if (!day || !input) {
    return res.status(400).json({ error: "Missing day or input" });
  }

  const dayDir = join(SOLUTIONS_DIR, day);
  const solutionPath = join(dayDir, "solution.py");

  try {
    const startTime = Date.now();

    const python = spawn(PYTHON, [solutionPath], {
      cwd: dayDir,
      timeout: 30000, // 30 second timeout
    });

    // Write input to stdin and close it
    python.stdin.write(input);
    python.stdin.end();

    let stdout = "";
    let stderr = "";

    python.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    python.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    python.on("close", (code) => {
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

    python.on("error", (err) => {
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
