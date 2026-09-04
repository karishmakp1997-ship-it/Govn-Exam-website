import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getStudyMaterials } from "../../api/materials";

const CATEGORIES = [
  "UPSC", "TNPSC Group 1", "TNPSC Group 2", "TNPSC Group 3", "TNPSC Group 4",
  "Railways (RRB)", "SSC", "Banking", "Defence", "Teaching",
];

const CATEGORY_KEY_MAP = {
  "UPSC": "upsc",
  "TNPSC Group 1": "tnpsc_group1",
  "TNPSC Group 2": "tnpsc_group2",
  "TNPSC Group 3": "tnpsc_group3",
  "TNPSC Group 4": "tnpsc_group4",
  "Railways (RRB)": "railways",
  "SSC": "ssc",
  "Banking": "banking",
  "Defence": "defence",
  "Teaching": "teaching",
};

const TYPE_FILTERS = [
  { value: "all", label: "All Materials" },
  { value: "pdf", label: "PDF" },
  { value: "video", label: "Video" },
  { value: "flashcards", label: "Flashcards" },
  { value: "current_affairs", label: "Current Affairs" },
];

const TYPE_META = {
  notes: { color: "#dc2626", bg: "#fef2f2", label: "Notes" },
  pdf: { color: "#dc2626", bg: "#fef2f2", label: "PDF" },
  video: { color: "#2563eb", bg: "#eff6ff", label: "Video" },
  flashcards: { color: "#7c3aed", bg: "#f5f3ff", label: "Flashcards" },
  current_affairs: { color: "#d97706", bg: "#fffbeb", label: "Current Affairs" },
};

const CATEGORY_THEMES = {
  "UPSC": { from: "#2563eb", to: "#7c3aed" },
  "TNPSC Group 1": { from: "#16a34a", to: "#0891b2" },
  "TNPSC Group 2": { from: "#0891b2", to: "#2563eb" },
  "TNPSC Group 3": { from: "#059669", to: "#0d9488" },
  "TNPSC Group 4": { from: "#0f766e", to: "#2563eb" },
  "Railways (RRB)": { from: "#d97706", to: "#dc2626" },
  "SSC": { from: "#7c3aed", to: "#db2777" },
  "Banking": { from: "#059669", to: "#16a34a" },
  "Defence": { from: "#334155", to: "#475569" },
  "Teaching": { from: "#db2777", to: "#7c3aed" },
};

// Map a backend record to the shape the UI expects
function mapMaterial(m) {
  return {
    id: m.id,
    type: m.material_type,
    title: m.title,
    meta: m.size_or_duration || "",
    category: m.category,
    desc: m.description || "",
    updated: m.last_updated
      ? new Date(m.last_updated).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
      : "",
    locked: m.is_locked,
    featured: m.is_featured,
    fileUrl: m.file,
  };
}

function StudyMaterials() {
  const { isLoggedIn, requireAuth } = useAuth();

  const [activeCategory, setActiveCategory] = useState("UPSC");
  const [activeType, setActiveType] = useState("all");
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    const params = { category: CATEGORY_KEY_MAP[activeCategory] };
    if (activeType !== "all") params.material_type = activeType;

    getStudyMaterials(params)
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : data.results || [];
        setMaterials(list.map(mapMaterial));
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load materials. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [activeCategory, activeType]);

  const theme = CATEGORY_THEMES[activeCategory] || CATEGORY_THEMES["UPSC"];

  const handleDownload = (material) => {
    if (material.locked && !isLoggedIn) {
      requireAuth("signup");
      return;
    }
    if (material.fileUrl) {
      window.open(material.fileUrl, "_blank");
    } else {
      alert(`Downloading: ${material.title}`);
    }
  };

  const handleMaterialClick = (material) => setSelectedMaterial(material);
  const closeMaterial = () => setSelectedMaterial(null);

  const getActionLabel = (material) => {
    if (material.locked && !isLoggedIn) return "Login to Access";
    if (material.type === "video") return "Watch Video";
    if (material.type === "flashcards") return "View Cards";
    return "Download";
  };

  const getMaterialType = (type) => {
    if (type === "pdf") return "PDF Document";
    if (type === "video") return "Video Lecture";
    if (type === "flashcards") return "Flashcards";
    if (type === "current_affairs") return "Current Affairs";
    if (type === "notes") return "Notes";
    return "Study Material";
  };

  return (
    <>
      <style>{`

        /* =====================================================
           PAGE
        ===================================================== */

        .study-materials-section {
          position: relative;
          padding: 76px 0 70px;

          background:
            radial-gradient(
              circle at 8% 8%,
              rgba(124, 58, 237, 0.07),
              transparent 27%
            ),
            radial-gradient(
              circle at 92% 78%,
              rgba(37, 99, 235, 0.055),
              transparent 30%
            ),
            #f8fafc;

          overflow: hidden;
        }

        .study-materials-wrap {
          width: 100%;
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
        }


        /* =====================================================
           HEADER
        ===================================================== */

        .study-materials-header {
          width: 100%;
          text-align: center;
          margin-bottom: 34px;
        }

        .study-eyebrow {
          display: block;

          margin: 0 0 10px;

          color: #7c3aed;

          font-size: 12px;
          line-height: 1;

          font-weight: 800;
          letter-spacing: 2.2px;

          text-transform: uppercase;
        }

        .study-materials-header h2 {
          position: relative;

          margin: 0;
          padding: 0;

          color: #0f172a;

          font-size: 42px;
          line-height: 1.12;

          font-weight: 800;
          letter-spacing: -1.4px;
        }

        .study-materials-header h2::after {
          content: "";

          display: block;

          width: 68px;
          height: 5px;

          margin: 13px auto 13px;

          border-radius: 999px;

          background:
            linear-gradient(
              90deg,
              #2563eb,
              #7c3aed
            );
        }

        .study-materials-header p {
          max-width: 650px;

          margin: 0 auto;

          color: #64748b;

          font-size: 16px;
          line-height: 1.6;
        }


        /* =====================================================
           EXAM CATEGORY FILTERS
        ===================================================== */

        .study-filter-section {
          margin-bottom: 14px;
        }

        .filter-label {
          display: block;

          margin: 0 0 9px 2px;

          color: #94a3b8;

          font-size: 10px;
          font-weight: 800;

          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .study-category-tabs {
          display: flex;
          align-items: center;
          justify-content: center;

          flex-wrap: wrap;

          gap: 9px;
        }

        .study-category-btn {
          appearance: none;

          border: 1px solid #dbe2ea;

          padding: 9px 17px;

          border-radius: 999px;

          background: rgba(255,255,255,0.72);

          color: #475569;

          font-size: 12px;
          font-weight: 700;

          cursor: pointer;

          transition:
            transform 0.22s ease,
            border-color 0.22s ease,
            background 0.22s ease,
            color 0.22s ease,
            box-shadow 0.22s ease;
        }

        .study-category-btn:hover {
          transform: translateY(-2px);

          background: #ffffff;

          border-color: #b9c2cf;
        }

        .study-category-btn.active {
          color: #ffffff;

          border-color: transparent;

          box-shadow:
            0 7px 18px rgba(37,99,235,0.18);
        }


        /* =====================================================
           TYPE FILTERS
        ===================================================== */

        .study-type-tabs {
          display: flex;
          align-items: center;
          justify-content: center;

          flex-wrap: wrap;

          gap: 7px;

          margin-top: 5px;
          margin-bottom: 22px;
        }

        .study-type-btn {
          appearance: none;

          border: 1px solid #e2e8f0;

          padding: 7px 14px;

          border-radius: 8px;

          background: transparent;

          color: #64748b;

          font-size: 11px;
          font-weight: 700;

          cursor: pointer;

          transition:
            background 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .study-type-btn:hover {
          transform: translateY(-1px);

          background: #ffffff;

          border-color: #cbd5e1;
        }

        .study-type-btn.active {
          background: #ffffff;

          color: #334155;

          border-color: #cbd5e1;

          box-shadow:
            0 3px 10px rgba(15,23,42,0.06);
        }


        /* =====================================================
           VERIFIED STRIP
        ===================================================== */

        .study-verified {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 14px;

          margin: 0 auto 30px;

          max-width: 1120px;

          padding: 11px 16px;

          box-sizing: border-box;

          border: 1px solid rgba(22,163,74,0.12);

          border-radius: 10px;

          background: rgba(240,253,244,0.82);

          color: #15803d;

          font-size: 12px;
          font-weight: 600;
        }

        .verified-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .verified-check {
          display: flex;
          align-items: center;
          justify-content: center;

          width: 20px;
          height: 20px;

          flex: 0 0 20px;

          border-radius: 50%;

          background: #dcfce7;

          color: #16a34a;

          font-size: 11px;
          font-weight: 900;
        }

        .material-count {
          color: #64748b;

          font-size: 11px;
          font-weight: 600;
        }


        /* =====================================================
           BOOKSHELF
        ===================================================== */

        .study-bookshelf {
          width: 100%;
          max-width: 1120px;

          margin: 0 auto;

          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          column-gap: 30px;
          row-gap: 36px;

          align-items: start;
        }


        /* =====================================================
           BOOK
        ===================================================== */

        .study-book {
          position: relative;

          width: 190px;
          max-width: 100%;

          aspect-ratio: 0.72;

          justify-self: center;

          cursor: pointer;

          opacity: 0;

          animation:
            studyBookIn
            0.62s
            cubic-bezier(.16,1,.3,1)
            forwards;

          transition:
            transform 0.28s
            cubic-bezier(.16,1,.3,1);
        }

        @keyframes studyBookIn {
          from {
            opacity: 0;
            transform:
              translateY(24px)
              scale(.97);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        .study-book:hover {
          transform: translateY(-7px);
        }

        .study-book-image {
          position: absolute;

          inset: 0;

          width: 100%;
          height: 100%;

          object-fit: contain;

          display: block;

          background: transparent;

          mix-blend-mode: multiply;

          filter:
            drop-shadow(
              0 10px 18px
              rgba(15,23,42,0.13)
            );

          transition:
            transform 0.3s ease,
            filter 0.3s ease;
        }

        .study-book:hover .study-book-image {
          transform: scale(1.025);

          filter:
            drop-shadow(
              0 16px 25px
              rgba(15,23,42,0.18)
            );
        }


        /* =====================================================
           BOOK COVER CONTENT
        ===================================================== */

        .study-book-cover {
          position: absolute;

          top: 48%;
          left: 50%;

          transform:
            translate(-50%, -50%);

          width: 64%;

          text-align: center;

          pointer-events: none;
        }

        .study-book-type {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          min-width: 39px;

          margin-bottom: 8px;

          padding: 4px 8px;

          box-sizing: border-box;

          border-radius: 999px;

          font-size: 7px;
          line-height: 1;

          font-weight: 900;

          letter-spacing: 0.7px;

          text-transform: uppercase;
        }

        .study-book-title {
          margin: 0;

          color: #24170d;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 15px;

          line-height: 1.18;

          font-weight: 700;

          text-align: center;

          overflow-wrap: break-word;

          text-shadow:
            0 1px 1px
            rgba(255,255,255,.55);
        }

        .study-book-meta {
          margin-top: 9px;

          color: #5b4635;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 8px;

          line-height: 1.25;

          opacity: .85;
        }


        /* =====================================================
           FEATURED BOOK
        ===================================================== */

        .featured-book .study-book-type {
          background: rgba(124,58,237,.10);
          color: #7c3aed;
        }


        /* =====================================================
           EMPTY STATE
        ===================================================== */

        .study-empty {
          max-width: 580px;

          margin: 15px auto 25px;

          padding: 34px 24px;

          text-align: center;

          border:
            1px dashed #cbd5e1;

          border-radius: 14px;

          background:
            rgba(255,255,255,.55);
        }

        .study-empty-title {
          margin: 0 0 6px;

          color: #334155;

          font-size: 15px;
          font-weight: 750;
        }

        .study-empty-text {
          margin: 0;

          color: #94a3b8;

          font-size: 12px;
          line-height: 1.5;
        }


        /* =====================================================
           FOOTER
        ===================================================== */

        .study-footer {
          display: flex;

          justify-content: space-between;
          align-items: center;

          gap: 16px;

          flex-wrap: wrap;

          max-width: 1120px;

          margin: 36px auto 0;

          padding-top: 21px;

          border-top:
            1px solid #e2e8f0;
        }

        .study-footer-text {
          color: #64748b;

          font-size: 12px;
        }

        .study-footer-count {
          color: #94a3b8;

          font-size: 11px;
        }


        /* =====================================================
           OPEN BOOK MODAL
        ===================================================== */

        .study-modal {
          position: fixed;

          inset: 0;

          z-index: 99999;

          display: flex;

          align-items: center;
          justify-content: center;

          padding:
            70px
            20px
            30px;

          box-sizing: border-box;
        }

        .study-modal-backdrop {
          position: absolute;

          inset: 0;

          background:
            rgba(15,23,42,.34);

          backdrop-filter:
            blur(4px);

          -webkit-backdrop-filter:
            blur(4px);

          cursor: pointer;

          animation:
            studyBackdropIn
            .25s ease
            forwards;
        }

        @keyframes studyBackdropIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        .study-modal-book {
          position: relative;

          z-index: 2;

          width: min(570px, 88vw);

          max-height: 80vh;

          animation:
            studyModalIn
            .38s
            cubic-bezier(.16,1,.3,1)
            forwards;
        }

        @keyframes studyModalIn {
          from {
            opacity: 0;
            transform:
              translateY(18px)
              scale(.94);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        .study-open-book {
          width: 100%;
          height: auto;

          display: block;

          object-fit: contain;

          background: transparent;

          mix-blend-mode: multiply;

          filter:
            drop-shadow(
              0 25px 45px
              rgba(15,23,42,.28)
            );

          pointer-events: none;

          user-select: none;
        }


        /* =====================================================
           OPEN BOOK — CONTENT AREA
        ===================================================== */

        .study-open-content {
          position: absolute;

          top: 15%;

          left: 10%;

          width: 37%;

          max-width: 37%;

          height: 69%;

          box-sizing: border-box;

          padding:
            4px
            8px
            4px
            2px;

          overflow: hidden;
        }

        .study-open-type {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          margin-bottom: 7px;

          padding: 4px 8px;

          border-radius: 999px;

          font-size: 7px;

          line-height: 1;

          font-weight: 900;

          letter-spacing: .7px;

          text-transform: uppercase;
        }

        .study-open-title {
          margin: 0 0 7px;

          color: #0f172a;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 18px;

          line-height: 1.16;

          font-weight: 700;

          overflow-wrap: break-word;
        }

        .study-open-category {
          margin: 0 0 10px;

          color: #64748b;

          font-size: 8px;

          font-weight: 700;

          text-transform: uppercase;

          letter-spacing: .7px;
        }


        /* =====================================================
           FEATURED DESCRIPTION
        ===================================================== */

        .study-open-description {
          margin: 0 0 11px;

          color: #475569;

          font-size: 9.5px;

          line-height: 1.45;

          overflow-wrap: break-word;
        }


        /* =====================================================
           DETAIL GRID
        ===================================================== */

        .study-open-details {
          width: 100%;

          box-sizing: border-box;

          display: grid;

          grid-template-columns:
            1fr 1fr;

          column-gap: 9px;

          row-gap: 8px;

          padding: 8px 8px;

          border:
            1px solid
            rgba(148,163,184,.18);

          border-radius: 7px;

          background:
            rgba(241,237,229,.58);
        }

        .study-detail {
          min-width: 0;

          display: flex;

          flex-direction: column;

          gap: 2px;
        }

        .study-detail-label {
          color: #94a3b8;

          font-size: 5.5px;

          line-height: 1;

          font-weight: 800;

          letter-spacing: .55px;

          text-transform: uppercase;
        }

        .study-detail-value {
          color: #0f172a;

          font-size: 8.5px;

          line-height: 1.15;

          font-weight: 700;

          overflow-wrap: break-word;
        }


        /* =====================================================
           OPEN BOOK BUTTON — RIGHT SIDE
        ===================================================== */

        .study-open-action {
          position: absolute;

          top: 50%;

          right: 9%;

          width: 20%;

          transform:
            translateY(-50%);

          display: flex;

          align-items: center;
          justify-content: center;
        }

        .study-action-btn {
          width: 100%;

          box-sizing: border-box;

          padding: 10px 6px;

          border: none;

          border-radius: 7px;

          color: #ffffff;

          font-size: 9px;

          line-height: 1.15;

          font-weight: 800;

          text-align: center;

          cursor: pointer;

          transition:
            transform .22s ease,
            box-shadow .22s ease;
        }

        .study-action-btn:hover {
          transform: translateY(-2px);

          box-shadow:
            0 9px 22px
            rgba(37,99,235,.24);
        }

        .study-action-btn.locked {
          background: #e2e8f0 !important;

          color: #64748b;
        }


        /* =====================================================
           CLOSE BUTTON
        ===================================================== */

        .study-close-btn {
          position: absolute;

          top: -8px;
          right: -8px;

          z-index: 5;

          width: 34px;
          height: 34px;

          border: 1px solid rgba(255,255,255,.7);

          border-radius: 50%;

          background:
            rgba(255,255,255,.95);

          color: #334155;

          font-size: 20px;

          line-height: 1;

          display: flex;

          align-items: center;
          justify-content: center;

          cursor: pointer;

          box-shadow:
            0 8px 22px
            rgba(15,23,42,.16);

          transition:
            transform .2s ease,
            background .2s ease;
        }

        .study-close-btn:hover {
          transform: scale(1.06);

          background: #ffffff;
        }


        /* =====================================================
           RESPONSIVE — 1050
        ===================================================== */

        @media (max-width: 1050px) {

          .study-bookshelf {
            grid-template-columns:
              repeat(3, minmax(0,1fr));

            max-width: 850px;

            column-gap: 25px;
          }

          .study-book {
            width: 185px;
          }

          .study-materials-header h2 {
            font-size: 38px;
          }
        }


        /* =====================================================
           RESPONSIVE — 820
        ===================================================== */

        @media (max-width: 820px) {

          .study-materials-section {
            padding: 60px 0;
          }

          .study-materials-header h2 {
            font-size: 34px;
          }

          .study-bookshelf {
            grid-template-columns:
              repeat(2, minmax(0,1fr));

            max-width: 600px;

            column-gap: 22px;
            row-gap: 30px;
          }

          .study-book {
            width: 180px;
          }

          .study-category-tabs {
            gap: 7px;
          }

          .study-category-btn {
            padding: 8px 13px;

            font-size: 11px;
          }

          .study-verified {
            margin-bottom: 25px;
          }

          .study-modal-book {
            width: min(510px, 94vw);
          }

          .study-open-title {
            font-size: 15px;
          }

          .study-open-description {
            font-size: 8.5px;
          }

          .study-detail-value {
            font-size: 7.5px;
          }
        }


        /* =====================================================
           RESPONSIVE — 560
        ===================================================== */

        @media (max-width: 560px) {

          .study-materials-section {
            padding: 50px 0;
          }

          .study-materials-wrap {
            padding: 0 16px;
          }

          .study-eyebrow {
            font-size: 10px;

            letter-spacing: 1.7px;
          }

          .study-materials-header h2 {
            font-size: 29px;

            letter-spacing: -.8px;
          }

          .study-materials-header p {
            font-size: 14px;
          }

          .study-bookshelf {
            grid-template-columns:
              repeat(2, minmax(0,1fr));

            column-gap: 13px;
            row-gap: 23px;
          }

          .study-book {
            width: 155px;
          }

          .study-book-title {
            font-size: 11.5px;
          }

          .study-book-meta {
            font-size: 7px;
          }

          .study-book-type {
            font-size: 6px;

            padding: 3px 6px;

            margin-bottom: 6px;
          }

          .study-verified {
            align-items: flex-start;

            flex-direction: column;

            gap: 6px;

            font-size: 11px;
          }

          .study-footer {
            align-items: flex-start;

            flex-direction: column;
          }

          .study-modal {
            padding:
              60px
              7px
              20px;
          }

          .study-modal-book {
            width: 96vw;
          }

          .study-close-btn {
            width: 30px;
            height: 30px;

            top: -5px;
            right: -3px;

            font-size: 18px;
          }

          .study-open-content {
            top: 16%;

            left: 9%;

            width: 38%;

            max-width: 38%;

            height: 67%;

            padding:
              3px
              5px
              3px
              1px;
          }

          .study-open-type {
            padding: 3px 6px;

            margin-bottom: 5px;

            font-size: 5.5px;
          }

          .study-open-title {
            font-size: 10.5px;

            line-height: 1.12;

            margin-bottom: 4px;
          }

          .study-open-category {
            font-size: 5.5px;

            margin-bottom: 6px;
          }

          .study-open-description {
            font-size: 6.5px;

            line-height: 1.35;

            margin-bottom: 6px;
          }

          .study-open-details {
            padding: 5px 5px;

            column-gap: 5px;
            row-gap: 5px;
          }

          .study-detail-label {
            font-size: 4px;
          }

          .study-detail-value {
            font-size: 6px;
          }

          .study-open-action {
            right: 8%;

            width: 22%;
          }

          .study-action-btn {
            padding: 7px 4px;

            font-size: 6.5px;

            border-radius: 5px;
          }
        }


        /* =====================================================
           RESPONSIVE — 380
        ===================================================== */

        @media (max-width: 380px) {

          .study-materials-header h2 {
            font-size: 26px;
          }

          .study-book {
            width: 143px;
          }

          .study-book-title {
            font-size: 10px;
          }

          .study-book-meta {
            font-size: 6.5px;
          }

          .study-category-btn {
            padding: 7px 10px;

            font-size: 10px;
          }

          .study-open-title {
            font-size: 9.5px;
          }

          .study-open-description {
            font-size: 6px;
          }

          .study-detail-value {
            font-size: 5.5px;
          }
        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .study-book,
          .study-book-image,
          .study-modal-book,
          .study-modal-backdrop,
          .study-category-btn,
          .study-type-btn,
          .study-action-btn,
          .study-close-btn {
            animation: none !important;
            transition: none !important;
          }

          .study-book {
            opacity: 1;
          }
        }

      `}</style>


      {/* =====================================================
          SECTION
      ===================================================== */}

      <section className="study-materials-section">

        <div className="study-materials-wrap">


          {/* ===================================================
              HEADER
          =================================================== */}

          <div className="study-materials-header">

            <span className="study-eyebrow">
              Study Library
            </span>

            <h2>
              Study Materials
            </h2>

            <p>
              Verified notes, videos, and practice resources —
              organized by exam.
            </p>

          </div>


          {/* ===================================================
              EXAM FILTER
          =================================================== */}

          <div className="study-filter-section">

            <span className="filter-label">
              Choose your exam
            </span>

            <div className="study-category-tabs">

              {CATEGORIES.map((category) => {

                const categoryTheme =
                  CATEGORY_THEMES[category] ||
                  CATEGORY_THEMES["UPSC"];

                const isActive =
                  category === activeCategory;

                return (

                  <button
                    key={category}
                    type="button"
                    className={
                      isActive
                        ? "study-category-btn active"
                        : "study-category-btn"
                    }
                    onClick={() => {
                      setActiveCategory(category);
                      setActiveType("all");
                      setSelectedMaterial(null);
                    }}
                    style={
                      isActive
                        ? {
                            background:
                              `linear-gradient(
                                135deg,
                                ${categoryTheme.from},
                                ${categoryTheme.to}
                              )`,
                            boxShadow:
                              `0 7px 18px -5px
                               ${categoryTheme.from}66`,
                          }
                        : {}
                    }
                  >
                    {category}
                  </button>

                );
              })}

            </div>

          </div>


          {/* ===================================================
              MATERIAL TYPE FILTER
          =================================================== */}

          <div className="study-type-tabs">

            {TYPE_FILTERS.map((type) => {

              const isActive =
                type.value === activeType;

              return (

                <button
                  key={type.value}
                  type="button"
                  className={
                    isActive
                      ? "study-type-btn active"
                      : "study-type-btn"
                  }
                  onClick={() =>
                    setActiveType(type.value)
                  }
                >
                  {type.label}
                </button>

              );

            })}

          </div>


          {/* ===================================================
              VERIFIED BANNER
          =================================================== */}

          <div className="study-verified">

            <div className="verified-left">

              <span className="verified-check">
                ✓
              </span>

              <span>
                All materials are prepared and verified
                by our content team.
              </span>

            </div>

            <span className="material-count">
              {materials.length}{" "}
              {materials.length === 1
                ? "material"
                : "materials"}
            </span>

          </div>


          {/* ===================================================
              BOOKS
          =================================================== */}

          {loading ? (

            <div className="study-empty">
              <h3 className="study-empty-title">
                Loading materials…
              </h3>
            </div>

          ) : error ? (

            <div className="study-empty">
              <h3 className="study-empty-title">
                {error}
              </h3>
            </div>

          ) : materials.length === 0 ? (

            <div className="study-empty">

              <h3 className="study-empty-title">
                No materials found
              </h3>

              <p className="study-empty-text">
                No study materials are available for
                this category and filter yet.
              </p>

            </div>

          ) : (

            <div className="study-bookshelf">

              {/* ===============================================
                  ALL MATERIALS (featured gets extra styling/badge)
              =============================================== */}

              {materials.map((material, index) => {

                const typeMeta =
                  TYPE_META[material.type] || {};

                return (

                  <div
                    key={material.id}
                    className={
                      material.featured
                        ? "study-book featured-book"
                        : "study-book"
                    }
                    style={{
                      animationDelay:
                        `${index * 0.08}s`,
                    }}
                    onClick={() =>
                      handleMaterialClick(material)
                    }
                  >

                    <img
                      src="/images/close.png"
                      alt={material.title}
                      className="study-book-image"
                    />


                    <div className="study-book-cover">

                      <span
                        className="study-book-type"
                        style={{
                          background:
                            typeMeta.bg,
                          color:
                            typeMeta.color,
                        }}
                      >
                        {typeMeta.label}
                      </span>

                      <h3 className="study-book-title">
                        {material.title}
                      </h3>

                      <div className="study-book-meta">
                        {material.meta}
                      </div>

                    </div>

                  </div>

                );

              })}

            </div>

          )}


          {/* ===================================================
              FOOTER
          =================================================== */}

          <div className="study-footer">

            <span className="study-footer-text">
              Showing resources for {activeCategory}
            </span>

            <span className="study-footer-count">
              {materials.length}{" "}
              {materials.length === 1
                ? "resource"
                : "resources"}{" "}
              available
            </span>

          </div>

        </div>


        {/* =====================================================
            OPEN BOOK MODAL
        ===================================================== */}

        {selectedMaterial && (

          <div className="study-modal">

            <div
              className="study-modal-backdrop"
              onClick={closeMaterial}
            />


            <div className="study-modal-book">

              <button
                type="button"
                className="study-close-btn"
                onClick={closeMaterial}
                aria-label="Close material"
              >
                ×
              </button>


              <img
                src="/images/open.png"
                alt={`${selectedMaterial.title} open`}
                className="study-open-book"
              />


              <div className="study-open-content">

                {selectedMaterial.type && (

                  <span
                    className="study-open-type"
                    style={{
                      background:
                        TYPE_META[
                          selectedMaterial.type
                        ]?.bg || "#f1f5f9",

                      color:
                        TYPE_META[
                          selectedMaterial.type
                        ]?.color || "#475569",
                    }}
                  >
                    {
                      TYPE_META[
                        selectedMaterial.type
                      ]?.label
                    }
                  </span>

                )}


                <h2 className="study-open-title">
                  {selectedMaterial.title}
                </h2>


                <p className="study-open-category">
                  {activeCategory}
                </p>


                {selectedMaterial.desc && (

                  <p className="study-open-description">
                    {selectedMaterial.desc}
                  </p>

                )}


                <div className="study-open-details">

                  <div className="study-detail">

                    <span className="study-detail-label">
                      Material
                    </span>

                    <span className="study-detail-value">
                      {getMaterialType(
                        selectedMaterial.type
                      )}
                    </span>

                  </div>


                  <div className="study-detail">

                    <span className="study-detail-label">
                      Details
                    </span>

                    <span className="study-detail-value">
                      {selectedMaterial.meta}
                    </span>

                  </div>


                  <div className="study-detail">

                    <span className="study-detail-label">
                      Updated
                    </span>

                    <span className="study-detail-value">
                      {selectedMaterial.updated}
                    </span>

                  </div>


                  <div className="study-detail">

                    <span className="study-detail-label">
                      Access
                    </span>

                    <span
                      className="study-detail-value"
                      style={{
                        color:
                          selectedMaterial.locked
                            ? "#dc2626"
                            : "#16a34a",
                      }}
                    >
                      {selectedMaterial.locked
                        ? "Login Required"
                        : "Free Access"}
                    </span>

                  </div>

                </div>

              </div>


              <div className="study-open-action">

                <button
                  type="button"
                  className={
                    selectedMaterial.locked &&
                    !isLoggedIn
                      ? "study-action-btn locked"
                      : "study-action-btn"
                  }
                  style={
                    !(
                      selectedMaterial.locked &&
                      !isLoggedIn
                    )
                      ? {
                          background:
                            `linear-gradient(
                              135deg,
                              ${theme.from},
                              ${theme.to}
                            )`,
                        }
                      : {}
                  }
                  onClick={(event) => {

                    event.stopPropagation();

                    handleDownload(
                      selectedMaterial
                    );

                  }}
                >
                  {getActionLabel(
                    selectedMaterial
                  )}
                </button>

              </div>

            </div>

          </div>

        )}

      </section>
    </>
  );
}

export default StudyMaterials;