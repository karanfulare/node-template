export const tokenBlacklist: Set<string> = new Set();

export async function addToBlacklist(token: string): Promise<void> {
  // Add the token to the blacklist
  tokenBlacklist.add(token);
}

export async function isTokenBlacklisted(token: string): Promise<boolean> {
  // Check if the token is in the blacklist
  return tokenBlacklist.has(token);
}
