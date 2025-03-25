/**
 * Options for browser emulation and header generation
 */
export interface HeaderOptions {
  /**
   * Browser to emulate (chrome, firefox, safari, edge, or random)
   */
  browser?: 'chrome' | 'firefox' | 'safari' | 'edge' | 'random';
  
  /**
   * Operating system to emulate (windows, mac, linux, or random)
   * Note: compatibility depends on selected browser
   */
  os?: 'windows' | 'mac' | 'linux' | 'random';
  
  /**
   * Language string to use in accept-language header
   */
  language?: string | 'random';
}

/**
 * Generates believable HTTP headers for browser emulation
 * @param options Configuration options for header generation
 * @returns Object containing HTTP headers
 */
export function generateHeaders(options?: HeaderOptions): Record<string, string>;

/**
 * Wrapper around fetch() that adds realistic browser headers
 * 
 * @param url The URL to fetch
 * @param options Standard fetch options
 * @param headerOptions Configuration for the generated headers
 * @returns A Promise that resolves to the Response object
 */
export default function hmmfetch(
  url: string | URL | Request, 
  options?: RequestInit, 
  headerOptions?: HeaderOptions
): Promise<Response>;