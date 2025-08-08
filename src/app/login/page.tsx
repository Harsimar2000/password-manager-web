"use client";
import { useState } from "react";
import { derivePwdHash } from "../../../lib/argon";
import { useRouter } from "next/navigation";
interface SaltResponse {
  salt: string;
}
interface LoginResponse {
  access: string;
  refresh: string;
  vk_enc: string;
}

export default function Page() {
  var router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      /* 1. fetch salt */
      const saltRes = await fetch(`http://localhost:8080/v1/salt/${email}`);

      if (!saltRes.ok) {
        setError(await saltRes.text());
        return;
      } else {
        const { salt } = (await saltRes.json()) as { salt: string };

        /* 2. derive pwd_hash in browser */
        const pwdHash = await derivePwdHash(password, salt);

        /* 3. POST /auth/login */

        const loginRes = await fetch("http://localhost:8080/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, pwd_hash: pwdHash }),
        });
        if (!loginRes.ok) {
          setError(await loginRes.text());
        }

        if (loginRes.status === 200) {
          router.replace("/vault");
        }
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-base-100">
      <form
        onSubmit={handleLogin}
        className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 space-y-3"
      >
        <label className="label">Email</label>
        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="label">Password</label>
        <input
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn bg-purple-500 hover:bg-purple-400 text-black text-lg w-full"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="text-sm text-error">{error}</p>}
      </form>
    </div>
  );
}
