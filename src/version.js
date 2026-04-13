export const VERSION = '1.0.0';
export const VERSION_MAJOR = 1;
export const VERSION_MINOR = 0;
export const VERSION_PATCH = 0;
export const NAME = 'reliable-engineering-agent';
export const DESCRIPTION = 'A disciplined AI coding agent with web and CLI interfaces';

export function getVersion() {
  return VERSION;
}

export function getVersionInfo() {
  return {
    version: VERSION,
    major: VERSION_MAJOR,
    minor: VERSION_MINOR,
    patch: VERSION_PATCH,
    name: NAME,
    description: DESCRIPTION
  };
}

export function compareVersion(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return 1;
    if (parts1[i] < parts2[i]) return -1;
  }
  return 0;
}