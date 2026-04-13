// Verification mechanisms following agent guidelines
export class Verification {
  /**
   * Validate that assumptions are explicitly stated
   * @param {string} text - Text to check for assumptions
   * @returns {Object} - Result with validity and feedback
   */
  static checkAssumptionsStated(text) {
    const assumptionIndicators = [
      'assume', 'assuming', 'assumption', 'presume', 'presuming',
      'if we assume', 'given that', 'supposing', 'presuppose'
    ];
    
    const hasAssumptionLanguage = assumptionIndicators.some(indicator =>
      text.toLowerCase().includes(indicator)
    );
    
    return {
      valid: hasAssumptionLanguage,
      feedback: hasAssumptionLanguage 
        ? 'Assumptions appear to be explicitly stated' 
        : 'Warning: Assumptions should be explicitly stated per engineering guidelines'
    };
  }

  /**
   * Check for verification mechanisms or tests mentioned
   * @param {string} text - Text to check for verification
   * @returns {Object} - Result with validity and feedback
   */
  static checkVerificationPresent(text) {
    const verificationIndicators = [
      'test', 'verify', 'validation', 'assert', 'check',
      'confirm', 'validate', 'ensure', 'make sure'
    ];
    
    const hasVerificationLanguage = verificationIndicators.some(indicator =>
      text.toLowerCase().includes(indicator)
    );
    
    return {
      valid: hasVerificationLanguage,
      feedback: hasVerificationLanguage
        ? 'Verification mechanisms appear to be present'
        : 'Warning: Consider adding verification or testing mechanisms'
    };
  }

  /**
   * Check for failure mode consideration
   * @param {string} text - Text to check for failure modes
   * @returns {Object} - Result with validity and feedback
   */
  static checkFailureModes(text) {
    const failureIndicators = [
      'fail', 'error', 'exception', 'fault', 'bug', 'issue',
      'problem', 'risk', 'danger', 'what if', 'edge case'
    ];
    
    const hasFailureLanguage = failureIndicators.some(indicator =>
      text.toLowerCase().includes(indicator)
    );
    
    return {
      valid: hasFailureLanguage,
      feedback: hasFailureLanguage
        ? 'Failure modes appear to be considered'
        : 'Warning: Consider potential failure modes and error handling'
    };
  }

  /**
   * Comprehensive verification following agent guidelines
   * @param {string} text - Text to verify
   * @returns {Object} - Comprehensive verification result
   */
  static verifyResponse(text) {
    const assumptionsCheck = this.checkAssumptionsStated(text);
    const verificationCheck = this.checkVerificationPresent(text);
    const failureModesCheck = this.checkFailureModes(text);
    
    const allValid = assumptionsCheck.valid && verificationCheck.valid && failureModesCheck.valid;
    
    return {
      valid: allValid,
      checks: {
        assumptions: assumptionsCheck,
        verification: verificationCheck,
        failureModes: failureModesCheck
      },
      feedback: allValid
        ? 'Response meets all engineering guidelines'
        : [
            assumptionsCheck.feedback,
            verificationCheck.feedback,
            failureModesCheck.feedback
          ].filter(fb => fb.includes('Warning')).join(' ')
    };
  }
}