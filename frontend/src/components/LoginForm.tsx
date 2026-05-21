import { useState } from "react";

type LoginFormProps = {
    onLogin: (token: string) => void;
};

function LoginForm({ onLogin }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await fetch(
                "http://localhost:3000/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            onLogin(data.token);

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="mx-auto mt-20 max-w-md rounded-xl bg-white p-6 shadow">
            <h1 className="mb-4 text-2xl font-bold">
                Login
            </h1>

            <div className="flex flex-col gap-3">
                <input
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white"
                    onClick={handleLogin}
                >
                    Login
                </button>
            </div>
        </div>
    );
}

export default LoginForm;