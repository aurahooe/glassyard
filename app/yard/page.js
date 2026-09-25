"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBrowserClient } from "../../lib/supabase";

export default function Yard() {
  const [notes, setNotes] = useState([]);
  const [hours, setHours] = useState([]);

  useEffect(() => {
    const sb = getBrowserClient();
    sb.from("glassyard_notes").select("*").eq("is_public", true).order("created_at", { ascending: false }).limit(40)
      .then(({ data }) => setNotes(data || []));
    sb.from("glassyard_hours").select("*").order("created_at", { ascending: false }).limit(12)
      .then(({ data }) => setHours(data || []));
  }, []);

  return (
    <div className="wrap">
      <nav className="nav">
        <Link href="/" className="mark"><b>Glassyard</b><span>public slips</span></Link>
        <div className="links">
          <Link href="/desk">Desk</Link>
          <Link href="/login" className="btn">Sign in</Link>
        </div>
      </nav>
      <h1>The yard.</h1>
      <p className="lede">Only what people marked public lives here. The rest stays in the drawer.</p>

      <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 500, marginTop: 36 }}>Past hours</h2>
      <div className="grid">
        {hours.map((h) => (
          <article className="card" key={h.id}>
            <div className="meta">{h.hour_key}</div>
            <h3>{h.title}</h3>
            <p>{h.body}</p>
          </article>
        ))}
      </div>

      <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 500, marginTop: 36 }}>Pinned slips</h2>
      <div className="grid">
        {notes.map((n) => (
          <article className="card" key={n.id}>
            <div className="meta">{new Date(n.created_at).toLocaleString()}</div>
            <h3>{n.title || "Untitled slip"}</h3>
            <p>{n.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
