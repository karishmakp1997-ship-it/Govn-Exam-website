import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Builds a short, human-readable notification line for a tracked exam
// based on how many days remain until its application deadline.
function buildNotificationText(tracked) {
  const exam = tracked.exam_detail;
  if (!exam) return null;

  if (exam.status === "result_released") {
    return `${exam.name} — result declared`;
  }

  if (!exam.application_end_date) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(exam.application_end_date);
  deadline.setHours(0, 0, 0, 0);
  const daysLeft = Math.round((deadline - today) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return null; // deadline already passed
  if (daysLeft === 0) return `${exam.name} — application closes today`;
  if (daysLeft === 1) return `${exam.name} — closes in 1 day`;
  if (daysLeft <= 14) return `${exam.name} — closes in ${daysLeft} days`;

  return null; // deadline too far away to be worth surfacing
}

function Nav({ isAuthenticated }) {
  const { logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  // Pull the user's tracked exams and turn them into notification lines.
  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

    fetch(`${API_BASE_URL}/api/my-exams/`, { headers: getAuthHeaders() })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const items = (Array.isArray(data) ? data : [])
          .map((tracked) => ({ id: tracked.id, text: buildNotificationText(tracked) }))
          .filter((n) => n.text);
        setNotifications(items);
      })
      .catch(() => setNotifications([]));
  }, [isAuthenticated, location.pathname]);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: 'Home', path: '/' },
    {
      label: 'Exams', path: '/exams',
      dropdown: [
        { label: 'All Exams', path: '/exams' },
        { label: 'Central Govt. Exams', path: '/exams?category=central' },
        { label: 'State Govt. Exams', path: '/exams?category=state' },
        { label: 'Banking & Insurance', path: '/exams?category=banking' },
        { label: 'Defence Exams', path: '/exams?category=defence' },
      ],
    },
    {
      label: 'Prepare', path: '/eligibility',
      dropdown: [
        { label: 'Eligibility Checker', path: '/eligibility' },
        { label: 'Study Materials', path: '/study-materials' },
        { label: 'Mock Tests', path: '/mock-tests' },
        { label: 'AI Coach', path: '/ai-coach' },
        { label: 'Performance', path: '/performance' },
      ],
    },
    {
      label: 'Results', path: '/results',
      dropdown: [
        { label: 'Results', path: '/results' },
        { label: 'Answer Keys', path: '/answer-key' },
        { label: 'Admit Cards', path: '/admit-card' },
      ],
    },
    { label: 'Pricing', path: '/pricing' },
    {
      label: 'Resources', path: '/current-affairs',
      dropdown: [
        { label: 'Current Affairs', path: '/current-affairs' },
        { label: 'About Us', path: '/about' },
      ],
    },
  ];

  const handleNavItemClick = (item, e) => {
    if (item.dropdown) {
      e.preventDefault();
      setOpenDropdown(openDropdown === item.label ? null : item.label);
    }
  };

  return (
    <header className={`site-nav ${scrolled ? 'scrolled' : ''}`} ref={navRef}>
      <style>{`
        .mobile-menu-btn {
          display: none;
          background: rgba(255,255,255,0.15);
          border: none;
          border-radius: 10px;
          width: 40px;
          height: 40px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
        }

        .mobile-menu-btn span,
        .mobile-menu-btn span::before,
        .mobile-menu-btn span::after {
          display: block;
          width: 20px;
          height: 2px;
          background: #fff;
          border-radius: 2px;
          position: relative;
          transition: transform 0.25s ease, opacity 0.25s ease;
        }

        .mobile-menu-btn span::before,
        .mobile-menu-btn span::after {
          content: '';
          position: absolute;
          left: 0;
        }

        .mobile-menu-btn span::before { top: -6px; }
        .mobile-menu-btn span::after { top: 6px; }

        .mobile-menu-btn.open span { background: transparent; }
        .mobile-menu-btn.open span::before { transform: rotate(45deg); top: 0; }
        .mobile-menu-btn.open span::after { transform: rotate(-45deg); top: 0; }

        .mobile-nav-panel {
          display: none;
          flex-direction: column;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          padding: 8px 20px 20px;
        }

        .mobile-nav-panel.open {
          display: flex;
        }

        .mobile-nav-item {
          border-bottom: 1px solid rgba(255,255,255,0.12);
        }

        .mobile-nav-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 4px;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
        }

        .mobile-nav-link.active {
          color: #fde68a;
        }

        .mobile-nav-sub {
          display: flex;
          flex-direction: column;
          padding: 0 0 10px 14px;
        }

        .mobile-nav-sub a {
          padding: 9px 4px;
          color: rgba(255,255,255,0.82);
          font-size: 13.5px;
        }

        .mobile-nav-cta {
          margin-top: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mobile-nav-cta .login-btn,
        .mobile-nav-cta a {
          width: 100%;
          justify-content: center;
        }

        @media (max-width: 1000px) {
          .nav-menu {
            display: none;
          }

          .mobile-menu-btn {
            display: flex;
          }

          .nav-right .my-exams-link,
          .nav-right .login-btn {
            display: none;
          }
        }
      `}</style>

      <div className="nav-inner">
        <Link to="/" className="brand">
          <img
            src="/images/logo.png"
            alt="Vetri AI Coach"
            className="brand-mark"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              objectFit: 'contain',
              display: 'block',
              background: 'transparent',
              padding: 0,
              boxShadow: 'none',
              border: 'none',
            }}
          />
          <div>
            <b>Vetri AI Coach</b>
            <span>Your Success, Our Mission</span>
          </div>
        </Link>

        <nav className="nav-menu">
          {navItems.map((item) => (
            <div className="nav-item-wrap" key={item.label}>
              <Link
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={(e) => handleNavItemClick(item, e)}
              >
                {item.label}
                {item.dropdown && (
                  <span className={`chev ${openDropdown === item.label ? 'chev-open' : ''}`}>▾</span>
                )}
              </Link>
              {item.dropdown && openDropdown === item.label && (
                <div className="nav-dropdown">
                  {item.dropdown.map((sub) => (
                    <Link to={sub.path} key={sub.label} onClick={() => setOpenDropdown(null)}>
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="nav-right">
          <div className="notif-wrap">
            <button className="bell-btn" onClick={() => setNotifOpen(!notifOpen)} aria-label="Notifications">
              🔔
              {notifications.length > 0 && <span className="bell-dot"></span>}
            </button>
            {notifOpen && (
              <div className="notif-dropdown">
                <p className="notif-title">Notifications</p>
                {!isAuthenticated ? (
                  <div className="notif-item">Log in to see updates on your tracked exams.</div>
                ) : notifications.length === 0 ? (
                  <div className="notif-item">No upcoming deadlines right now.</div>
                ) : (
                  notifications.map((n) => (
                    <div className="notif-item" key={n.id}>{n.text}</div>
                  ))
                )}
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <>
              <Link to="/my-exams" className="my-exams-link">My Exams</Link>
              <button onClick={logout} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }}>
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" state={{ from: location.pathname }}>
              <button className="login-btn">
                <span>👤</span> Login / Sign Up
              </button>
            </Link>
          )}

          <button
            className={mobileMenuOpen ? 'mobile-menu-btn open' : 'mobile-menu-btn'}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      <div className={mobileMenuOpen ? 'mobile-nav-panel open' : 'mobile-nav-panel'}>
        {navItems.map((item) => (
          <div className="mobile-nav-item" key={item.label}>
            <div
              className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => {
                if (item.dropdown) {
                  setOpenDropdown(openDropdown === item.label ? null : item.label);
                } else {
                  setMobileMenuOpen(false);
                }
              }}
            >
              {item.dropdown ? (
                <span>{item.label}</span>
              ) : (
                <Link to={item.path} style={{ color: 'inherit', flex: 1 }}>{item.label}</Link>
              )}
              {item.dropdown && (
                <span style={{ fontSize: '11px' }}>{openDropdown === item.label ? '▴' : '▾'}</span>
              )}
            </div>
            {item.dropdown && openDropdown === item.label && (
              <div className="mobile-nav-sub">
                {item.dropdown.map((sub) => (
                  <Link to={sub.path} key={sub.label} onClick={() => setMobileMenuOpen(false)}>
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="mobile-nav-cta">
          {isAuthenticated ? (
            <>
              <Link to="/my-exams" onClick={() => setMobileMenuOpen(false)} style={{ color: '#fff', textAlign: 'center', padding: '10px', fontWeight: 600 }}>
                My Exams
              </Link>
              <button onClick={logout} className="btn btn-outline" style={{ background: '#fff' }}>
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <button className="login-btn">
                <span>👤</span> Login / Sign Up
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Nav;