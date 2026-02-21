import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const hmmfetch = require('./index.js');

export const { generateHeaders } = hmmfetch;
export default hmmfetch;
