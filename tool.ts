```tsx
/**
 * MindReply minimal full demo in one file:
 * - Express backend with APIs (booking with discounts, auth stub, professionals, checkout stub, membership, MRagent quota)
 * - React frontend UI with interactive pages and dynamic backend communication
 * 
 * Run backend via Node, serve React frontend separately pointing to backend API at localhost:4000
 * Replace auth token with real in production; current uses fake token for demo.
 */

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import React, { useState, useEffect } from "react";

// Backend setup
const backendPort = 4000;
const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));

// Auth stub middleware
app.use((req, res, next) => {
  if (!req.headers.authorization?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing auth token" });
  }
  next();
});

app.get("/dashboard", (req, res) => {
  res.json({ clarityIndex: 92, empathyResonance: 87, persuasiveImpact: 89 });
});

app.get("/professionals", (req, res) => {
  res.json([
    { id: "p1", name: "Dr. Jane Smith", category: "Clinical Psychologist" },
    { id: "p2", name: "John Doe", category: "Legal Counsel" },
    { id: "p3", name: "Finance Expert", category: "Financial Advisor" },
  ]);
});

app.post("/booking", (req, res) => {
  const { groupSize = 0, packItems = 0, date } = req.body;
  if (!date) return res.status(400).json({ error: "Date required" });

  let discount = 0;
  let bonusDays = 0;

  if (groupSize >= 10) {
    discount = 10;
    bonusDays = 1;
  } else if (packItems >= 5) {
    discount = 30;
    bonusDays = 2;
  }

  const bookingId = `bk_${Math.floor(Math.random() * 1000000)}`;
  res.json({ success: true, bookingId, discount, bonusDays });
});

app.post("/checkout/session", (req, res) => {
  res.json({ sessionId: "stripe_session_123456" });
});

app.get("/memberships", (req, res) => {
  res.json([
    { tier: "Curator", priceMonthly: 49, features: ["5 lexicons", "3 tools", "Basic reports"] },
    { tier: "Strategist", priceMonthly: 149, features: ["20+ lexicons", "Full tools", "Advanced analytics", "Consultations"] },
    { tier: "Sovereign", priceMonthly: null, features: ["Custom Pricing", "Enterprise Features", "Dedicated Architect"] },
  ]);
});

let quotaUsed = 40;
const quotaFree = 100;
app.get("/mragents/quota", (req, res) => {
  res.json({
    quotaFree,
    quotaUsed,
    quotaRemaining: quotaFree - quotaUsed,
    topUpLink: "/membership",
    trialEligible: true,
  });
});

app.get("/admin/offers", (req, res) => {
  res.json({ adaptiveDeltaSync: false });
});

app.post("/admin/offers/delta-sync", (req, res) => {
  // Just echo back for demo
  res.json({ adaptiveDeltaSync: !!req.body.enabled });
});

app.listen(backendPort, () => {
  console.log(`MindReply backend listening on http://localhost:${backendPort}`);
});

// React Frontend Components

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/dashboard", {
      headers: { Authorization: "Bearer faketoken" },
    })
      .then(res => res.json())
      .then(setData)
      .catch(e => setError(e.message));
  }, []);

  if (error) return <p role="alert">Error: {error}</p>;
  if (!data) return <p>Loading dashboard...</p>;

  return (
    <section aria-labelledby="dashboard-title">
      <h2 id="dashboard-title">Dashboard</h2>
      <ul>
        <li>Clarity Index: {data.clarityIndex}%</li>
        <li>Empathy Resonance: {data.empathyResonance}%</li>
        <li>Persuasive Impact: {data.persuasiveImpact}%</li>
      </ul>
    </section>
  );
}

function Booking() {
  const [groupSize, setGroupSize] = React.useState(1);
  const [packItems, setPackItems] = React.useState(0);
  const [date, setDate] = React.useState("");
  const [message, setMessage] = React.useState("");

  function discountMsg() {
    if (groupSize >= 10) return "10% discount + bonus";
    if (packItems >= 5) return "30% discount + 2 bonus days";
    return "No discount";
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:4000/booking", {
        method: "POST",
        headers: {
          Authorization: "Bearer faketoken",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groupSize, packItems, date }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Booking failed");
      setMessage(`Success! Booking ID: ${json.bookingId}, Discount: ${json.discount}%, Bonus Days: ${json.bonusDays}`);
    } catch (e) {
      setMessage(`Error: ${e.message}`);
    }
  }

  return (
    <form onSubmit={onSubmit} aria-label="Booking form">
      <h2>Booking</h2>
      <label>
        Group Size:
        <input type="number" min="1" value={groupSize} onChange={e => setGroupSize(parseInt(e.target.value))} required/>
      </label>
      <br />
      <label>
        Pack Items:
        <input type="number" min="0" value={packItems} onChange={e => setPackItems(parseInt(e.target.value))} />
      </label>
      <br />
      <label>
        Date:
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      </label>
      <br />
      <button type="submit">Book Now</button>
      <p>Discount Info: {discountMsg()}</p>
      {message && <p aria-live="polite">{message}</p>}
    </form>
  );
}

function Professionals() {
  const [profs, setProfs] = React.useState([]);
  const [err, setErr] = React.useState("");

  React.useEffect(() => {
    fetch("http://localhost:4000/professionals", { headers: { Authorization: "Bearer faketoken" } })
      .then(res => res.json())
      .then(setProfs)
      .catch(e => setErr(e.message));
  }, []);

  if (err) return <p role="alert">Error: {err}</p>;
  if (profs.length === 0) return <p>Loading professionals...</p>;

  return (
    <section>
      <h2>Professionals</h2>
      <ul>
        {profs.map(p => (
          <li key={p.id}>{p.name} — {p.category}</li>
        ))}
      </ul>
    </section>
  );
}

function Membership() {
  const [plans, setPlans] = React.useState([]);
  const [err, setErr] = React.useState("");

  React.useEffect(() => {
    fetch("http://localhost:4000/memberships", { headers: { Authorization: "Bearer faketoken" } })
      .then(res => res.json())
      .then(setPlans)
      .catch(e => setErr(e.message));
  }, []);

  if (err) return <p role="alert">Error: {err}</p>;
  if (plans.length === 0) return <p>Loading memberships...</p>;

  return (
    <section>
      <h2>Membership Plans</h2>
      <ul>
        {plans.map(plan => (
          <li key={plan.tier}>
            <h3>{plan.tier}</h3>
            <p>{plan.priceMonthly === null ? "Custom Pricing" : `$${plan.priceMonthly}/month`}</p>
            <ul>
              {plan.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
            <button onClick={() => alert(`Selected ${plan.tier}`)}>Select</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MRagentChat() {
  const [quota, setQuota] = React.useState(null);
  const [msgs, setMsgs] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [err, setErr] = React.useState("");

  React.useEffect(() => {
    fetch("http://localhost:4000/mragents/quota", { headers: { Authorization: "Bearer faketoken" } })
      .then(res => res.json())
      .then(setQuota)
      .catch(e => setErr(e.message));
  }, []);

  function sendMsg() {
    if (!input.trim() || !quota || quota.quotaRemaining <= 0) return;
    setMsgs([...msgs, input]);
    setInput("");
    setQuota({ ...quota, quotaUsed: quota.quotaUsed + 1, quotaRemaining: quota.quotaRemaining - 1 });
  }

  if (err) return <p role="alert">Error: {err}</p>;
  if (!quota) return <p>Loading quota info...</p>;
  if (quota.quotaRemaining <= 0) return <p>Quota exhausted. <a href={quota.topUpLink}>Top Up</a></p>;

  return (
    <section>
      <h2>MRagent Chat</h2>
      <ul aria-live="polite">{msgs.map((m,i) => <li key={i}>{m}</li>)}</ul>
      <input aria-label="Message input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && sendMsg()} />
      <button onClick={sendMsg}>Send</button>
      <p>Quota remaining: {quota.quotaRemaining}</p>
    </section>
  );
}

export function App() {
  const [page, setPage] = React.useState("landing");

  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#fefcf7", color: "#002855", padding: "1rem" }}>
      <header style={{ backgroundColor: "#002855", color: "#f9d342", padding: "0.5rem 1rem", marginBottom: "1rem" }}>
        <h1>MindReply</h1>
        <nav aria-label="Primary navigation">
          {["landing","dashboard","booking","professionals","membership","mragents"].map(p => (
            <button key={p} onClick={() => setPage(p)} style={{ margin: "0 0.25rem" }}>{p[0].toUpperCase()+p.slice(1)}</button>
          ))}
        </nav>
      </header>
      <main>
        {page==="landing" && <section><h2>Welcome to MindReply</h2><p>Refine your executive communication smartly.</p></section>}
        {page==="dashboard" && <Dashboard />}
        {page==="booking" && <Booking />}
        {page==="professionals" && <Professionals />}
        {page==="membership" && <Membership />}
        {page==="mragents" && <MRagentChat />}
      </main>
    </div>
  );
}
```
This single-file app wraps minimal backend and frontend with live discounting, quota tracking, memberships, professionals directory, and dashboard metrics, fully working with an Express backend stubbed for demonstration.

Run backend with Node, serve frontend React app rendering `App`, configure API URLs accordingly.

Replace `Bearer faketoken` with real auth token for production use.
