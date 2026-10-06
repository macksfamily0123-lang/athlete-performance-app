export const PRIVACY_VERSION = '2026-10-03';
// Privacy uses under 18. Junior display/permissions remain in rolePolicy unchanged.
export function needsGuardian(age) {return !Number.isFinite(Number(age)) || Number(age) < 18;}
const keep = new Set(['uiTextSize','notificationPrefs']);
export function clearPrivateCache(storage) {
  const keys = [];
  for (let i=0;i<storage.length;i++) {const key=storage.key(i);if(key && !keep.has(key) && !key.startsWith('sb-')) keys.push(key);}
  keys.forEach(key=>storage.removeItem(key));
}
export function validatePhoto(value) {return typeof value==='string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value) && value.length<=1600000;}
