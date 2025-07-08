import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // TODO: Replace this with your real authentication logic
        if (credentials?.username === "admin" && credentials?.password === "password") {
          return { id: "1", name: "Admin" };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt"
  }
});
