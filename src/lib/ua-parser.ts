export function parseUA(ua: string) {
  let device = 'Desktop';
  let os = 'Unknown OS';
  let browser = 'Unknown Browser';

  // Device detection
  if (/mobile/i.test(ua)) device = 'Mobile';
  if (/tablet/i.test(ua)) device = 'Tablet';
  if (/iPad|iPhone|iPod/.test(ua)) device = 'iPhone';
  if (/Android/.test(ua) && /mobile/i.test(ua)) device = 'Android Phone';

  // OS detection
  if (/Windows/i.test(ua)) os = 'Windows';
  if (/Mac OS/i.test(ua)) os = 'macOS';
  if (/Android/i.test(ua)) os = 'Android';
  if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  if (/Linux/i.test(ua)) os = 'Linux';

  // Browser detection
  if (/Chrome/i.test(ua)) browser = 'Chrome';
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  if (/Firefox/i.test(ua)) browser = 'Firefox';
  if (/Edge/i.test(ua)) browser = 'Edge';
  if (/Instagram/i.test(ua)) browser = 'Instagram WebView';

  return { device, os, browser };
}
