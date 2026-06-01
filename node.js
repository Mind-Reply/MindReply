/**
 * Complete MindReply One-File Fullstack Demo
 * Includes Express backend APIs (booking, membership, professionals, checkout, MRagent quota, admin toggle),
 * plus React frontend UI with navigation, authentication stub, live data, interactive booking, membership,
 * professionals directory, checkout, chat with quota enforcement, admin toggle, and basic styling & accessibility.
 * Run backend with Node, serve frontend React app rendering <App /> configured to call backend at localhost:4000.
 */

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import React, { useState, useEffect } from "react";

// Backend
const backendPort = 4000;
const backend = express();
backend.use(bodyParser.json());
backend.use(cors({ origin: ["http://localhost:3000"], credentials: true }));

// Simple auth middleware (stub)
backend.use((req, res, next) => {
  if (!req.headers.authorization?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: missing Bearer token" });
  }
  next();
});

let quotaUsed = 40;
const quotaFree = 100;
let adaptiveDeltaSyncEnabled = false;

backend.get("/dashboard", (req, res) => {
  res.json({ clarityIndex: 92, empathyResonance: 87, persuasiveImpact: 89 });
});

backend.get("/professionals", (req, res) => {
  res.json([
    { id: "p1", name: "Dr. Jane Smith", category: "Clinical Psychologist" },
    { id: "p2", name: "John Doe", category: "Legal Counsel" },
    { id: "p3", name: "Finance Guru", category: "Financial Advisor" },
  ]);
});

backend.post("/booking", (req, res) => {
  const { groupSize = 0, packItems = 0, date } = req.body;
  if (!date) return res.status(400).json({ error: "Date is required" });
  let discount = 0;
  let bonusDays = 0;
  if (groupSize >= 10) {
    discount = 10; bonusDays = 1;
  } else if (packItems >= 5) {
    discount = 30; bonusDays = 2;
  }
  res.json({ success: true, bookingId: `bk_${Math.floor(Math.random()*1e6)}`, discount, bonusDays });
});

backend.post("/checkout/session", (req, res) => {
  res.json({ sessionId: "stripe_session_1234567890" });
});

backend.get("/memberships", (req, res) => {
  res.json([
    { tier: "Curator", price: 49, features: ["5 lexicons", "3 tools", "Basic reports"] },
    { tier: "Strategist", price: 149, features: ["20+ lexicons", "Full toolkit", "Advanced analytics", "Consultations"] },
    { tier: "Sovereign", price: null, features: ["Custom pricing", "Enterprise features", "Dedicated architect"] },
  ]);
});

backend.get("/mragents/quota", (req, res) => {
  res.json({
    quotaFree,
    quotaUsed,
    quotaRemaining: quotaFree - quotaUsed,
    topUpLink: "/membership",
    trialEligible: true,
  });
});

backend.get("/admin/offers", (req, res) => {
  res.json({ adaptiveDeltaSync: adaptiveDeltaSyncEnabled });
});

backend.post("/admin/offers/delta-sync", (req, res) => {
  adaptiveDeltaSyncEnabled = !!req.body.enabled;
  res.json({ adaptiveDeltaSync: adaptiveDeltaSyncEnabled });
});

backend.listen(backendPort, () => {
  console.log(`MindReply backend listening at http://localhost:${backendPort}`);
});

// Frontend React App

function Navbar({ current, setCurrent }) {
  const pages = ["landing","dashboard","booking","professionals","membership","checkout","mragents","admin"];
  return <nav aria-label="Main navigation" style={{ marginBottom: "1rem" }}>
    {pages.map(p =>
      <button 
        key={p} 
        onClick={() => setCurrent(p)} 
        aria-current={current===p ? "page" : undefined}
        style={{ marginRight: "0.5rem", fontWeight: current===p ? "bold" : "normal" }}>
        {p.charAt(0).toUpperCase() + p.slice(1)}
      </button>
    )}
  </nav>;
}

function Landing() {
  return <section>
    <h2>Welcome to MindReply</h2>
    <p>Behavior-driven executive communication refinement platform.</p>
  </section>;
}

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch("http://localhost:4000/dashboard", { headers: { Authorization: "Bearer faketoken" } })
      .then(r => r.json())
      .then(setMetrics)
      .catch(e => setError(e.message));
  }, []);
  if (error) return <p role="alert">Error: {error}</p>;
  if (!metrics) return <p>Loading dashboard...</p>;
  return <section aria-labelledby="dashboard-title">
    <h2 id="dashboard-title">Dashboard</h2>
    <ul>
      <li>Clarity Index: {metrics.clarityIndex}%</li>
      <li>Empathy Resonance: {metrics.empathyResonance}%</li>
      <li>Persuasive Impact: {metrics.persuasiveImpact}%</li>
    </ul>
  </section>;
}

function Booking() {
  const [groupSize, setGroupSize] = useState(1);
  const [packItems, setPackItems] = useState(0);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  function discountText() {
    if (groupSize >= 10) return "10% discount + bonus day";
    if (packItems >= 5) return "30% discount + 2 bonus days";
    return "No discount";
  }
  async function submit(e) {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:4000/booking", {
        method: "POST",
        headers: { "Content-Type":"application/json", Authorization:"Bearer faketoken" },
        body: JSON.stringify({ groupSize, packItems, date }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Booking failed");
      setMessage(`Booking success! ID: ${result.bookingId}, Discount: ${result.discount}%, Bonus Days: ${result.bonusDays}`);
    } catch(e) {
      setMessage(`Error: ${e.message}`);
    }
  }
  return <form onSubmit={submit} aria-label="Booking form">
    <h2>Book a Session</h2>
    <label>Group Size<input type="number" min="1" value={groupSize} onChange={e=>setGroupSize(+e.target.value)} required /></label><br/>
    <label>Pack Items<input type="number" min="0" value={packItems} onChange={e=>setPackItems(+e.target.value)} /></label><br/>
    <label>Date<input type="date" value={date} onChange={e=>setDate(e.target.value)} required /></label><br/>
    <button type="submit">Book Now</button>
    <p>Discount Info: {discountText()}</p>
    {message && <p aria-live="polite">{message}</p>}
  </form>;
}

function Professionals() {
  const [list, setList] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch("http://localhost:4000/professionals", { headers:{ Authorization:"Bearer faketoken" } })
      .then(r=>r.json())
      .then(setList)
      .catch(e=>setError(e.message));
  }, []);
  if (error) return <p role="alert">Error: {error}</p>;
  if (!list) return <p>Loading professionals...</p>;
  return <section>
    <h2>Professionals</h2>
    <ul>{list.map(p=><li key={p.id}>{p.name} — {p.category}</li>)}</ul>
  </section>;
}

function Membership() {
  const [plans, setPlans] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch("http://localhost:4000/memberships", { headers:{Authorization:"Bearer faketoken"} })
      .then(r=>r.json())
      .then(setPlans)
      .catch(e=>setError(e.message));
  }, []);
  if (error) return <p role="alert">Error: {error}</p>;
  if (!plans) return <p>Loading memberships...</p>;
  return <section>
    <h2>Membership Tiers</h2>
    <ul>{plans.map(plan=>(
      <li key={plan.tier}>
        <h3>{plan.tier}</h3>
        <p>{plan.price === null ? "Custom pricing" : `$${plan.price}/month`}</p>
        <ul>{plan.features.map((f,i) => <li key={i}>{f}</li>)}</ul>
        <button onClick={() => alert(`Selected ${plan.tier} tier`)}>Select</button>
      </li>
    ))}</ul>
  </section>;
}

function Checkout() {
  const [loading,setLoading] = useState(false);
  const [error, setError] = useState("");
  async function buy(){
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:4000/checkout/session", {
        method:"POST",
        headers: {Authorization:"Bearer faketoken", "Content-Type":"application/json"},
        body: JSON.stringify({productId:"prod_001", quantity: 1}),
      });
      const json = await res.json();
      if (!res.ok) throw new Error("Failed initiating checkout");
      alert(`Stripe Checkout would open with session ID: ${json.sessionId}`);
    } catch(e) {
      setError(e.message);
    }
    setLoading(false);
  }
  return <>
    <h2>Checkout</h2>
    <button disabled={loading} onClick={buy}>{loading ? "Processing..." : "Buy Now"}</button>
    {error && <p role="alert">{error}</p>}
  </>;
}

function MRagentChat() {
  const [quota, setQuota] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/mragents/quota", {headers:{Authorization:"Bearer faketoken"}})
      .then(r => r.json())
      .then(setQuota)
      .catch(e => setError(e.message));
  }, []);

  function sendMessage() {
    if (!input.trim() || !quota || quota.quotaRemaining <=0) return;
    setMessages([...messages, input]);
    setInput("");
    setQuota({...quota, quotaUsed: quota.quotaUsed+1, quotaRemaining: quota.quotaRemaining-1});
  }

  if (error) return <p role="alert">Error: {error}</p>;
  if (!quota) return <p>Loading quota info...</p>;
  if (quota.quotaRemaining <= 0) return <p>Quota exhausted. <a href={quota.topUpLink}>Top Up</a></p>;

  return <section>
    <h2>MRagent Chat</h2>
    <ul aria-live="polite">{messages.map((m,i)=> <li key={i}>{m}</li>)}</ul>
    <input 
      aria-label="Message input"
      value={input}
      onChange={e => setInput(e.target.value)}
      onKeyDown={e => { if (e.key==="Enter") sendMessage() }}
    />
    <button onClick={sendMessage}>Send</button>
    <p>Quota Remaining: {quota.quotaRemaining}</p>
  </section>;
}

function AdminToggle() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("http://localhost:4000/admin/offers", {headers:{Authorization:"Bearer faketoken"}})
      .then(r=>r.json()).then(json => { setEnabled(json.adaptiveDeltaSync); setLoading(false); })
      .catch(e => {setError(e.message); setLoading(false);});
  }, []);
  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/admin/offers/delta-sync", {
        method:"POST",
        headers: {
          Authorization:"Bearer faketoken",
          "Content-Type":"application/json"
        },
        body: JSON.stringify({enabled: !enabled})
      });
      const json = await res.json();
      setEnabled(json.adaptiveDeltaSync);
    } catch(e) {
      setError(e.message);
    }
    setLoading(false);
  }
  if (error) return <p role="alert">Error: {error}</p>;
  return <section>
    <h2>Admin Feature Toggles</h2>
    <label>
      <input type="checkbox" checked={enabled} disabled={loading} onChange={toggle} />
      Adaptive Delta Sync (Experimental)
    </label>
  </section>;
}

export function App() {
  const [page, setPage] = useState("landing");
  const pages = {
    landing: <Landing />,
    dashboard: <Dashboard />,
    booking: <Booking />,
    professionals: <Professionals />,
    membership: <Membership />,
    checkout: <Checkout />,
    mragents: <MRagentChat />,
    admin: <AdminToggle />
  };
  return <div style={{fontFamily:"Georgia, serif", backgroundColor:"#fefcf7", color:"#002855", padding:"1rem"}}>
    <header style={{backgroundColor:"#002855", color:"#f9d342", padding:"1rem"}}>
      <h1>MindReply</h1>
      <nav aria-label="Primary navigation" style={{marginBottom:"1rem"}}>
        {Object.keys(pages).map(p => <button
          key={p}
          onClick={() => setPage(p)}
          aria-current={page === p ? "page" : undefined}
          style={{marginRight: "0.5rem", fontWeight: page===p ? 'bold' : 'normal'}}
          >{p.charAt(0).toUpperCase() + p.slice(1)}</button>)}
      </nav>
    </header>
    <main>{pages[page]}</main>
  </div>;
}
