export function isNativeApp(): boolean {
  try {
    const c = (window as any).Capacitor;
    return c && typeof c.getPlatform === 'function' && c.getPlatform() !== 'web';
  } catch {
    return false;
  }
}

export function serverBase(): string {
  if (isNativeApp()) {
    const stored = localStorage.getItem('api_url');
    if (stored) return stored.replace(/\/api\/?$/, '');
    return 'https://actas-nacimiento.onrender.com';
  }
  return '';
}
