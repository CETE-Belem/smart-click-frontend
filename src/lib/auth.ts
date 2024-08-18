import { importSPKI, jwtDecrypt, jwtVerify } from "jose";

interface AuthToken {
  role: string;
  userId: Number;
}

export const verifyAuth = async (
  token: string
): Promise<{ role?: string; userId?: Number }> => {
  try {
    if (!process.env.JWT_PUBLIC_KEY)
      throw new Error("JWT_PUBLIC_KEY not found");

    const publicKey = await importSPKI(process.env.JWT_PUBLIC_KEY, "RS256");
    const { role, userId } = (await jwtVerify<AuthToken>(token, publicKey))
      .payload;
    return { role: role.toUpperCase(), userId };
  } catch (e) {
    console.error(e);
    return { role: undefined, userId: undefined };
  }
};
