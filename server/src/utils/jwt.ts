import jwt from "jsonwebtoken";

export function generateAccessToken(userId: string): string {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
  return token;
}

export function generateRefreshToken(userId: string, jti: string): string {
  return jwt.sign(
    {
      userId: userId,
      jti,
    },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "8h",
    },
  );
}

export function generateTokens(
  userId: string,
  jti: string,
): { accessToken: string; refreshToken: string } {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId, jti);

  return {
    accessToken,
    refreshToken,
  };
}
