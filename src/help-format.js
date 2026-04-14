export const HELP_FORMAT = `
=== Agent Communication Format ===

When communicating with the agent, your prompts can include:
- Plain questions or requests
- Specific formatting via keywords: [verify] [test] [compare]
- Context: "Assuming X, tell me Y"

=== Available Commands ===
help          - Show this help
models       - List available AI models  
provider    - Show current provider info
verify <text> - Verify text against guidelines
version     - Show agent version
exit         - Exit the application

=== Response Guidelines ===
The agent follows engineering principles:
1. State assumptions explicitly
2. Include verification/test suggestions
3. Consider failure modes and edge cases

Use "verify <text>" to check any text against these guidelines.
`;

export function showHelp() {
  console.log(HELP_FORMAT);
}