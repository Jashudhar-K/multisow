/**
 * Auth.js v5 (next-auth@beta) configuration.
 *
 * Replaces the v4 setup. Key differences:
 *   - Single `auth.ts` export instead of `authOptions + NextAuth()`
 *   - Built-in middleware support via `auth` wrapper
 *   - Server Component native — no client-side SessionProvider needed
 */

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

// ── In-memory user store (replace with DB in production) ────────

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

export async function createUser(
  name: string,
  email: string,
  password: string,
): Promise<StoredUser> {
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

// ── Auth.js v5 config ───────────────────────────────────────────

import { authConfig } from './auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const email = credentials.email as string
        const password = credentials.password as string

        const user = findUserByEmail(email)
        if (!user) return null

        const valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) return null

        return { id: user.id, name: user.name, email: user.email }
      },
    }),
  ],
})
