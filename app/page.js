"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBrowserClient } from "../lib/supabase";

export default function Home() {
  const [hour, setHour] = useState(null);
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const sb = getBrowserClient();
    sb.auth.getUser().then(({ data }) => setUser(data.user || null));
    sb.from("glassyard_hours").select("*").order("created_at", { ascending: false }).limit(1)
      .then(({ data }) => setHour(data?.[0] || null));
    sb.from("glassyard_notes").select("id,title,body,created_at,author_id,is_public")
      .eq("is_public", true).order("created_at", { ascending: false }).limit(8)
      .then(({ data }) => setNotes(data || []));
  }, []);

  return (
    <div className="wrap">
      <nav className="nav">
        <div className="mark"><b>Glassyard</b><span>the hour holds</span></div>
        <div className="links">
          <Link href="/yard">Yard</Link>
          <Link href="/desk">Desk</Link>
          {user ? (
            <Link href="/desk" className="btn">Open desk</Link>
          ) : (
            <Link href="/login" className="btn">Sign in</Link>
          )}
        </div>
      </nav>

      <section className="hero">
        <div>
          <h1>Paper that<br />keeps the hour.</h1>
          <p className="lede">
            Write a note. Keep it in the drawer, or pin it to the yard.
            Every hour this room is rewritten — a small edition, nothing more.
          </p>
        </div>
        <aside className="clock">
          <div className="kicker">{hour?.kicker || "This hour"}</div>
          <h2>{hour?.title || "The yard is still."}</h2>
          <p>{hour?.body || "The first edition has not landed. It will, on the hour."}</p>
          <div className="tick"><i /></div>
        </aside>
      </section>

      <div className="grid">
        {notes.map((n, i) => (
          <article className="card" key={n.id} style={{ animationDelay: `${i * 70}ms` }}>
            <div className="meta">{new Date(n.created_at).toLocaleString()}</div>
            <h3>{n.title || "Untitled slip"}</h3>
            <p>{n.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
