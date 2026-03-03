import { NextResponse } from "next/server";
const bcrypt = require('bcrypt');
import jwt from "jsonwebtoken";
import pool from "../../../../database";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // ✅ Get user from PostgreSQL
    const result = await pool.query(
      `SELECT id, name, email, cell, password, created_at 
       FROM users 
       WHERE email = $1`,
      [email.trim()]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // ✅ Compare hashed password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: "JWT secret not configured" },
        { status: 500 }
      );
    }

    // ✅ Create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          cell: user.cell,
          created_at: user.created_at,
        },
        success: true,
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}


