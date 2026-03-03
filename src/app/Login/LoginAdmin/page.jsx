"use client";

import { useState } from "react";
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export default function Page() {
    const initialState = {
        email: "",
        password: "",
    };

    const [values, setValues] = useState(initialState);
    const [getUserDetails, setGetUserDetails] = useState([{}]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
    };

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${baseUrl}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            if (!response.ok) {
                throw new Error("Invalid login");
            }
            const data = await response.json();
            localStorage.setItem("user", JSON.stringify(data.user));
            console.log("Login successful:", data.user);
            console.log("get token", data.token);
            setGetUserDetails(data.user)
        } catch (error) {
            console.error("Login error:", error.message);
        }
    };


    return (
        <div>
            <h1>Login Admin Page</h1>

            <form onSubmit={loginUser}>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={values.email}
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={values.password}
                    onChange={handleChange}
                />

                <button type="submit">Login</button>
            </form>
            {!getUserDetails ? (
                <p>User Not Logged In!</p>
            ) : (
                <ul>
                    <li>{getUserDetails.name}</li>
                    <li>{getUserDetails.email}</li>
                    <li>{getUserDetails.cell}</li>
                    <li>{getUserDetails.created_at}</li>
                </ul>
            )}
        </div>
    );
}

// export function generateMetadata() {
//     return {
//         title: "Login Admin Page Title",
//         description: "Login Admin Page Description",
//     };
// }
