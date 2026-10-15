
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  ChartNoAxesColumn,
  Settings,
  Search,
  Bell,
  Plus,
  ArrowUpRight,
  Clock3,
  Target,
  Flame,
  Menu,
  X,
} from "lucide-react";
import "./App.css";

const API_URL = "/api/topics";

function App() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [topicName, setTopicName] = useState("");
  const [description, setDescription] = useState("");

  async function loadTopics() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      setTopics(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Could not connect to PrepPath backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTopics();
  }, []);

  async function addTopic(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: topicName,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const createdTopic = await response.json();
      setTopics((current) => [...current, createdTopic]);
      setTopicName("");
      setDescription("");
      setShowForm(false);
    } catch (err) {
      setError(
        "Unable to save the topic. Check the backend and API configuration."
      );
    }
  }

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "My Subjects", icon: BookOpen },
    { label: "Mock Tests", icon: ClipboardCheck },
    { label: "Performance", icon: ChartNoAxesColumn },
  ];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">P</div>
          <div>
            <h2>PrepPath</h2>
            <span>YOUR EXAM COMPANION</span>
          </div>
          <button
            className="icon-button mobile-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        <div className="nav-caption">WORKSPACE</div>
        <nav className="nav-list">
          {navItems.map(({ label, icon: Icon }, index) => (
            <button
              key={label}
              className={`nav-item ${index === 0 ? "active" : ""}`}
              onClick={() => {
                setMenuOpen(false);
                if (index === 1) {
                  document
                    .getElementById("subjects")
                    ?.scrollIntoView({ behavior: "smooth" });
                } else if (index === 2 || index === 3) {
                  setError(`${label} will be available in a later phase.`);
                }
              }}
            >
              <Icon size={19} />
              <span>{label}</span>
              {index === 2 && <span className="nav-badge">Soon</span>}
            </button>
          ))}
        </nav>

        <div className="nav-caption tools-caption">PREFERENCES</div>
        <button className="nav-item" onClick={() => setError("Settings will be added in a later phase.")}>
          <Settings size={19} />
          <span>Settings</span>
        </button>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">
              <Target size={20} />
            </div>
            <strong>Small steps. Big results.</strong>
            <p>Build a consistent study habit, one day at a time.</p>
          </div>
          <div className="profile">
            <div className="avatar">S</div>
            <div className="profile-info">
              <strong>Student</strong>
              <span>Exam preparation</span>
            </div>
            <Settings size={17} className="profile-settings" />
          </div>
        </div>
      </aside>

      {menuOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <main className="main-content">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={21} />
          </button>
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>Dashboard</strong>
          </div>
          <div className="topbar-actions">
            <label className="search-box">
              <Search size={17} />
              <input placeholder="Search topics..." aria-label="Search topics" />
              <kbd>⌘ K</kbd>
            </label>
            <button className="icon-button notification" aria-label="Notifications">
              <Bell size={19} />
              <span />
            </button>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">
                <span className="status-dot" /> YOUR LEARNING SPACE
              </div>
              <h1>Let's make today count.</h1>
              <p>Build your knowledge, track your progress, and prepare with purpose.</p>
            </div>
            <div className="date-label">
              <Clock3 size={16} />
              Your preparation starts here
            </div>
          </section>

          {error && (
            <div className="message-banner" role="status">
              {error}
              <button onClick={() => setError("")} aria-label="Dismiss">
                <X size={16} />
              </button>
            </div>
          )}

          <section className="stats-grid">
            <article className="stat-card">
              <div className="stat-top">
                <span>Total topics</span>
                <div className="stat-icon blue"><BookOpen size={19} /></div>
              </div>
              <div className="stat-value">{topics.length}</div>
              <div className="stat-foot">Topics in your library</div>
            </article>
            <article className="stat-card">
              <div className="stat-top">
                <span>Study sessions</span>
                <div className="stat-icon purple"><Clock3 size={19} /></div>
              </div>
              <div className="stat-value">0</div>
              <div className="stat-foot">Sessions recorded so far</div>
            </article>
            <article className="stat-card">
              <div className="stat-top">
                <span>Test accuracy</span>
                <div className="stat-icon green"><Target size={19} /></div>
              </div>
              <div className="stat-value">—</div>
              <div className="stat-foot">Available after your first test</div>
            </article>
            <article className="stat-card">
              <div className="stat-top">
                <span>Study streak</span>
                <div className="stat-icon orange"><Flame size={19} /></div>
              </div>
              <div className="stat-value">0 days</div>
              <div className="stat-foot">Start building your routine</div>
            </article>
          </section>

          <section className="section-block" id="subjects">
            <div className="section-heading">
              <div>
                <h2>Your subjects &amp; topics</h2>
                <p>Organize what you need to learn.</p>
              </div>
              <button className="primary-button" onClick={() => setShowForm(!showForm)}>
                <Plus size={17} />
                Add topic
              </button>
            </div>

            {showForm && (
              <form className="topic-form" onSubmit={addTopic}>
                <h3>Add a new topic</h3>
                <label>
                  Topic name
                  <input
                    value={topicName}
                    onChange={(event) => setTopicName(event.target.value)}
                    placeholder="e.g. Indian Polity"
                    required
                  />
                </label>
                <label>
                  Description
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="What will you study?"
                    rows={3}
                  />
                </label>
                <div className="form-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-button">
                    Save topic
                  </button>
                </div>
              </form>
            )}

            {loading ? (
              <div className="empty-state">Loading your topics...</div>
            ) : topics.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><BookOpen size={26} /></div>
                <h3>Your learning library is empty</h3>
                <p>Add your first topic to begin building your study plan.</p>
                <button className="primary-button" onClick={() => setShowForm(true)}>
                  <Plus size={17} /> Create your first topic
                </button>
              </div>
            ) : (
              <div className="topics-grid">
                {topics.map((topic) => (
                  <article className="topic-card" key={topic.id}>
                    <div className="topic-card-top">
                      <div className="topic-symbol"><BookOpen size={21} /></div>
                      <ArrowUpRight size={18} className="topic-arrow" />
                    </div>
                    <h3>{topic.name}</h3>
                    <p>{topic.description || "No description added yet."}</p>
                    <div className="topic-card-footer">
                      <span>Study topic</span>
                      <span className="topic-status">Added</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <footer className="page-footer">
            <span>© {new Date().getFullYear()} PrepPath</span>
            <span>Learn consistently. Improve continuously.</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
