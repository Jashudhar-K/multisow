import { NextResponse } from 'next/server'
import { createUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const user = await createUser(name, email, password)
    return NextResponse.json({ id: user.id, name: user.name, email: user.email }, { status: 201 })
  } catch (err: any) {
    if (err.message === 'Email already registered') {
      return NextResponse.json({ error: err.message }, { status: 409 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
