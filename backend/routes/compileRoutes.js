const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/", async (req, res) => {
  const { code, language_id, stdin } = req.body;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Invalid code provided" });
  }
  if (!language_id) {
    return res.status(400).json({ error: "Language ID is required" });
  }

  // 🔒 Security: Block dangerous imports & functions in Python
  const forbiddenPatterns = ["os.", "subprocess.", "sys.", "eval(", "exec("];
  if (forbiddenPatterns.some((pattern) => code.includes(pattern))) {
    return res.status(400).json({ error: "Security Violation: Unsafe code detected!" });
  }

  const payload = {
    language_id,
    source_code: Buffer.from(code).toString("base64"),
    stdin: Buffer.from(stdin || "").toString("base64"),
    enable_network: false, // 🔹 Security: Disable network & file system access
  };

  console.log("Received code:", code);

  try {
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        },
        params: {
          base64_encoded: true,
          wait: false,
          fields: "*",
        },
      }
    );

    console.log("Submission response:", response.data);
    const { token } = response.data;

    let result;
    try {
      for (let i = 0; i < 10; i++) {
        // 🔹 Max retries: 10
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Poll every 1 sec
        result = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          {
            headers: {
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
              "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
            },
            params: {
              base64_encoded: true,
              fields: "*",
            },
          }
        );

        const status = result.data.status.id;
        console.log("Polling result:", result.data);

        if (status !== 1 && status !== 2) break; // 🔹 Exit polling when status is final
      }
    } catch (pollingError) {
      console.error("Polling failed:", pollingError);
      return res.status(500).json({ error: "Error fetching execution results" });
    }

    // 🔹 Decode base64 encoded fields
    if (result.data.stdout) {
      result.data.stdout = Buffer.from(result.data.stdout, "base64").toString("utf-8");
    }
    if (result.data.stderr) {
      result.data.stderr = Buffer.from(result.data.stderr, "base64").toString("utf-8");
    }
    if (result.data.compile_output) {
      result.data.compile_output = Buffer.from(result.data.compile_output, "base64").toString("utf-8");
    }
    if (result.data.message) {
      result.data.message = Buffer.from(result.data.message, "base64").toString("utf-8");
    }

    // 🔹 Handle different execution outcomes
    if (result.data.status.id === 3) {
      res.json({ stdout: result.data.stdout });
    } else {
      res.json({
        error: result.data.stderr || result.data.compile_output || result.data.message,
        status: result.data.status.description,
      });
    }
  } catch (error) {
    console.error("Error compiling code:", error);
    res.status(500).json({ error: "Error compiling code" });
  }
});

module.exports = router;
