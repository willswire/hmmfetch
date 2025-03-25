const hmmfetch = require('../index');

// Mock the global fetch function
global.fetch = jest.fn();

describe('hmmfetch', () => {
  beforeEach(() => {
    // Clear mock calls between tests
    global.fetch.mockClear();
    // Default mock implementation returns a resolved promise with a response
    global.fetch.mockImplementation(() => 
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: 'test' }),
        text: () => Promise.resolve('test')
      })
    );
  });

  test('should call fetch with the provided URL', async () => {
    const url = 'https://example.com';
    await hmmfetch(url);
    
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch.mock.calls[0][0]).toBe(url);
  });

  test('should apply random headers by default', async () => {
    const url = 'https://example.com';
    await hmmfetch(url);
    
    const options = global.fetch.mock.calls[0][1];
    
    // Check for the presence of common headers
    expect(options.headers).toHaveProperty('accept');
    expect(options.headers).toHaveProperty('accept-language');
    expect(options.headers).toHaveProperty('user-agent');
    expect(options.headers).toHaveProperty('upgrade-insecure-requests');
  });

  test('should merge custom headers with generated headers', async () => {
    const url = 'https://example.com';
    const customHeaders = {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    };
    
    await hmmfetch(url, { headers: customHeaders });
    
    const options = global.fetch.mock.calls[0][1];
    
    // Custom headers should override defaults
    expect(options.headers['accept']).toBe('application/json');
    expect(options.headers['Content-Type']).toBe('application/json');
    
    // Generated headers should still be present if not overridden
    expect(options.headers).toHaveProperty('user-agent');
  });

  test('should preserve non-header options in fetch call', async () => {
    const url = 'https://example.com';
    const options = {
      method: 'POST',
      body: JSON.stringify({ key: 'value' }),
      mode: 'cors',
      credentials: 'include'
    };
    
    await hmmfetch(url, options);
    
    const passedOptions = global.fetch.mock.calls[0][1];
    
    expect(passedOptions.method).toBe('POST');
    expect(passedOptions.body).toBe(JSON.stringify({ key: 'value' }));
    expect(passedOptions.mode).toBe('cors');
    expect(passedOptions.credentials).toBe('include');
  });

  test('should return the fetch response', async () => {
    const url = 'https://example.com';
    const response = await hmmfetch(url);
    
    expect(response).toBeDefined();
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    
    const text = await response.text();
    expect(text).toBe('test');
  });

  test('should handle fetch errors properly', async () => {
    const url = 'https://example.com/error';
    const errorMessage = 'Network error';
    
    // Mock fetch to reject with an error
    global.fetch.mockImplementationOnce(() => 
      Promise.reject(new Error(errorMessage))
    );
    
    await expect(hmmfetch(url)).rejects.toThrow(errorMessage);
  });

  test('should accept browser option for header generation', async () => {
    const url = 'https://example.com';
    
    // Test with Chrome
    await hmmfetch(url, {}, { browser: 'chrome' });
    let options = global.fetch.mock.calls[0][1];
    expect(options.headers['user-agent']).toContain('Chrome');
    expect(options.headers).toHaveProperty('sec-ch-ua');
    
    // Test with Firefox
    global.fetch.mockClear();
    await hmmfetch(url, {}, { browser: 'firefox' });
    options = global.fetch.mock.calls[0][1];
    expect(options.headers['user-agent']).toContain('Firefox');
    
    // Test with Safari
    global.fetch.mockClear();
    await hmmfetch(url, {}, { browser: 'safari' });
    options = global.fetch.mock.calls[0][1];
    expect(options.headers['user-agent']).toContain('Safari');
    
    // Test with Edge
    global.fetch.mockClear();
    await hmmfetch(url, {}, { browser: 'edge' });
    options = global.fetch.mock.calls[0][1];
    expect(options.headers['user-agent']).toContain('Edg');
  });

  test('should accept os option for header generation', async () => {
    const url = 'https://example.com';
    
    // Test with Windows
    await hmmfetch(url, {}, { browser: 'chrome', os: 'windows' });
    let options = global.fetch.mock.calls[0][1];
    expect(options.headers['user-agent']).toContain('Windows NT');
    expect(options.headers['sec-ch-ua-platform']).toBe('"Windows"');
    
    // Test with Mac
    global.fetch.mockClear();
    await hmmfetch(url, {}, { browser: 'chrome', os: 'mac' });
    options = global.fetch.mock.calls[0][1];
    expect(options.headers['user-agent']).toContain('Macintosh');
    expect(options.headers['sec-ch-ua-platform']).toBe('"macOS"');
    
    // Test with Linux
    global.fetch.mockClear();
    await hmmfetch(url, {}, { browser: 'chrome', os: 'linux' });
    options = global.fetch.mock.calls[0][1];
    expect(options.headers['user-agent']).toContain('Linux');
    expect(options.headers['sec-ch-ua-platform']).toBe('"Linux"');
  });

  test('should accept language option for header generation', async () => {
    const url = 'https://example.com';
    
    const testLanguage = 'fr-FR,fr;q=0.9';
    await hmmfetch(url, {}, { language: testLanguage });
    const options = global.fetch.mock.calls[0][1];
    expect(options.headers['accept-language']).toBe(testLanguage);
  });

  test('should use compatible OS for Safari', async () => {
    const url = 'https://example.com';
    
    // Safari should always use Mac OS
    await hmmfetch(url, {}, { browser: 'safari', os: 'windows' });
    const options = global.fetch.mock.calls[0][1];
    expect(options.headers['user-agent']).toContain('Macintosh');
  });
});

describe('generateHeaders', () => {
  test('should generate browser-specific headers', () => {
    const chromeHeaders = hmmfetch.generateHeaders({ browser: 'chrome' });
    expect(chromeHeaders).toHaveProperty('sec-ch-ua');
    expect(chromeHeaders).toHaveProperty('sec-ch-ua-mobile');
    expect(chromeHeaders).toHaveProperty('sec-ch-ua-platform');
    expect(chromeHeaders).toHaveProperty('priority');
    expect(chromeHeaders['user-agent']).toContain('Chrome');
    
    const firefoxHeaders = hmmfetch.generateHeaders({ browser: 'firefox' });
    expect(firefoxHeaders).not.toHaveProperty('sec-ch-ua');
    expect(firefoxHeaders['user-agent']).toContain('Firefox');
    
    const safariHeaders = hmmfetch.generateHeaders({ browser: 'safari' });
    expect(safariHeaders).not.toHaveProperty('sec-ch-ua');
    expect(safariHeaders['user-agent']).toContain('Safari');
    
    const edgeHeaders = hmmfetch.generateHeaders({ browser: 'edge' });
    expect(edgeHeaders).toHaveProperty('sec-ch-ua');
    expect(edgeHeaders['user-agent']).toContain('Edg');
  });

  test('should handle all browser-OS combinations correctly', () => {
    // Firefox with all OS combinations
    const firefoxWindowsHeaders = hmmfetch.generateHeaders({ browser: 'firefox', os: 'windows' });
    expect(firefoxWindowsHeaders['user-agent']).toContain('Windows NT');
    expect(firefoxWindowsHeaders['user-agent']).toContain('Firefox');
    
    const firefoxMacHeaders = hmmfetch.generateHeaders({ browser: 'firefox', os: 'mac' });
    expect(firefoxMacHeaders['user-agent']).toContain('Macintosh');
    expect(firefoxMacHeaders['user-agent']).toContain('Firefox');
    
    const firefoxLinuxHeaders = hmmfetch.generateHeaders({ browser: 'firefox', os: 'linux' });
    expect(firefoxLinuxHeaders['user-agent']).toContain('Linux');
    expect(firefoxLinuxHeaders['user-agent']).toContain('Firefox');
    
    // Edge with multiple OS combinations
    const edgeWindowsHeaders = hmmfetch.generateHeaders({ browser: 'edge', os: 'windows' });
    expect(edgeWindowsHeaders['user-agent']).toContain('Windows NT');
    expect(edgeWindowsHeaders['user-agent']).toContain('Edg');
    
    const edgeMacHeaders = hmmfetch.generateHeaders({ browser: 'edge', os: 'mac' });
    expect(edgeMacHeaders['user-agent']).toContain('Macintosh');
    expect(edgeMacHeaders['user-agent']).toContain('Edg');
  });
  
  test('should handle random option for browser', () => {
    const headers = hmmfetch.generateHeaders({ browser: 'random' });
    expect(headers).toHaveProperty('user-agent');
    expect(headers).toHaveProperty('accept-language');
  });
  
  test('should handle random option for os', () => {
    const headers = hmmfetch.generateHeaders({ os: 'random' });
    expect(headers).toHaveProperty('user-agent');
  });
  
  test('should handle random option for language', () => {
    const headers = hmmfetch.generateHeaders({ language: 'random' });
    expect(headers).toHaveProperty('accept-language');
  });
  
  test('should default to chrome for invalid browser', () => {
    const headers = hmmfetch.generateHeaders({ browser: 'invalid-browser' });
    expect(headers['user-agent']).toContain('Chrome');
  });
  
  test('should fallback to first available OS for incompatible OS', () => {
    // Safari only supports mac, so it should fallback when given 'linux'
    const headers = hmmfetch.generateHeaders({ browser: 'safari', os: 'linux' });
    
    // Should fallback to mac
    expect(headers['user-agent']).toContain('Macintosh');
    expect(headers['user-agent']).toContain('Safari');
  });
  
  test('should handle null/undefined options', () => {
    // Call with undefined (default parameter)
    const headers1 = hmmfetch.generateHeaders();
    expect(headers1).toHaveProperty('user-agent');
    expect(headers1).toHaveProperty('accept-language');
    
    // Explicitly pass null options
    const headers2 = hmmfetch.generateHeaders(null);
    expect(headers2).toHaveProperty('user-agent');
  });
});