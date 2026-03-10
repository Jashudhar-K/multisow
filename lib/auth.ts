import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

/**
 * In-memory user store. Replace with a real database in production.
 */
interface StoredUser {
  id: string
  name: string
  email: string
  passwordHash: string
}

const users: StoredUser[] = []

export function findUserByEmail(email: string): StoredUser | undefined {
  return users.find((u) => u.email === email)
}

export async function createUser(name: string, email: string, password: string): Promise<StoredUser> {
  if (findUserByEmail(email)) {
    throw new Error('Email already registered')
  }
  const passwordHash = await bcrypt.hash(password, 12)
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash,
  }
  users.push(user)
  return user
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = findUserByEmail(credentials.email)
        if (!user) return null

        const valid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!valid) return null

        return { id: user.id, name: user.name, email: user.email }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        ;(session.user as any).id = token.id
      }
      return session
    },
  },
}
