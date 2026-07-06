import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

// In-memory storage
const users = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if email already exists
    if (users.has(email)) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const userId = users.size + 1;
    const newUser = {
      user_id: userId,
      name,
      email,
      password: hashedPassword,
      role: 'user',
      created_at: new Date()
    };

    users.set(email, newUser);

    // Generate JWT token
    const token = jwt.sign(
      { user_id: userId, email, role: 'user' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return NextResponse.json(
      {
        message: 'User registered successfully',
        token,
        user: {
          user_id: newUser.user_id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
