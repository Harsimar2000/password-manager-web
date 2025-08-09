"use client";
import React from "react";

const Register = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function validatePassword(password: string): boolean {
    let isValid = true;

    if (password.length < 8) {
      setError(" Password must be at least 8 characters long.");
      isValid = false;
    }

    if (!/[A-Za-z]/.test(password)) {
      setError("Password must contain at least one letter.");
      isValid = false;
    }

    if (!/\d/.test(password)) {
      setError("Password must contain at least one number.");
      isValid = false;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      setError("Password must contain at least one special character.");
      isValid = false;
    }

    return isValid;
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission
    setLoading(true);
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setLoading(false);
      return;
    }

    const registerRes = await fetch(`/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!registerRes.ok) {
      setError(await registerRes.text());
    }
    setLoading(false);
  };
  return (
    <div className="flex items-center justify-center h-screen bg-base-100">
      <form
        onSubmit={handleRegister}
        className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 space-y-3"
      >
        <label className="label">Email</label>
        <input
          className="input"
          type="email"
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
        <label className="label">Confirm Password</label>
        <input
          type="password"
          className="input"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          className="btn bg-purple-500 hover:bg-purple-400 text-black text-lg w-full"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {error && <p className="text-sm text-error">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
