import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const CATEGORY_META = {
  national: { label: "National", color: "#16a34a", icon: "🇮🇳" },
  international: { label: "International", color: "#2563eb", icon: "🌍" },
  tamil_nadu: { label: "Tamil Nadu", color: "#d97706", icon: "🛕" },
  economy: { label: "Economy", color: "#0891b2", icon: "📈" },
  schemes: { label: "Govt. Schemes", color: "#7c3aed", icon: "📋" },
  science_tech: { label: "Science & Tech", color: "#4338ca", icon: "🔬" },
  environment: { label: "Environment", color: "#15803d", icon: "🌳" },
  awards: { label: "Awards", color: "#b45309", icon: "🏆" },
  appointments: { label: "Appointments", color: "#be185d", icon: "🧑‍💼" },
  sports: { label: "Sports", color: "#dc2626", icon: "🏅" },
};

function getMeta(cat) {
  return CATEGORY_META[cat] || { label: cat, color: "#64748b", icon: "📰" };
}

function CurrentAffairsArticle() {
  const { articleSlug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/current-affairs/articles/${articleSlug}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Article not found");
        return res.json();
      })
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [articleSlug]);

  if (loading) return <div className="wrap" style={{ padding: "60px 32px" }}><p className="section-head center">Loading article...</p></div>;
  if (error || !article) {
    return (
      <div className="wrap" style={{ padding: "60px 32px" }}>
        <p className="section-head center" style={{ color: "#dc2626" }}>{error || "Article not found"}</p>
        <div className="section-head center">
          <Link to="/current-affairs" className="btn btn-outline">← Back to Current Affairs</Link>
        </div>
      </div>
    );
  }

  const meta = getMeta(article.category);

  return (
    <div style={{ background: "#fdfbf7", minHeight: "100vh", fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 24px" }}>
        <Link to="/current-affairs" style={{ fontFamily: "Arial, sans-serif", fontSize: "13px", color: "#b91c1c", fontWeight: 700, textDecoration: "none" }}>
          ← Back to Current Affairs
        </Link>

        <p style={{ fontFamily: "Arial, sans-serif", fontSize: "12px", fontWeight: 800, color: meta.color, marginTop: "20px", marginBottom: "8px" }}>
          {meta.icon} {meta.label.toUpperCase()}
        </p>
        <h1 style={{ fontSize: "34px", fontWeight: 900, lineHeight: 1.25, marginBottom: "12px" }}>{article.title}</h1>
        <p style={{ fontFamily: "Arial, sans-serif", fontSize: "12.5px", color: "#888", marginBottom: "24px" }}>
          {new Date(article.published_at).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>

        {article.image_url ? (
          <img src={article.image_url} alt="" style={{ width: "100%", height: "280px", borderRadius: "12px", objectFit: "cover", marginBottom: "28px" }} />
        ) : (
          <div style={{ width: "100%", height: "280px", borderRadius: "12px", background: meta.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "80px", marginBottom: "28px" }}>
            {meta.icon}
          </div>
        )}

        {article.excerpt && (
          <p style={{ fontSize: "17px", fontWeight: 700, fontStyle: "italic", color: "#333", marginBottom: "20px", lineHeight: 1.6 }}>
            {article.excerpt}
          </p>
        )}

        <div style={{ fontSize: "16px", lineHeight: 1.9, color: "#222", whiteSpace: "pre-line" }}>
          {article.content || "Full article content coming soon."}
        </div>
      </div>
    </div>
  );
}

export default CurrentAffairsArticle;