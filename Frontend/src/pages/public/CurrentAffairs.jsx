import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

const NAV_CATEGORIES = ["national", "international", "economy", "science_tech", "environment", "tamil_nadu", "sports"];

function getMeta(cat) {
  return CATEGORY_META[cat] || { label: cat, color: "#64748b", icon: "📰" };
}

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

function ArticleThumb({ category, imageUrl, size = 90 }) {
  const meta = getMeta(category);
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        style={{ width: size, height: size, borderRadius: "10px", objectFit: "cover", flexShrink: 0 }}
        onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
      />
    );
  }
  return (
    <div style={{ width: size, height: size, borderRadius: "10px", background: meta.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.4, flexShrink: 0 }}>
      {meta.icon}
    </div>
  );
}

function CurrentAffairs() {
  const [articles, setArticles] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllTop, setShowAllTop] = useState(false);

  useEffect(() => {
    const url = activeCategory
      ? `${API_BASE_URL}/api/current-affairs/articles/?category=${activeCategory}`
      : `${API_BASE_URL}/api/current-affairs/articles/`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeCategory]);

  if (loading) return <div className="wrap" style={{ padding: "60px 32px" }}><p className="section-head center">Loading current affairs...</p></div>;

  if (articles.length === 0) {
    return (
      <div className="wrap" style={{ padding: "60px 32px" }}>
        <p className="section-head center">No articles published yet.</p>
      </div>
    );
  }

  const headline = articles[0];
  const topStories = articles.slice(1, showAllTop ? 11 : 4);
  const worldArticle = articles.find((a) => a.category === "international");
  const economyArticle = articles.find((a) => a.category === "economy");
  const bottomCategories = ["environment", "science_tech", "sports", "tamil_nadu"];
  const bottomArticles = bottomCategories.map((cat) => articles.find((a) => a.category === cat)).filter(Boolean);

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div style={{ background: "#e2e8f0", minHeight: "100vh", padding: "24px", fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <style>{`
        .vintage-paper {
          position: relative;
          max-width: 1500px;
          margin: 0 auto;
          padding: 60px 70px;
          background-color: #f3e6bd;
          border-style: solid;
          border-width: 70px;
          border-image-source: url('/images/paper.png');
          border-image-slice: 25% fill;
          border-image-width: 70px;
          border-image-repeat: stretch;
          box-shadow: 0 14px 44px rgba(0,0,0,0.3);
        }
      `}</style>
      <div className="vintage-paper">
      {/* Masthead */}
      <div style={{ borderBottom: "2px solid #1a1a1a", padding: "10px 32px", display: "flex", justifyContent: "space-between", fontSize: "12px", fontFamily: "Arial, sans-serif" }}>
        <span>Stay Informed. Stay Ahead.</span>
        <span style={{ fontWeight: 700 }}>{today}</span>
        <span>Edition: Daily Digest ★</span>
      </div>

      <div style={{ textAlign: "center", padding: "24px 32px 16px", borderBottom: "1px solid #1a1a1a" }}>
        <h1 style={{ fontSize: "56px", fontWeight: 900, letterSpacing: "2px", marginBottom: "10px" }}>CURRENT AFFAIRS</h1>
        <p style={{ fontSize: "13px", fontFamily: "Arial, sans-serif", color: "#555" }}>
          Your Daily Update on National | International | Economy | Science | Environment | Defence | More
        </p>
      </div>

      {/* Category nav */}
      <div style={{ display: "flex", justifyContent: "center", gap: "24px", padding: "14px 32px", borderBottom: "2px solid #1a1a1a", flexWrap: "wrap", fontFamily: "Arial, sans-serif" }}>
        <span
          onClick={() => setActiveCategory(null)}
          style={{ fontSize: "13px", fontWeight: 700, cursor: "pointer", color: !activeCategory ? "#b91c1c" : "#1a1a1a" }}
        >
          Home
        </span>
        {NAV_CATEGORIES.map((cat) => (
          <span
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{ fontSize: "13px", fontWeight: 600, cursor: "pointer", color: activeCategory === cat ? "#b91c1c" : "#1a1a1a" }}
          >
            {getMeta(cat).label}
          </span>
        ))}
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 32px", fontFamily: "Arial, sans-serif" }}>
        {/* Headline + Top Stories */}
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "32px", marginBottom: "32px" }}>
          <div>
            <h2 style={{ fontSize: "30px", fontFamily: "Georgia, serif", fontWeight: 800, lineHeight: 1.25, marginBottom: "16px" }}>
              {headline.title}
            </h2>
            <div style={{ display: "flex", gap: "20px" }}>
              <ArticleThumb category={headline.category} imageUrl={headline.image_url} size={220} />
              <div>
                <p style={{ fontSize: "14px", lineHeight: 1.7, color: "#333", marginBottom: "12px" }}>
                  {headline.excerpt || headline.content?.slice(0, 220)}
                </p>
                <Link to={`/current-affairs/${headline.id}`} style={{ color: "#b91c1c", fontWeight: 700, fontSize: "13px", textDecoration: "none" }}>
                  Read Full Story →
                </Link>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", background: "#fef2f2", borderRadius: "10px", padding: "14px 18px", marginTop: "20px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#b91c1c", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>✒️</div>
              <p style={{ fontSize: "13px", flex: 1 }}><strong>Editor's Take:</strong> {getMeta(headline.category).label} continues to shape today's biggest headlines.</p>
              <button style={{ background: "#fff", border: "1px solid #b91c1c", color: "#b91c1c", borderRadius: "8px", padding: "8px 14px", fontSize: "12px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                Explore Analysis
              </button>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#b91c1c", borderBottom: "2px solid #b91c1c", paddingBottom: "8px", marginBottom: "14px" }}>TOP STORIES</h3>
            {topStories.map((a) => (
              <Link to={`/current-affairs/${a.id}`} key={a.id} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ display: "flex", gap: "12px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px dashed #ddd" }}>
                  <ArticleThumb category={a.category} imageUrl={a.image_url} size={64} />
                  <div>
                    <p style={{ fontSize: "10.5px", fontWeight: 800, color: getMeta(a.category).color, marginBottom: "4px" }}>{getMeta(a.category).label.toUpperCase()}</p>
                    <p style={{ fontSize: "13px", fontWeight: 700, fontFamily: "Georgia, serif", lineHeight: 1.3, marginBottom: "4px" }}>{a.title}</p>
                    <p style={{ fontSize: "11px", color: "#888" }}>{timeAgo(a.published_at)}</p>
                  </div>
                </div>
              </Link>
            ))}
            <button onClick={() => setShowAllTop((v) => !v)} style={{ width: "100%", background: "#fff", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "10px", fontSize: "12.5px", fontWeight: 700, cursor: "pointer" }}>
              {showAllTop ? "Show Less ↑" : "View All Top Stories →"}
            </button>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "2px solid #1a1a1a", marginBottom: "28px" }} />

        {/* Around the world / Economy / Quick facts */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginBottom: "32px" }}>
          {[
            { title: "AROUND THE WORLD", article: worldArticle, color: "#2563eb" },
            { title: "ECONOMY", article: economyArticle, color: "#0891b2" },
          ].map((section) =>
            section.article ? (
              <div key={section.title}>
                <h4 style={{ fontSize: "12.5px", fontWeight: 800, color: section.color, marginBottom: "10px" }}>{section.title}</h4>
                <ArticleThumb category={section.article.category} imageUrl={section.article.image_url} size={140} />
                <Link to={`/current-affairs/${section.article.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <p style={{ fontSize: "15px", fontWeight: 700, fontFamily: "Georgia, serif", margin: "10px 0 6px", lineHeight: 1.3 }}>{section.article.title}</p>
                </Link>
                <p style={{ fontSize: "12.5px", color: "#555", marginBottom: "6px" }}>{section.article.excerpt}</p>
                <p style={{ fontSize: "11px", color: "#888" }}>{timeAgo(section.article.published_at)}</p>
              </div>
            ) : <div key={section.title} />
          )}

          {/* Quick facts — static reference data, not from the Article model */}
          <div>
            <h4 style={{ fontSize: "12.5px", fontWeight: 800, color: "#b91c1c", marginBottom: "10px" }}>QUICK FACTS</h4>
            <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: "10px", padding: "6px 14px" }}>
              {[
                { icon: "👥", label: "Population (India)", value: "1.43 Billion" },
                { icon: "📊", label: "GDP Growth (Q4)", value: "7.8%" },
                { icon: "₹", label: "Repo Rate (RBI)", value: "6.50%" },
              ].map((f) => (
                <div key={f.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <span style={{ fontSize: "12px", color: "#555" }}>{f.icon} {f.label}</span>
                  <span style={{ fontSize: "12.5px", fontWeight: 800 }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #ddd", marginBottom: "28px" }} />

        {/* Bottom category grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          {bottomArticles.map((a) => (
            <div key={a.id}>
              <p style={{ fontSize: "11px", fontWeight: 800, color: getMeta(a.category).color, marginBottom: "8px" }}>{getMeta(a.category).label.toUpperCase()}</p>
              <ArticleThumb category={a.category} imageUrl={a.image_url} size={100} />
              <Link to={`/current-affairs/${a.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <p style={{ fontSize: "13.5px", fontWeight: 700, fontFamily: "Georgia, serif", margin: "10px 0 6px", lineHeight: 1.3 }}>{a.title}</p>
              </Link>
              <p style={{ fontSize: "11.5px", color: "#666", marginBottom: "6px" }}>{a.excerpt}</p>
              <p style={{ fontSize: "10.5px", color: "#999" }}>{timeAgo(a.published_at)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "2px solid #1a1a1a", marginTop: "32px", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <p style={{ fontSize: "13px", fontStyle: "italic", color: "#555", maxWidth: "420px" }}>
          "The more you read, the more things you will know. The more that you learn, the more places you'll go." — Dr. Seuss
        </p>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "20px" }}>📰</span>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 700 }}>Never Miss an Update</p>
            <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
              <input placeholder="Enter your email" style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "12px" }} />
              <button style={{ background: "#b91c1c", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 16px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default CurrentAffairs;