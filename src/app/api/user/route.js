
// export async function GET(request) {
//     return new NextResponse('hello api');
// }

import { NextResponse } from "next/server";

const bcrypt = require('bcrypt');
import pool from "../../../../database";

export async function GET() {
    try {
        const result = await pool.query("SELECT * FROM users");
        return NextResponse.json(result.rows, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, cell, password } = body;
        if (!name || !email || !cell || !password) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO users (name, email, cell, password) VALUES ($1, $2, $3, $4) RETURNING id`,
            [name, email, cell, hashedPassword]
        );
        return NextResponse.json(
            {
                message: "User created successfully",
                id: result.rows[0].id,
            },
            { status: 201 }
        );

    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}






