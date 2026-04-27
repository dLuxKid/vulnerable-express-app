const express = require('express');
const { exec } = require('child_process');
const app = express();

app.use(express.json());

// ❌ Vulnerability 1: Reflected XSS (no sanitization)
app.get('/search', (req, res) => {
  const query = req.query.q || '';
  res.send(`<h1>Search results for: ${query}</h1>`);   // Direct user input into HTML
});

// ❌ Vulnerability 2: Command Injection
app.get('/exec', (req, res) => {
  const cmd = req.query.cmd || 'ls';
  exec(cmd, (err, stdout) => {                         // User-controlled command
    if (err) return res.status(500).send(err.message);
    res.send(stdout);
  });
});

// ❌ Vulnerability 3: Hardcoded secret
const API_SECRET = 'super-secret-key-12345';           // Never hardcode secrets!

app.get('/status', (req, res) => {
  res.json({ status: 'ok', secret: API_SECRET });
});

app.listen(3000, () => {
  console.log('Vulnerable server running on port 3000');
});