
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
  Pencil,
  Trash2,
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
  const [editingTopic, setEditingTopic] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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
    } catch {
      setError("Could not connect to PrepPath backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTopics();
  }, []);

  function resetForm() {
    setShowForm(false);
    setEditingTopic(null);
    setTopicName("");
    setDescription("");
    setError("");
  }

  function openAddForm() {
    setEditingTopic(null);
    setTopicName("");
    setDescription("");
    setError("");
    setShowForm(true);
  }

  function startEditing(topic) {
    setEditingTopic(topic);
    setTopicName(topic.name);
    setDescription(topic.description || "");
    setError("");
    setShowForm(true);

    document
      .getElementById("subjects")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  async function saveTopic(event) {
    event.preventDefault();

    const name = topicName.trim();
    const topicDescription = description.trim();

    if (!name) {
      setError("Please enter a topic name.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const isEditing = Boolean(editingTopic);

      const response = await fetch(
        isEditing ? `${API_URL}/${editingTopic.id}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description: topicDescription,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const savedTopic = await response.json();

      if (isEditing) {
        setTopics((current) =>
          current.map((topic) =>
            topic.id === savedTopic.id ? savedTopic : topic
          )
        );
      } else {
        setTopics((current) => [...current, savedTopic]);
      }

      resetForm();
    } catch {
      setError(
        editingTopic
          ? "Unable to update the topic. Please try again."
          : "Unable to save the topic. Check the backend connection."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteTopic(topic) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${topic.name}"?`
    );

    if (!confirmed) return;

    setDeletingId(topic.id);
    setError("");

    try {
      const response = await fetch(`${API_URL}/${topic.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      setTopics((current) =>
        current.filter((item) => item.id !== topic.id)
      );

      if (editingTopic?.id === topic.id) {
        resetForm();
      }
    } catch {
      setError("Unable to delete the topic. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredTopics = topics.filter((topic) => {
    const query = searchQuery.trim().toLowerCase();

    return (
      topic.name.toLowerCase().includes(query) ||
      (topic.description || "").toLowerCase().includes(query)
    );
  });

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
                  setError(
                    `${label} will be available in a later phase.`
                  );
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              <Icon size={19} />
              <span>{label}</span>
              {index === 2 && (
                <span className="nav-badge">Soon</span>
              )}
            </button>
          ))}
        </nav>

        <div className="nav-caption tools-caption">PREFERENCES</div>

        <button
          className="nav-item"
          onClick={() =>
            setError("Settings will be added in a later phase.")
          }
        >
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
              <input
                placeholder="Search topics..."
                aria-label="Search topics"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <kbd>Ctrl K</kbd>
            </label>

            <button
              className="icon-button notification"
              aria-label="Notifications"
              onClick={() =>
                setError("You have no new notifications.")
              }
            >
              <Bell size={19} />
              <span />
            </button>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">
                <span className="status-dot" />
                YOUR LEARNING SPACE
              </div>
              <h1>Let's make today count.</h1>
              <p>
                Build your knowledge, track your progress, and prepare
                with purpose.
              </p>
            </div>

            <div className="date-label">
              <Clock3 size={16} />
              Your preparation starts here
            </div>
          </section>

          {error && (
            <div className="message-banner" role="alert">
              <span>{error}</span>
              <button
                onClick={() => setError("")}
                aria-label="Dismiss message"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <section className="stats-grid">
            <article className="stat-card">
              <div className="stat-top">
                <span>Total topics</span>
                <div className="stat-icon blue">
                  <BookOpen size={19} />
                </div>
              </div>
              <div className="stat-value">{topics.length}</div>
              <div className="stat-foot">Topics in your library</div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>Study sessions</span>
                <div className="stat-icon purple">
                  <Clock3 size={19} />
                </div>
              </div>
              <div className="stat-value">0</div>
              <div className="stat-foot">Sessions recorded so far</div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>Test accuracy</span>
                <div className="stat-icon green">
                  <Target size={19} />
                </div>
              </div>
              <div className="stat-value">—</div>
              <div className="stat-foot">
                Available after your first test
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>Study streak</span>
                <div className="stat-icon orange">
                  <Flame size={19} />
                </div>
              </div>
              <div className="stat-value">0 days</div>
              <div className="stat-foot">
                Start building your routine
              </div>
            </article>
          </section>

          <section className="section-block" id="subjects">
            <div className="section-heading">
              <div>
                <h2>Your subjects &amp; topics</h2>
                <p>Organize what you need to learn.</p>
              </div>

              <button
                className="primary-button"
                onClick={() => {
                  if (showForm && !editingTopic) {
                    resetForm();
                  } else {
                    openAddForm();
                  }
                }}
              >
                <Plus size={17} />
                Add topic
              </button>
            </div>

            {showForm && (
              <form className="topic-form" onSubmit={saveTopic}>
                <h3>
                  {editingTopic ? "Edit topic" : "Add a new topic"}
                </h3>

                <label>
                  Topic name
                  <input
                    value={topicName}
                    onChange={(event) =>
                      setTopicName(event.target.value)
                    }
                    placeholder="e.g. Indian Polity"
                    maxLength={150}
                    required
                  />
                </label>

                <label>
                  Description
                  <textarea
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    placeholder="What will you study?"
                    rows={3}
                    maxLength={1000}
                  />
                </label>

                <div className="form-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={resetForm}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="primary-button"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingTopic
                        ? "Update topic"
                        : "Save topic"}
                  </button>
                </div>
              </form>
            )}

            {loading ? (
              <div className="empty-state">Loading your topics...</div>
            ) : topics.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <BookOpen size={26} />
                </div>
                <h3>Your learning library is empty</h3>
                <p>
                  Add your first topic to begin building your study plan.
                </p>
                <button
                  className="primary-button"
                  onClick={openAddForm}
                >
                  <Plus size={17} />
                  Create your first topic
                </button>
              </div>
            ) : filteredTopics.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <Search size={26} />
                </div>
                <h3>No topics found</h3>
                <p>Try a different topic name or description.</p>
                <button
                  className="secondary-button"
                  onClick={() => setSearchQuery("")}
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="topics-grid">
                {filteredTopics.map((topic) => (
                  <article className="topic-card" key={topic.id}>
                    <div className="topic-card-top">
                      <div className="topic-symbol">
                        <BookOpen size={21} />
                      </div>
                      <ArrowUpRight
                        size={18}
                        className="topic-arrow"
                      />
                    </div>

                    <h3>{topic.name}</h3>
                    <p>
                      {topic.description || "No description added yet."}
                    </p>

                    <div className="topic-card-footer">
                      <span>Study topic</span>

                      <div className="topic-actions">
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => startEditing(topic)}
                          aria-label={`Edit ${topic.name}`}
                          disabled={saving || deletingId !== null}
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => deleteTopic(topic)}
                          aria-label={`Delete ${topic.name}`}
                          disabled={
                            saving || deletingId !== null
                          }
                        >
                          <Trash2 size={14} />
                          {deletingId === topic.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
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
