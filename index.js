/**
 * hmmfetch - Fetch with believable, random headers
 */

// Common browser profiles and their version ranges
const BROWSERS = {
  chrome: {
    versions: ['114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', 
              '126', '127', '128', '129', '130', '131', '132', '133', '134', '135'],
    ua: {
      windows: (v) => `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${v}.0.0.0 Safari/537.36`,
      mac: (v) => `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${v}.0.0.0 Safari/537.36`,
      linux: (v) => `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${v}.0.0.0 Safari/537.36`
    },
    headers: (v) => ({
      'sec-ch-ua': `"Chromium";v="${v}", "Not:A-Brand";v="24", "Google Chrome";v="${v}"`,
      'sec-ch-ua-mobile': '?0',
      'priority': 'u=0, i'
    })
  },
  firefox: {
    versions: ['115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126'],
    ua: {
      windows: (v) => `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:${v}.0) Gecko/20100101 Firefox/${v}.0`,
      mac: (v) => `Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:${v}.0) Gecko/20100101 Firefox/${v}.0`,
      linux: (v) => `Mozilla/5.0 (X11; Linux x86_64; rv:${v}.0) Gecko/20100101 Firefox/${v}.0`
    }
  },
  safari: {
    versions: ['16.0', '16.1', '16.2', '16.3', '16.4', '16.5', '16.6', '17.0', '17.1', '17.2', '17.3', '17.4'],
    ua: {
      mac: (v) => `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${v} Safari/605.1.15`
    }
  },
  edge: {
    versions: ['114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125'],
    ua: {
      windows: (v) => `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${v}.0.0.0 Safari/537.36 Edg/${v}.0.1823.58`,
      mac: (v) => `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${v}.0.0.0 Safari/537.36 Edg/${v}.0.1823.58`,
      linux: (v) => `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${v}.0.0.0 Safari/537.36 Edg/${v}.0.1823.58`
    },
    headers: (v) => ({
      'sec-ch-ua': `"Chromium";v="${v}", "Not:A-Brand";v="24", "Microsoft Edge";v="${v}"`
    })
  }
};

// Map of operating systems to platform headers
const PLATFORMS = {
  windows: '"Windows"',
  mac: '"macOS"',
  linux: '"Linux"'
};

// Common languages for the accept-language header
const LANGUAGES = [
  'en-US,en;q=0.9', 
  'en-GB,en;q=0.9', 
  'en-CA,en;q=0.9,fr-CA;q=0.8',
  'es-ES,es;q=0.9',
  'fr-FR,fr;q=0.9',
  'de-DE,de;q=0.9',
  'zh-CN,zh;q=0.9',
  'ja-JP,ja;q=0.9',
  'ko-KR,ko;q=0.9'
];

/**
 * Picks a random item from an array
 */
function random(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generates a set of believable HTTP headers
 */
function generateHeaders(options = {}) {
  // Default values for options
  options = options || {};
  
  // 1. Pick a browser
  const browserName = options.browser === 'random' || !options.browser
    ? random(Object.keys(BROWSERS))
    : Object.keys(BROWSERS).includes(options.browser)
      ? options.browser
      : 'chrome';
      
  const browser = BROWSERS[browserName];
  
  // 2. Pick a compatible OS
  let compatibleOS = Object.keys(browser.ua);
  const os = options.os === 'random' || !options.os
    ? random(compatibleOS)
    : compatibleOS.includes(options.os)
      ? options.os
      : compatibleOS[0];
  
  // 3. Pick a browser version
  const version = random(browser.versions);
  
  // 4. Pick a language
  const language = options.language === 'random' || !options.language
    ? random(LANGUAGES)
    : options.language;
  
  // 5. Build the headers object
  const headers = {
    // Common headers for all browsers
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': language,
    'cache-control': random(['max-age=0', 'no-cache']),
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    // User agent is always required
    'user-agent': browser.ua[os](version)
  };
  
  // 6. Add browser-specific headers
  if (browser.headers) {
    const specificHeaders = browser.headers(version);
    Object.assign(headers, specificHeaders);
  }
  
  // 7. Add sec-ch-ua-platform for browsers that support it
  if (['chrome', 'edge'].includes(browserName)) {
    headers['sec-ch-ua-platform'] = PLATFORMS[os];
    headers['sec-ch-ua-mobile'] = '?0'; 
  }
  
  return headers;
}

/**
 * Wrapper around fetch() that adds realistic browser headers
 */
function hmmfetch(url, options = {}, headerOptions = {}) {
  // Create new options object to avoid modifying the original
  const newOptions = { ...options };
  
  // Initialize headers if not present
  newOptions.headers = newOptions.headers || {};
  
  // Add random headers, letting user-specified headers take precedence
  newOptions.headers = {
    ...generateHeaders(headerOptions),
    ...newOptions.headers
  };
  
  // Call original fetch with enhanced options
  return fetch(url, newOptions);
}

module.exports = hmmfetch;
module.exports.generateHeaders = generateHeaders;