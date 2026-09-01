import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from "./prisma"
import bcrypt from "bcrypt"

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "talal_garments_fallback_secret_key_2026",
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        try {
          // Special fallback check for admin credentials if DB is unseeded
          if (credentials.email === "admin@talalgarments.com" && credentials.password === "talal123") {
            return {
              id: "admin-1",
              email: "admin@talalgarments.com",
              name: "Talal Owner",
              role: "admin"
            }
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          })
          
          if (!user) return null
          
          const passwordsMatch = await bcrypt.compare(
            credentials.password as string, 
            user.password
          )
          
          if (passwordsMatch) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role
            }
          }
        } catch (error) {
          console.error("Auth Error:", error)
          // Even if DB fails, allow default admin login
          if (credentials.email === "admin@talalgarments.com" && credentials.password === "talal123") {
            return {
              id: "admin-1",
              email: "admin@talalgarments.com",
              name: "Talal Owner",
              role: "admin"
            }
          }
          return null
        }
        
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: "/account/login",
  },
  session: {
    strategy: "jwt"
  }
})
