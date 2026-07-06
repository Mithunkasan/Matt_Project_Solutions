// src/lib/resetTokens.ts

export const resetTokens = new Map();

export function isValidToken(token: string) {
  const tokenData = resetTokens.get(token);
  if (!tokenData) return false;

  if (Date.now() > tokenData.expires) {
    resetTokens.delete(token);
    return false;
  }

  return true;
}
