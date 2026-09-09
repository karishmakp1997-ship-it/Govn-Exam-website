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

function ArticleThumb({ category, imageUrl, size = 90, className }) {
  const meta = getMeta(category);
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        className={className}
        style={{ width: size, height: size, borderRadius: "10px", objectFit: "cover", flexShrink: 0 }}
        onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
      />
    );
  }
  return (
    <div className={className} style={{ width: size, height: size, borderRadius: "10px", background: meta.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.4, flexShrink: 0 }}>
      {meta.icon}
    </div>
  );
}

// Mobile responsive rules for CurrentAffairs.
// Same approach as the other pages: responsive-critical properties (grids,
// padding, font sizes) live in classes since inline styles beat plain CSS specificity.
const CURRENT_AFFAIRS_RESPONSIVE_CSS = `
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
.ca-outer { padding: 24px; }
.ca-masthead { padding: 10px 32px; font-size: 12px; }
.ca-hero-title { font-size: 56px; }
.ca-hero-sub { font-size: 13px; }
.ca-nav { gap: 24px; padding: 14px 32px; }
.ca-nav-item { font-size: 13px; }
.ca-content { padding: 28px 32px; }
.ca-headline-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 32px; margin-bottom: 32px; }
.ca-headline-title { font-size: 30px; }
.ca-headline-row { display: flex; gap: 20px; }
.ca-headline-thumb { width: 220px !important; height: 220px !important; }
.ca-editor-row { display: flex; align-items: center; gap: 16px; padding: 14px 18px; }
.ca-world-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-bottom: 32px; }
.ca-bottom-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.ca-footer { padding: 24px 32px; }

@media (max-width: 768px) {
  .ca-outer { padding: 12px; }
  .vintage-paper { padding: 24px 20px; border-width: 24px; }
  .ca-masthead { padding: 8px 12px; font-size: 10.5px; flex-direction: column; align-items: center; gap: 4px; text-align: center; }
  .ca-hero-title { font-size: 32px; }
  .ca-hero-sub { font-size: 11.5px; }
  .ca-nav { gap: 12px; padding: 10px 12px; }
  .ca-nav-item { font-size: 12px; }
  .ca-content { padding: 20px 12px; }
  .ca-headline-grid { grid-template-columns: 1fr; gap: 24px; }
  .ca-headline-title { font-size: 22px; }
  .ca-headline-row { flex-direction: column; }
  .ca-headline-thumb { width: 100% !important; height: 180px !important; }
  .ca-editor-row { flex-wrap: wrap; padding: 12px; }
  .ca-world-grid { grid-template-columns: 1fr; gap: 24px; }
  .ca-bottom-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .ca-footer { padding: 18px 12px; }
}

@media (max-width: 375px) {
  .vintage-paper { padding: 16px 12px; border-width: 14px; }
  .ca-hero-title { font-size: 24px; letter-spacing: 0.5px; }
  .ca-nav { gap: 8px; }
  .ca-nav-item { font-size: 11px; }
  .ca-headline-title { font-size: 18px; }
  .ca-headline-thumb { height: 140px !important; }
  .ca-bottom-grid { grid-template-columns: 1fr; }
}
`;

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
    <div className="ca-outer" style={{ background: "#e2e8f0", minHeight: "100vh", fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <style>{CURRENT_AFFAIRS_RESPONSIVE_CSS}</style>
      <div className="vintage-paper">
      {/* Masthead */}
      <div className="ca-masthead" style={{ borderBottom: "2px solid #1a1a1a", display: "flex", justifyContent: "space-between", fontFamily: "Arial, sans-serif" }}>
        <span>Stay Informed. Stay Ahead.</span>
        <span style={{ fontWeight: 700 }}>{today}</span>
        <span>Edition: Daily Digest ★</span>
      </div>

      <div style={{ textAlign: "center", padding: "24px 32px 16px", borderBottom: "1px solid #1a1a1a" }}>
        <h1 className="ca-hero-title" style={{ fontWeight: 900, letterSpacing: "2px", marginBottom: "10px" }}>CURRENT AFFAIRS</h1>
        <p className="ca-hero-sub" style={{ fontFamily: "Arial, sans-serif", color: "#555" }}>
          Your Daily Update on National | International | Economy | Science | Environment | Defence | More
        </p>
      </div>

      {/* Category nav */}
      <div className="ca-nav" style={{ display: "flex", justifyContent: "center", borderBottom: "2px solid #1a1a1a", flexWrap: "wrap", fontFamily: "Arial, sans-serif" }}>
        <span
          onClick={() => setActiveCategory(null)}
          className="ca-nav-item"
          style={{ fontWeight: 700, cursor: "pointer", color: !activeCategory ? "#b91c1c" : "#1a1a1a" }}
        >
          Home
        </span>
        {NAV_CATEGORIES.map((cat) => (
          <span
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="ca-nav-item"
            style={{ fontWeight: 600, cursor: "pointer", color: activeCategory === cat ? "#b91c1c" : "#1a1a1a" }}
          >
            {getMeta(cat).label}
          </span>
        ))}
      </div>

      <div className="ca-content" style={{ maxWidth: "1200px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
        {/* Headline + Top Stories */}
        <div className="ca-headline-grid">
          <div>
            <h2 className="ca-headline-title" style={{ fontFamily: "Georgia, serif", fontWeight: 800, lineHeight: 1.25, marginBottom: "16px" }}>
              {headline.title}
            </h2>
            <div className="ca-headline-row">
              <ArticleThumb category={headline.category} imageUrl={headline.image_url} size={220} className="ca-headline-thumb" />
              <div>
                <p style={{ fontSize: "14px", lineHeight: 1.7, color: "#333", marginBottom: "12px" }}>
                  {headline.excerpt || headline.content?.slice(0, 220)}
                </p>
                <Link to={`/current-affairs/${headline.id}`} style={{ color: "#b91c1c", fontWeight: 700, fontSize: "13px", textDecoration: "none" }}>
                  Read Full Story →
                </Link>
              </div>
            </div>

            <div className="ca-editor-row" style={{ background: "#fef2f2", borderRadius: "10px", marginTop: "20px" }}>
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
        <div className="ca-world-grid">
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
        <div className="ca-bottom-grid">
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
      <div className="ca-footer" style={{ borderTop: "2px solid #1a1a1a", marginTop: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
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