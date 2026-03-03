import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "../../../../../database";

export async function GET(request, { params }) {
  try {
    const { id } = await params;   
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    const result = await pool.query(`SELECT id, name, email, cell, created_at FROM users WHERE id = $1`,[id]);
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params; 
    const payload = await request.json();
    const { name, email, cell, password } = payload;
    if (!id || !name || !email || !cell) {
      return NextResponse.json(
        { result: "Missing required fields", success: false },
        { status: 400 }
      );
    }
    let result;
    // ✅ If password is provided → hash & update it
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      result = await pool.query(
        `UPDATE users 
         SET name = $1, email = $2, cell = $3, password = $4 
         WHERE id = $5 
         RETURNING id`,
        [name, email, cell, hashedPassword, id]
      );

    } else {
      // ✅ Update without changing password
      result = await pool.query(
        `UPDATE users 
         SET name = $1, email = $2, cell = $3 
         WHERE id = $4 
         RETURNING id`,
        [name, email, cell, id]
      );
    }

    // ✅ If no rows updated → user not found
    if (result.rowCount === 0) {
      return NextResponse.json(
        { result: "User not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { result: "Record updated successfully", success: true },
      { status: 200 }
    );

  } catch (err) {

    // Handle duplicate email error
    if (err.code === "23505") {
      return NextResponse.json(
        { error: "Email already exists", success: false },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: err.message, success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;   // ✅ correct way
    if (!id) {
      return NextResponse.json(
        { result: "User ID is required", success: false },
        { status: 400 }
      );
    }
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING id`,
      [id]
    );
    // ✅ If no row deleted
    if (result.rowCount === 0) {
      return NextResponse.json(
        { result: "User not found", success: false },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { result: "User deleted successfully", success: true },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err.message, success: false },
      { status: 500 }
    );
  }
}









