"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ChevronDown,
  CirclePlay, Clock3, GraduationCap, Headphones, LayoutDashboard, LockKeyhole,
  LogOut, Menu, Play, Plus, Search, ShieldCheck, Sparkles, Trash2, Users,
  Video, X, Pencil, ChartNoAxesColumnIncreasing, MonitorSmartphone
} from "lucide-react";
import { Lesson, Level, starterLessons, levelLabel } from "@/lib/types";

type View = "home" | "lessons" | "admin-login" | "admin";

const STORAGE_KEY = "englishpro-lessons-v1";
const ADMIN_PASSWORD = "englishpro-demo-2026";

function safeEmbedUrl(raw: string) {
  const value = raw.trim();
  if (/youtube\.com\/embed\/[A-Za-z0-9_-]+/.test(value)) return value;
  const short = value.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const watch = value.match(/[?&]v=([A-Za-z0-9_-]+)/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
  if (/^https:\/\/player\.vimeo\.com\/video\/\d+/.test(value)) return value;
  return "";
}

function Brand({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="brand" aria-label="EnglishPro bosh sahifa">
      <span className="brand-mark">E<span>P</span></span>
      <span>English<span className="brand-accent">Pro</span></span>
    </button>
  );
}

function Header({ view, setView, openMobile }: {
  view: View; setView: (v: View) => void; openMobile: () => void;
}) {
  return (
    <header className="topbar">
      <div className="container nav-inner">
        <Brand onClick={() => setView("home")} />
        <nav className="desktop-nav" aria-label="Asosiy navigatsiya">
          <button className={view === "home" ? "nav-link active" : "nav-link"} onClick={() => setView("home")}>Bosh sahifa</button>
          <button className="nav-link" onClick={() => setView("lessons")}>Darslar</button>
          <a className="nav-link" href="#features">Afzalliklar</a>
          <a className="nav-link" href="#contact">Bog'lanish</a>
        </nav>
        <div className="nav-actions">
          <button className="button button-quiet admin-nav" onClick={() => setView("admin-login")}><LockKeyhole size={15}/> Admin</button>
          <button className="button button-primary nav-cta" onClick={() => setView("lessons")}>Darslarni ko'rish <ArrowRight size={16}/></button>
          <button className="icon-button mobile-menu" onClick={openMobile} aria-label="Menyuni ochish"><Menu/></button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return <footer id="contact" className="footer">
    <div className="container footer-inner">
      <div><Brand onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}/><p className="muted footer-copy">O'rganish bugun boshlanadi. Natija esa har kuni quriladi.</p></div>
      <div className="footer-right"><span>© {new Date().getFullYear()} EnglishPro</span><span className="footer-dot"/> <span>Barcha huquqlar himoyalangan</span></div>
    </div>
  </footer>;
}

function LessonCard({ lesson, index, onPlay }: { lesson: Lesson; index: number; onPlay: (l: Lesson) => void }) {
  return <button className="lesson-card" onClick={() => onPlay(lesson)}>
    <div className={`lesson-art art-${index % 3}`}><span className="art-icon"><BookOpen size={25}/></span><span className="art-number">{String(index + 1).padStart(2, "0")}</span><span className="art-play"><Play size={17} fill="currentColor"/></span></div>
    <div className="lesson-card-body">
      <div className="lesson-meta"><span className={`level-pill ${lesson.level.toLowerCase()}`}>{levelLabel[lesson.level]}</span><span><Clock3 size={13}/>{lesson.duration}</span></div>
      <h3>{lesson.title}</h3><p>{lesson.description}</p>
      <span className="lesson-open">Darsni boshlash <ArrowRight size={15}/></span>
    </div>
  </button>;
}

export default function EnglishPro() {
  const [view, setView] = useState<View>("home");
  const [lessons, setLessons] = useState<Lesson[]>(starterLessons);
  const [selected, setSelected] = useState<Lesson>(starterLessons[0]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | Level>("All");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState({ title: "", level: "Beginner" as Level, description: "", videoUrl: "", duration: "10:00" });
  const [savedNotice, setSavedNotice] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Lesson[];
        if (Array.isArray(parsed)) {
          setLessons(parsed);
          if (parsed.length) setSelected(parsed[0]);
        }
      }
    } catch { /* browser storage may be unavailable */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons)); } catch { /* ignore */ }
  }, [lessons]);

  const filteredLessons = useMemo(() => lessons.filter((lesson) => {
    const matchesText = `${lesson.title} ${lesson.description}`.toLowerCase().includes(search.toLowerCase());
    return matchesText && (filter === "All" || lesson.level === filter);
  }), [lessons, search, filter]);

  function navigate(next: View) {
    setView(next); setMobileOpen(false); window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function playLesson(lesson: Lesson) {
    setSelected(lesson); navigate("lessons");
  }
  function openAdd() {
    setEditingId(null);
    setForm({ title: "", level: "Beginner", description: "", videoUrl: "", duration: "10:00" });
    setModal(true);
  }
  function openEdit(lesson: Lesson) {
    setEditingId(lesson.id);
    setForm({ title: lesson.title, level: lesson.level, description: lesson.description, videoUrl: lesson.videoUrl, duration: lesson.duration });
    setModal(true);
  }
  function saveLesson(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const embed = safeEmbedUrl(form.videoUrl);
    if (!embed) { setSavedNotice("YouTube yoki Vimeo video havolasini to'g'ri kiriting."); return; }
    const lesson: Lesson = {
      id: editingId || (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now())),
      title: form.title.trim(), level: form.level, description: form.description.trim(),
      videoUrl: embed, duration: form.duration.trim() || "10:00", publishedAt: new Date().toISOString().slice(0, 10)
    };
    setLessons((current) => editingId ? current.map((item) => item.id === editingId ? lesson : item) : [lesson, ...current]);
    if (!editingId) setSelected(lesson);
    setModal(false); setSavedNotice("Dars muvaffaqiyatli saqlandi.");
  }
  function deleteLesson(id: string) {
    if (!window.confirm("Ushbu darsni o'chirishni tasdiqlaysizmi?")) return;
    const next = lessons.filter((lesson) => lesson.id !== id);
    setLessons(next);
    if (selected.id === id && next.length) setSelected(next[0]);
    setSavedNotice("Dars o'chirildi.");
  }
  function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) { setPassword(""); setLoginError(""); navigate("admin"); }
    else setLoginError("Parol noto'g'ri. Demo parolni README faylidan ko'ring.");
  }

  return <div className="app-shell">
    <Header view={view} setView={navigate} openMobile={() => setMobileOpen((v) => !v)}/>
    {mobileOpen && <div className="mobile-drawer"><button onClick={() => navigate("home")}>Bosh sahifa</button><button onClick={() => navigate("lessons")}>Darslar</button><a href="#features" onClick={() => setMobileOpen(false)}>Afzalliklar</a><button onClick={() => navigate("admin-login")}>Admin panel</button></div>}

    {view === "home" && <>
      <main>
        <section className="hero">
          <div className="hero-glow glow-one"/><div className="hero-glow glow-two"/>
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><Sparkles size={14}/> O'rganishning yangi bosqichi</div>
              <h1>Ingliz tilini <span>ishonch bilan</span> o'rganing.</h1>
              <p className="hero-description">Noldan boshlab yangi marralargacha. Video darslar, amaliy mashqlar va aniq o'quv yo'li — barchasi bitta platformada.</p>
              <div className="hero-actions"><button className="button button-primary button-large" onClick={() => navigate("lessons")}>Bepul darslarni boshlash <ArrowRight size={17}/></button><a className="text-link" href="#courses">Kurslarni ko'rish <ArrowRight size={15}/></a></div>
              <div className="hero-proof"><div className="proof-avatars"><span>A</span><span>E</span><span>+</span></div><div><strong>Har kuni oz-ozdan</strong><small>Barqaror o'rganish — katta natija</small></div></div>
            </div>
            <div className="hero-visual">
              <div className="visual-orbit orbit-a"/><div className="visual-orbit orbit-b"/>
              <div className="learning-card">
                <div className="learning-top"><span className="live-dot"/> YOUR LEARNING SPACE <span className="dots">•••</span></div>
                <div className="learning-title">Today's progress</div>
                <div className="progress-row"><div><strong>01</strong><span>Lesson</span></div><div><strong>15</strong><span>Minutes</span></div><div><strong>A1</strong><span>Level</span></div></div>
                <div className="mini-course"><div className="mini-icon"><Headphones size={21}/></div><div><strong>Everyday English</strong><small>Start with the basics</small></div><span className="mini-arrow"><ArrowRight size={16}/></span></div>
                <div className="learning-bottom"><span><CheckCircle2 size={15}/> Small steps matter</span><span>EN / UZ</span></div>
              </div>
              <div className="float-chip chip-top"><span className="chip-icon"><GraduationCap size={17}/></span><span><b>Learn</b><small>at your pace</small></span></div>
              <div className="float-chip chip-bottom"><span className="chip-icon purple"><ChartNoAxesColumnIncreasing size={17}/></span><span><b>Keep growing</b><small>one lesson at a time</small></span></div>
              <div className="hero-decoration">Aa</div>
            </div>
          </div>
          <div className="container hero-bottom"><span>BUILD YOUR ENGLISH</span><div/><span>LEARN · PRACTICE · IMPROVE</span></div>
        </section>

        <section id="courses" className="section container">
          <div className="section-heading"><div><span className="section-kicker">O'QUV DASTURLARI</span><h2>O'z darajangizdan boshlang.</h2></div><p>Har bir bosqichda kerakli bilim va amaliyot. O'zingizga mos yo'nalishni tanlang.</p></div>
          <div className="course-grid">
            {([
              { level: "Beginner" as Level, code: "A1 — A2", title: "Poydevor", desc: "Alifbo, kundalik so'zlar, sodda gaplar va asosiy grammatika.", count: "Boshlash uchun", cls: "course-green" },
              { level: "Intermediate" as Level, code: "B1 — B2", title: "Ishonch", desc: "Murakkabroq grammatika, tinglab tushunish va erkin muloqot.", count: "Keyingi bosqich", cls: "course-blue" },
              { level: "Advanced" as Level, code: "C1 — C2", title: "Mukammallik", desc: "Akademik va professional ingliz tili, aniq va ravon nutq.", count: "Yuqori daraja", cls: "course-violet" }
            ]).map((course, i) => <article className={`course-card ${course.cls}`} key={course.level}>
              <div className="course-card-top"><span>{course.code}</span><span className="course-symbol">{["01", "02", "03"][i]}</span></div>
              <div><span className="course-caption">{course.count}</span><h3>{course.title}</h3><p>{course.desc}</p></div>
              <button onClick={() => { setFilter(course.level); navigate("lessons"); }} className="course-link">Darslarni ko'rish <ArrowRight size={16}/></button>
            </article>)}
          </div>
        </section>

        <section id="features" className="feature-section">
          <div className="container">
            <div className="section-heading"><div><span className="section-kicker">NIMA UCHUN ENGLISHPRO?</span><h2>O'rganish uchun kerakli<br/>hamma narsa bir joyda.</h2></div><p>Oddiy, tushunarli va tartibli o'quv tajribasi. O'z tezligingizda o'rganing.</p></div>
            <div className="feature-grid">
              <div className="feature-item"><span className="feature-icon"><Video/></span><h3>Video darslar</h3><p>Mavzularni qayta ko'rish mumkin bo'lgan tushunarli darslar.</p></div>
              <div className="feature-item"><span className="feature-icon"><MonitorSmartphone/></span><h3>Har qanday qurilma</h3><p>Telefon, planshet yoki kompyuterda qulay foydalaning.</p></div>
              <div className="feature-item"><span className="feature-icon"><ChartNoAxesColumnIncreasing/></span><h3>Tartibli o'quv yo'li</h3><p>Darajalar bo'yicha bosqichma-bosqich oldinga yuring.</p></div>
              <div className="feature-item"><span className="feature-icon"><Headphones/></span><h3>Amaliy mashqlar</h3><p>O'rganganlaringizni tinglash va gapirish orqali mustahkamlang.</p></div>
            </div>
          </div>
        </section>

        <section className="cta-section container"><div className="cta-panel"><div><span className="section-kicker">BUGUN BOSHLANG</span><h2>Har bir yangi so'z —<br/>yangi imkoniyat.</h2><p>Birinchi darsni oching va o'rganishni boshlang.</p></div><button className="button button-light button-large" onClick={() => navigate("lessons")}>Darslarga o'tish <ArrowRight size={17}/></button><span className="cta-watermark">EN</span></div></section>
      </main>
      <Footer/>
    </>}

    {view === "lessons" && <main className="container page-main">
      <div className="page-heading"><div><button className="back-link" onClick={() => navigate("home")}><ArrowLeft size={15}/> Bosh sahifa</button><span className="section-kicker">VIDEO KUTUBXONA</span><h1>Darslar markazi</h1><p>O'zingizga mos darsni tanlang va o'rganishni boshlang.</p></div><div className="lesson-count"><BookOpen size={17}/><strong>{lessons.length}</strong><span>ta dars</span></div></div>
      <div className="player-layout">
        <section className="player-column">
          <div className="video-frame">{selected && safeEmbedUrl(selected.videoUrl) ? <iframe key={selected.id} src={safeEmbedUrl(selected.videoUrl)} title={selected.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/> : <div className="video-empty"><CirclePlay size={42}/><p>Hozircha dars tanlanmagan</p></div>}</div>
          {selected && <div className="now-playing"><div className="now-playing-meta"><span className={`level-pill ${selected.level.toLowerCase()}`}>{levelLabel[selected.level]}</span><span><Clock3 size={13}/>{selected.duration}</span></div><h2>{selected.title}</h2><p>{selected.description}</p></div>}
        </section>
        <aside className="playlist-panel"><div className="playlist-heading"><div><h3>Darslar ro'yxati</h3><p>O'rganish uchun tanlang</p></div><span className="playlist-total">{lessons.length}</span></div>
          <div className="search-box"><Search size={16}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Dars qidirish..."/></div>
          <div className="filter-row"><button className={filter === "All" ? "filter active" : "filter"} onClick={() => setFilter("All")}>Barchasi</button>{(["Beginner", "Intermediate", "Advanced"] as Level[]).map((level) => <button key={level} className={filter === level ? "filter active" : "filter"} onClick={() => setFilter(level)}>{levelLabel[level]}</button>)}</div>
          <div className="playlist-list">{filteredLessons.length ? filteredLessons.map((lesson, i) => <button key={lesson.id} onClick={() => setSelected(lesson)} className={selected.id === lesson.id ? "playlist-item selected" : "playlist-item"}><span className="playlist-play"><Play size={14} fill="currentColor"/></span><span className="playlist-text"><b>{lesson.title}</b><small>{levelLabel[lesson.level]} · {lesson.duration}</small></span>{selected.id === lesson.id && <span className="playing-mark"><span/><span/><span/></span>}</button>) : <div className="empty-state">Bu bo'limda dars topilmadi.</div>}</div>
        </aside>
      </div>
    </main>}

    {view === "admin-login" && <main className="login-wrap"><form className="login-card" onSubmit={login}><div className="login-icon"><ShieldCheck size={26}/></div><span className="section-kicker">BOSHQARUV MARKAZI</span><h1>Admin panel</h1><p>Davom etish uchun demo parolni kiriting.</p><label className="field-label" htmlFor="admin-password">Parol</label><input id="admin-password" className="field-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Admin paroli" autoComplete="current-password"/>{loginError && <p className="form-error">{loginError}</p>}<button className="button button-primary login-submit" type="submit">Kirish <ArrowRight size={16}/></button><button type="button" className="login-back" onClick={() => navigate("home")}>Bosh sahifaga qaytish</button><small className="demo-note">Demo loyiha: parol README faylida ko'rsatilgan.</small></form></main>}

    {view === "admin" && <main className="container admin-main">
      <div className="admin-heading"><div><span className="section-kicker">ENGLISHPRO / BOSHQARUV</span><h1>Dashboard</h1><p>Kurs kontentini boshqaring.</p></div><div className="admin-actions"><button className="button button-primary" onClick={openAdd}><Plus size={17}/> Yangi dars</button><button className="button button-quiet" onClick={() => navigate("home")}><LogOut size={16}/> Chiqish</button></div></div>
      {savedNotice && <div className="notice"><CheckCircle2 size={16}/>{savedNotice}<button onClick={() => setSavedNotice("")}><X size={15}/></button></div>}
      <div className="stats-grid"><div className="stat-card"><span className="stat-icon"><Video/></span><div><small>Jami darslar</small><strong>{lessons.length}</strong></div></div><div className="stat-card"><span className="stat-icon purple-stat"><GraduationCap/></span><div><small>O'quv yo'nalishlari</small><strong>3</strong></div></div><div className="stat-card"><span className="stat-icon green-stat"><Users/></span><div><small>Saqlash usuli</small><strong className="stat-word">Brauzer</strong></div></div></div>
      <div className="admin-content"><section className="admin-table-card"><div className="table-title"><div><h2>Darslar boshqaruvi</h2><p>Video darslarni qo'shing, tahrirlang yoki o'chiring.</p></div><span className="table-count">{lessons.length} ta</span></div>
        {lessons.length ? <div className="table-scroll"><table><thead><tr><th>Dars nomi</th><th>Daraja</th><th>Davomiyligi</th><th className="align-right">Amallar</th></tr></thead><tbody>{lessons.map((lesson) => <tr key={lesson.id}><td><strong>{lesson.title}</strong><small>{lesson.description}</small></td><td><span className={`level-pill ${lesson.level.toLowerCase()}`}>{levelLabel[lesson.level]}</span></td><td>{lesson.duration}</td><td><div className="table-actions"><button aria-label="Tahrirlash" onClick={() => openEdit(lesson)}><Pencil size={15}/></button><button aria-label="O'chirish" className="delete-action" onClick={() => deleteLesson(lesson.id)}><Trash2 size={15}/></button></div></td></tr>)}</tbody></table></div> : <div className="empty-state">Hozircha dars yo'q. Yangi dars qo'shing.</div>}
      </section><aside className="admin-tip"><span className="tip-icon"><LayoutDashboard/></span><h3>Admin uchun eslatma</h3><p>Bu versiyada darslar shu brauzerning localStorage xotirasida saqlanadi. Boshqa qurilmalarga avtomatik o'tmaydi.</p><div className="tip-divider"/><div className="tip-check"><Check size={15}/> YouTube havolasini qo'llab-quvvatlaydi</div><div className="tip-check"><Check size={15}/> Darslarni tahrirlash va o'chirish</div><div className="tip-check"><Check size={15}/> Qidirish va daraja bo'yicha saralash</div></aside></div>
    </main>}

    {modal && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setModal(false); }}><form className="lesson-modal" onSubmit={saveLesson}><div className="modal-head"><div><span className="section-kicker">KONTENT TAHRIRI</span><h2>{editingId ? "Darsni tahrirlash" : "Yangi dars qo'shish"}</h2></div><button type="button" className="icon-button" onClick={() => setModal(false)} aria-label="Yopish"><X/></button></div><label className="field-label">Dars sarlavhasi</label><input className="field-input" required maxLength={100} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Masalan: 4-dars — Past Simple"/><div className="form-two"><div><label className="field-label">Daraja</label><div className="select-wrap"><select className="field-input" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as Level })}><option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option></select><ChevronDown size={15}/></div></div><div><label className="field-label">Davomiyligi</label><input className="field-input" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="12:30"/></div></div><label className="field-label">YouTube / Vimeo havolasi</label><input className="field-input" required type="url" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://youtu.be/..."/><label className="field-label">Qisqacha tavsif</label><textarea className="field-input field-textarea" required maxLength={300} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Dars mazmunini qisqacha yozing..."/>{savedNotice.startsWith("YouTube") && <p className="form-error">{savedNotice}</p>}<div className="modal-actions"><button type="button" className="button button-quiet" onClick={() => setModal(false)}>Bekor qilish</button><button type="submit" className="button button-primary"><Check size={16}/> Saqlash</button></div></form></div>}
  </div>;
}
