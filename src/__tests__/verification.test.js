import { Verification } from '../verification.js';

describe('Verification', () => {
  describe('checkAssumptionsStated', () => {
    it('should return valid when assumptions are stated', () => {
      const result = Verification.checkAssumptionsStated('Assuming that the user has Node.js installed');
      expect(result.valid).toBe(true);
    });
    
    it('should return valid for multiple assumption words', () => {
      const result = Verification.checkAssumptionsStated('Given that x is true, we presume y is valid');
      expect(result.valid).toBe(true);
    });
    
    it('should return invalid when no assumptions stated', () => {
      const result = Verification.checkAssumptionsStated('The sky is blue');
      expect(result.valid).toBe(false);
    });
  });
  
  describe('checkVerificationPresent', () => {
    it('should return valid when verification words present', () => {
      const result = Verification.checkVerificationPresent('We should test this function thoroughly');
      expect(result.valid).toBe(true);
    });
    
    it('should return valid for verify/validate words', () => {
      const result = Verification.checkVerificationPresent('Please verify the result');
      expect(result.valid).toBe(true);
    });
    
    it('should return invalid when no verification words', () => {
      const result = Verification.checkVerificationPresent('This is a statement');
      expect(result.valid).toBe(false);
    });
  });
  
  describe('checkFailureModes', () => {
    it('should return valid when failure words present', () => {
      const result = Verification.checkFailureModes('Handle errors properly');
      expect(result.valid).toBe(true);
    });
    
    it('should return valid for edge case', () => {
      const result = Verification.checkFailureModes('Consider edge cases and what if scenarios');
      expect(result.valid).toBe(true);
    });
    
    it('should return invalid when no failure consideration', () => {
      const result = Verification.checkFailureModes('Everything works fine');
      expect(result.valid).toBe(false);
    });
  });
  
  describe('verifyResponse', () => {
    it('should pass for complete response with all guidelines', () => {
      const text = 'Assuming the input is valid, we should test this. Make sure to handle errors and edge cases.';
      const result = Verification.verifyResponse(text);
      expect(result.valid).toBe(true);
    });
    
    it('should fail when missing assumptions', () => {
      const text = 'We will test this and handle errors';
      const result = Verification.verifyResponse(text);
      expect(result.valid).toBe(false);
    });
    
    it('should return feedback array', () => {
      const text = 'Just a simple message';
      const result = Verification.verifyResponse(text);
      expect(result.feedback).toBeDefined();
    });
  });
});