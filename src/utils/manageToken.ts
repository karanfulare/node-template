export const tokenBlacklist: Set<string> = new Set();

export async function addToBlacklist(token: string): Promise<void> {
  tokenBlacklist.add(token);
}

export async function isTokenBlacklisted(token: string): Promise<boolean> {
  return tokenBlacklist.has(token);
}
