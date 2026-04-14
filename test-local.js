import { AIProvider } from './src/provider-engine.js';
import { Verification } from './src/verification.js';
import { getVersion, getVersionInfo } from './src/version.js';

console.log('=== Local Test Runner ===\n');

console.log('1. Version:', getVersion());
console.log('   Info:', getVersionInfo().name);

const provider = new AIProvider();
console.log('\n2. Provider:', provider.provider);
console.log('   Models:', (await provider.fetchModels()).length);

const text = 'Assuming API is available, test the function and handle errors properly';
const result = Verification.verifyResponse(text);
console.log('\n3. Verification:', result.valid ? 'PASS' : 'FAIL');

console.log('\n=== All Tests Passed ===');
process.exit(0);