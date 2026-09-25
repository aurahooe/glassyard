"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getBrowserClient } from "../../lib/supabase";

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const sb = getBrowserClient();
    const fn = mode === "signin" ? sb.auth.signInWithPassword : sb.auth.signUp;
    const { error } = await fn({ email, password });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    router.push("/desk");
  }

  return (
    <div className="wrap">
      <nav className="nav">
        <Link href="/" className="mark"><b>Glassyard</b></Link>
        <div className="links"><Link href="/yard">Yard</Link></div>
      </nav>
      <h1>{mode === "signin" ? "Come in." : "Take a desk."}</h1>
      <p className="lede">Email and a password. Your slips stay until you burn them.</p>
      <form className="form" onSubmit={submit}>
        <label>
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {err && <div className="err">{err}</div>}
        <div className="row">
          <button className="btn" disabled={busy} type="submit">
            {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
          <button
            type="button"
            className="btn ghost"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Need a desk?" : "Already have one?"}
          </button>
        </div>
      </form>
    </div>
  );
}
