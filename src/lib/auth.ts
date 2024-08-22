import { importSPKI, jwtDecrypt, jwtVerify } from "jose";

interface AuthToken {
  role: string;
  userId: Number;
  confirmEmail: boolean;
  email: string;
}

export const verifyAuth = async (
  token: string
): Promise<{
  role?: string;
  userId?: Number;
  confirmEmail?: boolean;
  email?: string;
}> => {
  if (!process.env.JWT_PUBLIC_KEY) throw new Error("JWT_PUBLIC_KEY not found");

  const publicKey = await importSPKI(process.env.JWT_PUBLIC_KEY, "RS256");
  const { role, userId, confirmEmail, email } = (
    await jwtVerify<AuthToken>(token, publicKey)
  ).payload;
  return { role: role.toUpperCase(), userId, confirmEmail, email };
};
