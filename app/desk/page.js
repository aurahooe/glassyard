"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getBrowserClient } from "../../lib/supabase";

export default function Desk() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const sb = getBrowserClient();
    sb.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);
      load(sb, data.user.id);
    });
  }, [router]);

  async function load(sb, uid) {
    const { data } = await sb
      .from("glassyard_notes")
      .select("*")
      .eq("author_id", uid)
      .order("created_at", { ascending: false });
    setNotes(data || []);
  }

  async function save(e) {
    e.preventDefault();
    setErr("");
    const sb = getBrowserClient();
    const { error } = await sb.from("glassyard_notes").insert({
      author_id: user.id,
      title: title.trim(),
      body: body.trim(),
      is_public: isPublic,
    });
    if (error) {
      setErr(error.message);
      return;
    }
    setTitle("");
    setBody("");
    setIsPublic(false);
    load(sb, user.id);
  }

  async function toggle(note) {
    const sb = getBrowserClient();
    await sb.from("glassyard_notes").update({ is_public: !note.is_public }).eq("id", note.id);
    load(sb, user.id);
  }

  async function remove(note) {
    const sb = getBrowserClient();
    await sb.from("glassyard_notes").delete().eq("id", note.id);
    load(sb, user.id);
  }

  async function out() {
    const sb = getBrowserClient();
    await sb.auth.signOut();
    router.push("/");
  }

  if (!user) return null;

  return (
    <div className="wrap">
      <nav className="nav">
        <Link href="/" className="mark"><b>Glassyard</b><span>your drawer</span></Link>
        <div className="links">
          <Link href="/yard">Yard</Link>
          <button className="btn ghost" onClick={out}>Sign out</button>
        </div>
      </nav>
      <h1>The desk.</h1>
      <p className="lede">Private by default. Mark a slip public and it walks into the yard.</p>
      <form className="form" onSubmit={save}>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="A short heading" />
        </label>
        <label>
          Slip
          <textarea required value={body} onChange={(e) => setBody(e.target.value)} placeholder="What should stay." />
        </label>
        <label className="pub">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          Pin this to the public yard
        </label>
        {err && <div className="err">{err}</div>}
        <button className="btn" type="submit">Keep this slip</button>
      </form>

      <div className="grid">
        {notes.map((n) => (
          <article className="card" key={n.id}>
            <div className="meta">{n.is_public ? "Public" : "Drawer"} · {new Date(n.created_at).toLocaleString()}</div>
            <h3>{n.title || "Untitled slip"}</h3>
            <p>{n.body}</p>
            <div className="row" style={{ marginTop: 12 }}>
              <button className="btn ghost" onClick={() => toggle(n)}>{n.is_public ? "Pull inside" : "Make public"}</button>
              <button className="btn ghost" onClick={() => remove(n)}>Burn</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
