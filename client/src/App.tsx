import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CoinDetail from "./pages/CoinDetail";

const getInitialTheme = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = window.localStorage.getItem('theme');
    if (stored) return stored;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  }
  return 'light';
};

function Login({ onAuth }: { onAuth: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("token", data.token);
      onAuth();
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form onSubmit={handleLogin} className="bg-white dark:bg-gray-800 p-8 rounded shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input className="w-full p-2 mb-2 rounded border dark:bg-gray-700" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input className="w-full p-2 mb-4 rounded border dark:bg-gray-700" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-cyan-600 text-white p-2 rounded hover:bg-cyan-700" type="submit">Login</button>
        <div className="mt-2 text-center">
          <span className="text-gray-500">No account? </span>
          <button type="button" className="underline text-cyan-600" onClick={() => navigate("/signup")}>Sign up</button>
        </div>
      </form>
    </div>
  );
}

function Signup({ onAuth }: { onAuth: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      // Auto-login after signup
      const loginRes = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error(loginData.error || "Login failed");
      localStorage.setItem("token", loginData.token);
      onAuth();
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form onSubmit={handleSignup} className="bg-white dark:bg-gray-800 p-8 rounded shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input className="w-full p-2 mb-2 rounded border dark:bg-gray-700" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input className="w-full p-2 mb-4 rounded border dark:bg-gray-700" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-cyan-600 text-white p-2 rounded hover:bg-cyan-700" type="submit">Sign Up</button>
        <div className="mt-2 text-center">
          <span className="text-gray-500">Already have an account? </span>
          <button type="button" className="underline text-cyan-600" onClick={() => navigate("/login")}>Login</button>
        </div>
      </form>
    </div>
  );
}

// THIS IS THE MODIFIED SECTION
const App = () => { // Assigned the arrow function to a variable named 'App'
  const [theme, setTheme] = useState<string>(getInitialTheme());
  const [authed, setAuthed] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const logout = () => {
    localStorage.removeItem("token");
    setAuthed(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="flex justify-end p-4 gap-2">
        <button
          className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
        {authed && (
          <button
            className="px-4 py-2 rounded bg-red-500 text-white border border-red-700"
            onClick={logout}
          >Logout</button>
        )}
      </div>
      <Routes>
        {!authed ? (
          <>
            <Route path="/login" element={<Login onAuth={() => setAuthed(true)} />} />
            <Route path="/signup" element={<Signup onAuth={() => setAuthed(true)} />} />
            <Route path="*" element={<Login onAuth={() => setAuthed(true)} />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/coin/:id" element={<CoinDetail />} />
            <Route path="*" element={<Dashboard />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default App; // Export the named variable