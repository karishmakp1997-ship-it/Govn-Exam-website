import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const FAQS = [
  { q: "Can I cancel anytime?", a: "Yes — Premium is a one-time annual purchase, but you can request cancellation and a refund within 7 days of purchase (see our refund policy below)." },
  { q: "Is there a student discount?", a: "Not currently, but keep an eye on our Current Affairs page — we occasionally run limited-time offers." },
  { q: "What payment methods are accepted?", a: "UPI, credit/debit cards, and net banking — powered by Razorpay, all major Indian banks supported." },
];

function Pricing() {
  const { isLoggedIn, requireAuth } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch(`${API_BASE_URL}/api/subscriptions/status/`, { headers: getAuthHeaders() })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setSubscription(data))
      .catch(() => setSubscription(null));
  }, [isLoggedIn]);

  const handleGoPremium = async () => {
    if (!isLoggedIn) {
      requireAuth("signup");
      return;
    }

    setError(null);
    setProcessing(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError("Failed to load payment gateway. Please check your connection and try again.");
      setProcessing(false);
      return;
    }

    try {
      const orderRes = await fetch(`${API_BASE_URL}/api/subscriptions/create-order/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      });
      if (!orderRes.ok) throw new Error("Failed to create order");
      const order = await orderRes.json();

      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Vetri AI Coach",
        description: "Premium Plan — 1 Year Access",
        order_id: order.order_id,
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/api/subscriptions/verify-payment/`, {
              method: "POST",
              headers: { "Content-Type": "application/json", ...getAuthHeaders() },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            if (!verifyRes.ok) throw new Error("Verification failed");
            const updatedSub = await verifyRes.json();
            setSubscription(updatedSub);
            alert("Payment successful! You're now on Premium.");
          } catch {
            setError("Payment succeeded but verification failed. Please contact support.");
          }
        },
        theme: { color: "#7c3aed" },
        modal: { ondismiss: () => setProcessing(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setError("Something went wrong starting the payment. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const isPremium = subscription?.is_premium_active;

  return (
    <section style={{ background: "#f8fafc", minHeight: "100vh", padding: "48px 24px" }}>
      <div style={{ maxWidth: "820px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "30px", fontWeight: 900, color: "var(--blue)", marginBottom: "8px" }}>Simple, Transparent Pricing</h2>
          <p style={{ fontSize: "14px", color: "var(--ink-mute)" }}>Start free. Upgrade when you're ready to go all in.</p>
        </div>

        {error && <p style={{ textAlign: "center", color: "#dc2626", marginBottom: "16px", fontSize: "13px" }}>{error}</p>}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "40px" }}>
          {/* Free plan */}
          <div className="card" style={{ padding: "28px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "4px" }}>Free</h3>
            <p className="meta" style={{ marginBottom: "16px" }}>Perfect to start exploring the platform.</p>
            <p style={{ fontSize: "30px", fontWeight: 900, marginBottom: "20px" }}>₹0<span style={{ fontSize: "13px", fontWeight: 500, color: "var(--ink-mute)" }}>/forever</span></p>
            {[
              "Exam notifications",
              "Basic eligibility check",
              "Limited AI Coach access",
              "Limited mock tests",
              "Limited study materials browsing",
            ].map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span style={{ color: "#16a34a" }}>✓</span>
                <span style={{ fontSize: "13.5px" }}>{f}</span>
              </div>
            ))}
            <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center", marginTop: "16px" }}>
              {isLoggedIn ? "Current Plan" : "Get Started"}
            </button>
          </div>

          {/* Premium plan */}
          <div className="card" style={{ padding: "28px", position: "relative", border: "2px solid var(--violet)" }}>
            <span style={{ position: "absolute", top: "-12px", right: "20px", background: "var(--violet)", color: "#fff", fontSize: "10px", fontWeight: 800, padding: "5px 12px", borderRadius: "999px" }}>MOST POPULAR</span>
            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--violet)", marginBottom: "4px" }}>Premium</h3>
            <p className="meta" style={{ marginBottom: "16px" }}>Everything you need to crack the exam.</p>
            <p style={{ fontSize: "30px", fontWeight: 900, marginBottom: "20px" }}>₹4,999<span style={{ fontSize: "13px", fontWeight: 500, color: "var(--ink-mute)" }}>/year</span></p>
            {[
              "Unlimited AI Coach",
              "Full mock test library",
              "Advanced performance analytics",
              "AI Interview Coach",
              "Priority notifications (WhatsApp + Email)",
              "Unlimited downloads",
              "Adaptive study plans",
            ].map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span style={{ color: "var(--violet)" }}>✓</span>
                <span style={{ fontSize: "13.5px" }}>{f}</span>
              </div>
            ))}
            <button
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: "16px", background: "linear-gradient(135deg, var(--violet), #a855f7)" }}
              onClick={handleGoPremium}
              disabled={processing || isPremium}
            >
              {isPremium ? "✓ Premium Active" : processing ? "Processing..." : "Go Premium"}
            </button>
            {isPremium && subscription?.expires_at && (
              <p style={{ fontSize: "11px", color: "var(--ink-mute)", textAlign: "center", marginTop: "8px" }}>
                Valid until {new Date(subscription.expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}
          </div>
        </div>

        {/* FAQ */}
        <h3 style={{ textAlign: "center", fontSize: "18px", fontWeight: 800, marginBottom: "16px" }}>Frequently Asked Questions</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
          {FAQS.map((f, idx) => (
            <div key={f.q} className="card" style={{ padding: "16px 20px", cursor: "pointer" }} onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", fontWeight: 700 }}>{f.q}</span>
                <span style={{ fontSize: "12px", transform: openFaq === idx ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▾</span>
              </div>
              {openFaq === idx && <p style={{ fontSize: "13px", color: "var(--ink-mute)", marginTop: "10px", lineHeight: 1.6 }}>{f.a}</p>}
            </div>
          ))}
        </div>

        {/* Money-back guarantee */}
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "14px", background: "#f0fdfa" }}>
          <span style={{ fontSize: "22px" }}>🛡️</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "13.5px", fontWeight: 700 }}>7-Day Money-Back Guarantee</p>
            <p style={{ fontSize: "12px", color: "var(--ink-mute)" }}>If you're not satisfied with Premium, let us know within 7 days for a full refund.</p>
          </div>
          <a href="/about" style={{ fontSize: "12.5px", color: "var(--blue)", fontWeight: 700, whiteSpace: "nowrap" }}>Read Full Policy</a>
        </div>
      </div>
    </section>
  );
}

export default Pricing;