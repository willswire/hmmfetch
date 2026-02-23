# 🤔 hmmfetch

[![npm version](https://img.shields.io/npm/v/hmmfetch.svg)](https://www.npmjs.com/package/hmmfetch)
[![Build Status](https://img.shields.io/github/actions/workflow/status/willswire/hmmfetch/test.yml?branch=main)](https://github.com/willswire/hmmfetch/actions/workflows/test.yml)
[![CodeQL](https://img.shields.io/github/actions/workflow/status/willswire/hmmfetch/codeql.yml?branch=main&label=CodeQL)](https://github.com/willswire/hmmfetch/actions/workflows/codeql.yml)
[![Node.js Version](https://img.shields.io/node/v/hmmfetch.svg)](https://nodejs.org)

A simple wrapper around fetch() that adds believable, randomized headers.

## Installation

```bash
npm install hmmfetch
```

## Usage

```javascript
// CommonJS
const hmmfetch = require('hmmfetch');

// ESM
import hmmfetch from 'hmmfetch';

// Use it like normal fetch
hmmfetch('https://example.com')
  .then(response => response.text())
  .then(data => console.log(data));
```

### Custom Headers

You can also pass options just like with regular fetch. Your custom headers will override the default ones.

```javascript
hmmfetch('https://example.com', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // This will override the default accept header
    'accept': 'application/json'
  },
  body: JSON.stringify({ key: 'value' })
})
```

### Header Options

The library automatically randomizes headers with each request. You can customize the randomization:

```javascript
// Customize the browser profile
hmmfetch('https://example.com', {}, {
  // Use a specific browser profile
  browser: 'firefox',
  
  // Specify OS
  os: 'windows',
  
  // Set language
  language: 'fr-FR,fr;q=0.9'
})
```

### Generate Headers Without Fetching

You can also generate headers without making a request:

```javascript
const { generateHeaders } = require('hmmfetch');

// Generate random headers
const headers = generateHeaders();

// Or with specific options
const chromeHeaders = generateHeaders({ 
  browser: 'chrome',
  os: 'mac',
  language: 'en-US,en;q=0.9'
});

console.log(chromeHeaders);
```

## Options

### Browser Options
- `browser`: Which browser profile to use
  - `'chrome'`: Google Chrome
  - `'firefox'`: Mozilla Firefox
  - `'safari'`: Apple Safari
  - `'edge'`: Microsoft Edge
  - `'random'`: Random selection (default)

### OS Options
- `os`: Which operating system to use
  - `'windows'`: Windows
  - `'mac'`: macOS
  - `'linux'`: Linux (not available for Safari)
  - `'random'`: Random compatible OS (default)

### Language Options
- `language`: Which language to use
  - Any valid accept-language value
  - `'random'`: Random selection (default)

### Fetch Type Options
- `fetchType`: What kind of request to emulate, controlling `sec-fetch-*` headers
  - `'navigate'`: Full page navigation — `sec-fetch-dest: document`, includes `upgrade-insecure-requests` (default)
  - `'fetch'`: JavaScript `fetch()` call — `sec-fetch-dest: empty`, `sec-fetch-mode: cors`, `accept: */*`
  - `'xhr'`: XMLHttpRequest — same as `fetch` plus `x-requested-with: XMLHttpRequest`

```javascript
// Emulate a fetch() API call instead of a page navigation
hmmfetch('https://api.example.com/data', {}, { fetchType: 'fetch' })

// Emulate an XMLHttpRequest
hmmfetch('https://api.example.com/data', {}, { fetchType: 'xhr' })
```

## License

[ISC](./LICENSE)
