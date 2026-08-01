import NextAuth from "next-auth";
import { authOptions } from "@/config/auth/nextAuthOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
