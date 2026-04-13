import { Verification } from './verification.js';

async function testVerification() {
  console.log('Testing Verification System...\n');
  
  // Test case 1: Good response with assumptions, verification, and failure modes
  const goodResponse = `
  I assume the user wants a simple greeting function.
  
  Here's a technical solution:
  
  \`\`\`python
  def greet_technically():
      """
      Greet the user in a technically sophisticated manner.
      
      Assumption: The greeting is intended for a technical audience familiar with programming concepts.
      """
      print("Greetings, fellow developer! May your code be clean and efficient.")
  
  # Simple test to verify it works
  if __name__ == "__main__":
      greet_technically()
  \`\`\`
  
  This solution considers potential failure modes like:
  - What if the print function fails? (Though unlikely in standard environments)
  - What if the user runs this in an environment without stdout?
  `;
  
  console.log('Test 1: Good response');
  const result1 = Verification.verifyResponse(goodResponse);
  console.log(`Valid: ${result1.valid}`);
  console.log(`Feedback: ${result1.feedback}\n`);
  
  // Test case 2: Poor response missing assumptions
  const poorResponse = `
  Here's a greeting function:
  
  def greet():
      print("Hello!")
  `;
  
  console.log('Test 2: Poor response (missing assumptions)');
  const result2 = Verification.verifyResponse(poorResponse);
  console.log(`Valid: ${result2.valid}`);
  console.log(`Feedback: ${result2.feedback}\n`);
  
  // Test case 3: Response missing verification
  const noVerifyResponse = `
  I assume we need a greeting function.
  
  def greet():
      print("Hello!")
      
  This considers edge cases like encoding issues.
  `;
  
  console.log('Test 3: Response missing verification');
  const result3 = Verification.verifyResponse(noVerifyResponse);
  console.log(`Valid: ${result3.valid}`);
  console.log(`Feedback: ${result3.feedback}\n`);
}

// Run the test
testVerification().catch(console.error);