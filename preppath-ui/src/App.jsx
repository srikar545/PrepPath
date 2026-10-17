
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
  ChevronLeft,
} from "lucide-react";
import "./App.css";

const TOPICS_API = "/api/topics";
const questionsApi = (topicId) => `/api/topics/${topicId}/questions`;

function App() {
  // ── Topic state ──────────────────────────────────────────────────────────
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

  // ── Navigation state ─────────────────────────────────────────────────────
  // 'dashboard' shows the topic grid; 'questions' shows the question manager
  const [activePage, setActivePage] = useState("dashboard");

  // ── Question state ────────────────────────────────────────────────────────
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [qText, setQText] = useState("");
  const [qOptionA, setQOptionA] = useState("");
  const [qOptionB, setQOptionB] = useState("");
  const [qOptionC, setQOptionC] = useState("");
  const [qOptionD, setQOptionD] = useState("");
  const [qCorrect, setQCorrect] = useState("A");
  const [qDifficulty, setQDifficulty] = useState("EASY");
  const [qExplanation, setQExplanation] = useState("");
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [deletingQuestionId, setDeletingQuestionId] = useState(null);

  // ── Topic functions (unchanged from original) ─────────────────────────────
  async function loadTopics() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(TOPICS_API);
      if (!response.ok) throw new Error(`API returned ${response.status}`);
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
    document.getElementById("subjects")?.scrollIntoView({ behavior: "smooth" });
  }

  async function saveTopic(event) {
    event.preventDefault();
    const name = topicName.trim();
    const topicDescription = description.trim();
    if (!name) { setError("Please enter a topic name."); return; }
    setSaving(true);
    setError("");
    try {
      const isEditing = Boolean(editingTopic);
      const response = await fetch(
        isEditing ? `${TOPICS_API}/${editingTopic.id}` : TOPICS_API,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description: topicDescription }),
        }
      );
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      const savedTopic = await response.json();
      if (isEditing) {
        setTopics((current) =>
          current.map((t) => (t.id === savedTopic.id ? savedTopic : t))
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
      const response = await fetch(`${TOPICS_API}/${topic.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      setTopics((current) => current.filter((item) => item.id !== topic.id));
      if (editingTopic?.id === topic.id) resetForm();
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

  // ── Question functions ────────────────────────────────────────────────────
  async function openTopicQuestions(topic) {
    setSelectedTopic(topic);
    setActivePage("questions");
    setMenuOpen(false);
    setError("");
    resetQuestionForm();
    await loadQuestions(topic.id);
  }

  async function loadQuestions(topicId) {
    setQuestionsLoading(true);
    try {
      const response = await fetch(questionsApi(topicId));
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      const data = await response.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load questions for this topic.");
    } finally {
      setQuestionsLoading(false);
    }
  }

  function resetQuestionForm() {
    setShowQuestionForm(false);
    setEditingQuestion(null);
    setQText("");
    setQOptionA("");
    setQOptionB("");
    setQOptionC("");
    setQOptionD("");
    setQCorrect("A");
    setQDifficulty("EASY");
    setQExplanation("");
    setError("");
  }

  function openAddQuestionForm() {
    setEditingQuestion(null);
    setQText("");
    setQOptionA("");
    setQOptionB("");
    setQOptionC("");
    setQOptionD("");
    setQCorrect("A");
    setQDifficulty("EASY");
    setQExplanation("");
    setError("");
    setShowQuestionForm(true);
  }

  function startEditingQuestion(question) {
    setEditingQuestion(question);
    setQText(question.text);
    setQOptionA(question.optionA);
    setQOptionB(question.optionB);
    setQOptionC(question.optionC);
    setQOptionD(question.optionD);
    setQCorrect(question.correctOption);
    setQDifficulty(question.difficulty);
    setQExplanation(question.explanation || "");
    setError("");
    setShowQuestionForm(true);
    document.getElementById("question-form-anchor")?.scrollIntoView({ behavior: "smooth" });
  }

  async function saveQuestion(event) {
    event.preventDefault();
    setSavingQuestion(true);
    setError("");
    const body = {
      text: qText.trim(),
      optionA: qOptionA.trim(),
      optionB: qOptionB.trim(),
      optionC: qOptionC.trim(),
      optionD: qOptionD.trim(),
      correctOption: qCorrect,
      difficulty: qDifficulty,
      explanation: qExplanation.trim() || null,
    };
    try {
      const isEditing = Boolean(editingQuestion);
      const url = isEditing
        ? `${questionsApi(selectedTopic.id)}/${editingQuestion.id}`
        : questionsApi(selectedTopic.id);
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      const saved = await response.json();
      if (isEditing) {
        setQuestions((current) =>
          current.map((q) => (q.id === saved.id ? saved : q))
        );
      } else {
        setQuestions((current) => [...current, saved]);
      }
      resetQuestionForm();
    } catch {
      setError(
        editingQuestion
          ? "Unable to update the question. Please try again."
          : "Unable to save the question. Please try again."
      );
    } finally {
      setSavingQuestion(false);
    }
  }

  async function deleteQuestion(question) {
    const preview = question.text.length > 70
      ? question.text.slice(0, 70) + "…"
      : question.text;
    const confirmed = window.confirm(`Delete question?\n"${preview}"`);
    if (!confirmed) return;
    setDeletingQuestionId(question.id);
    setError("");
    try {
      const response = await fetch(
        `${questionsApi(selectedTopic.id)}/${question.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      setQuestions((current) => current.filter((q) => q.id !== question.id));
      if (editingQuestion?.id === question.id) resetQuestionForm();
    } catch {
      setError("Unable to delete this question. Please try again.");
    } finally {
      setDeletingQuestionId(null);
    }
  }

  function goBackToDashboard() {
    setActivePage("dashboard");
    setSelectedTopic(null);
    setQuestions([]);
    resetQuestionForm();
    setError("");
  }

  // ── Nav items ─────────────────────────────────────────────────────────────
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "My Subjects", icon: BookOpen },
    { label: "Mock Tests", icon: ClipboardCheck },
    { label: "Performance", icon: ChartNoAxesColumn },
  ];

  // Which nav item index is "active"
  const activeNavIndex =
    activePage === "questions" ? 1 : 0;

  // ── Render ────────────────────────────────────────────────────────────────
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
              className={`nav-item ${index === activeNavIndex ? "active" : ""}`}
              onClick={() => {
                setMenuOpen(false);
                if (index === 0) {
                  goBackToDashboard();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else if (index === 1) {
                  if (activePage === "questions") {
                    goBackToDashboard();
                  }
                  document
                    .getElementById("subjects")
                    ?.scrollIntoView({ behavior: "smooth" });
                } else {
                  setError(`${label} will be available in a later phase.`);
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
            Workspace <span>/</span>{" "}
            {activePage === "questions" ? (
              <>
                <button className="breadcrumb-link" onClick={goBackToDashboard}>
                  My Subjects
                </button>
                <span>/</span> <strong>{selectedTopic?.name}</strong>
              </>
            ) : (
              <strong>Dashboard</strong>
            )}
          </div>

          <div className="topbar-actions">
            <label className="search-box">
              <Search size={17} />
              <input
                placeholder={activePage === "questions" ? "Search questions…" : "Search topics…"}
                aria-label="Search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <kbd>Ctrl K</kbd>
            </label>

            <button
              className="icon-button notification"
              aria-label="Notifications"
              onClick={() => setError("You have no new notifications.")}
            >
              <Bell size={19} />
              <span />
            </button>
          </div>
        </header>

        <div className="page-content">
          {/* ── Error banner ── */}
          {error && (
            <div className="message-banner" role="alert">
              <span>{error}</span>
              <button onClick={() => setError("")} aria-label="Dismiss message">
                <X size={16} />
              </button>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              DASHBOARD PAGE
          ══════════════════════════════════════════════════════════════ */}
          {activePage === "dashboard" && (
            <>
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
                  <div className="stat-foot">Available after your first test</div>
                </article>

                <article className="stat-card">
                  <div className="stat-top">
                    <span>Study streak</span>
                    <div className="stat-icon orange">
                      <Flame size={19} />
                    </div>
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
                        onChange={(event) => setTopicName(event.target.value)}
                        placeholder="e.g. Indian Polity"
                        maxLength={150}
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
                          ? "Saving…"
                          : editingTopic
                            ? "Update topic"
                            : "Save topic"}
                      </button>
                    </div>
                  </form>
                )}

                {loading ? (
                  <div className="empty-state">Loading your topics…</div>
                ) : topics.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <BookOpen size={26} />
                    </div>
                    <h3>Your learning library is empty</h3>
                    <p>Add your first topic to begin building your study plan.</p>
                    <button className="primary-button" onClick={openAddForm}>
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
                          <ArrowUpRight size={18} className="topic-arrow" />
                        </div>
                        <h3>{topic.name}</h3>
                        <p>
                          {topic.description || "No description added yet."}
                        </p>
                        <div className="topic-card-footer">
                          <button
                            className="questions-link"
                            onClick={() => openTopicQuestions(topic)}
                          >
                            Questions →
                          </button>
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
                              disabled={saving || deletingId !== null}
                            >
                              <Trash2 size={14} />
                              {deletingId === topic.id
                                ? "Deleting…"
                                : "Delete"}
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {/* ══════════════════════════════════════════════════════════════
              QUESTIONS PAGE
          ══════════════════════════════════════════════════════════════ */}
          {activePage === "questions" && (
            <section className="questions-page">
              {/* ── Page header ── */}
              <div className="qpage-header">
                <button className="back-button" onClick={goBackToDashboard}>
                  <ChevronLeft size={16} />
                  Back to topics
                </button>
                <div className="qpage-title">
                  <div className="topic-symbol">
                    <BookOpen size={21} />
                  </div>
                  <div>
                    <h2>{selectedTopic?.name}</h2>
                    <p>
                      {questions.length}{" "}
                      {questions.length === 1 ? "question" : "questions"} in
                      this topic
                    </p>
                  </div>
                </div>
                <button
                  className="primary-button"
                  onClick={() => {
                    if (showQuestionForm && !editingQuestion) {
                      resetQuestionForm();
                    } else {
                      openAddQuestionForm();
                    }
                  }}
                >
                  <Plus size={17} />
                  Add question
                </button>
              </div>

              {/* ── Question form (add / edit) ── */}
              <div id="question-form-anchor" />
              {showQuestionForm && (
                <form className="question-form" onSubmit={saveQuestion}>
                  <h3>
                    {editingQuestion ? "Edit question" : "Add a new question"}
                  </h3>

                  <label>
                    Question text
                    <textarea
                      value={qText}
                      onChange={(e) => setQText(e.target.value)}
                      placeholder="Write the question stem here…"
                      rows={3}
                      maxLength={1000}
                      required
                    />
                  </label>

                  <div className="options-grid">
                    {[
                      ["A", qOptionA, setQOptionA],
                      ["B", qOptionB, setQOptionB],
                      ["C", qOptionC, setQOptionC],
                      ["D", qOptionD, setQOptionD],
                    ].map(([letter, value, setter]) => (
                      <label key={letter}>
                        Option {letter}
                        <input
                          value={value}
                          onChange={(e) => setter(e.target.value)}
                          placeholder={`Choice ${letter}`}
                          maxLength={500}
                          required
                        />
                      </label>
                    ))}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <span className="form-label">Correct answer</span>
                      <div className="option-pills">
                        {["A", "B", "C", "D"].map((opt) => (
                          <label
                            key={opt}
                            className={`option-pill ${qCorrect === opt ? "selected" : ""}`}
                          >
                            <input
                              type="radio"
                              name="correctOption"
                              value={opt}
                              checked={qCorrect === opt}
                              onChange={() => setQCorrect(opt)}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <span className="form-label">Difficulty</span>
                      <select
                        className="difficulty-select"
                        value={qDifficulty}
                        onChange={(e) => setQDifficulty(e.target.value)}
                      >
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                      </select>
                    </div>
                  </div>

                  <label>
                    Explanation <span className="optional-tag">(optional)</span>
                    <textarea
                      value={qExplanation}
                      onChange={(e) => setQExplanation(e.target.value)}
                      placeholder="Why is this the correct answer?"
                      rows={3}
                      maxLength={2000}
                    />
                  </label>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={resetQuestionForm}
                      disabled={savingQuestion}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="primary-button"
                      disabled={savingQuestion}
                    >
                      {savingQuestion
                        ? "Saving…"
                        : editingQuestion
                          ? "Update question"
                          : "Save question"}
                    </button>
                  </div>
                </form>
              )}

              {/* ── Question list ── */}
              {questionsLoading ? (
                <div className="empty-state">Loading questions…</div>
              ) : questions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <BookOpen size={26} />
                  </div>
                  <h3>No questions yet</h3>
                  <p>Add your first question for this topic.</p>
                  <button className="primary-button" onClick={openAddQuestionForm}>
                    <Plus size={17} />
                    Add first question
                  </button>
                </div>
              ) : (
                <div className="questions-list">
                  {questions.map((question, index) => (
                    <article className="question-card" key={question.id}>
                      <div className="question-card-left">
                        <span className="question-number">#{index + 1}</span>
                        <span
                          className={`difficulty-badge ${question.difficulty.toLowerCase()}`}
                        >
                          {question.difficulty.charAt(0) +
                            question.difficulty.slice(1).toLowerCase()}
                        </span>
                      </div>

                      <div className="question-card-body">
                        <p className="question-text">{question.text}</p>
                        <div className="question-options-preview">
                          {["A", "B", "C", "D"].map((letter) => (
                            <span
                              key={letter}
                              className={`option-chip ${question.correctOption === letter ? "correct" : ""}`}
                            >
                              <strong>{letter}:</strong>{" "}
                              {question[`option${letter}`]}
                            </span>
                          ))}
                        </div>
                        {question.explanation && (
                          <p className="question-explanation">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        )}
                      </div>

                      <div className="question-card-actions">
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => startEditingQuestion(question)}
                          aria-label="Edit question"
                          disabled={savingQuestion || deletingQuestionId !== null}
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => deleteQuestion(question)}
                          aria-label="Delete question"
                          disabled={savingQuestion || deletingQuestionId !== null}
                        >
                          <Trash2 size={14} />
                          {deletingQuestionId === question.id
                            ? "Deleting…"
                            : "Delete"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

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
