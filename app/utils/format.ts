export function formatNumber(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  
  // Convert wei to tokens (divide by 1e18) and round to whole number
  const tokenValue = Math.round(num / 1e18);
  
  // Format with commas for thousands
  return tokenValue.toLocaleString('en-US');
}

export function cleanAddress(address: string): string {
  return address || '';
}
