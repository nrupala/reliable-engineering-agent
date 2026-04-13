import { VERSION, VERSION_MAJOR, VERSION_MINOR, VERSION_PATCH, getVersion, getVersionInfo, compareVersion } from '../version.js';

describe('Version', () => {
  describe('getVersion', () => {
    it('should return version string', () => {
      expect(getVersion()).toBe('1.0.0');
    });
    
    it('should match VERSION constant', () => {
      expect(getVersion()).toBe(VERSION);
    });
  });
  
  describe('getVersionInfo', () => {
    it('should return all version info', () => {
      const info = getVersionInfo();
      expect(info.version).toBe('1.0.0');
      expect(info.major).toBe(1);
      expect(info.minor).toBe(0);
      expect(info.patch).toBe(0);
      expect(info.name).toBe('reliable-engineering-agent');
    });
  });
  
  describe('compareVersion', () => {
    it('should return 0 for equal versions', () => {
      expect(compareVersion('1.0.0', '1.0.0')).toBe(0);
    });
    
    it('should return 1 for greater version', () => {
      expect(compareVersion('2.0.0', '1.0.0')).toBe(1);
    });
    
    it('should return -1 for lesser version', () => {
      expect(compareVersion('1.0.0', '1.0.1')).toBe(-1);
    });
    
    it('should handle patch comparison', () => {
      expect(compareVersion('1.0.1', '1.0.0')).toBe(1);
    });
    
    it('should handle minor comparison', () => {
      expect(compareVersion('1.1.0', '1.0.0')).toBe(1);
    });
  });
  
  describe('VERSION constants', () => {
    it('should have correct major version', () => {
      expect(VERSION_MAJOR).toBe(1);
    });
    
    it('should have correct minor version', () => {
      expect(VERSION_MINOR).toBe(0);
    });
    
    it('should have correct patch version', () => {
      expect(VERSION_PATCH).toBe(0);
    });
  });
});