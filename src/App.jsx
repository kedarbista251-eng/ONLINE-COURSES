import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CourseCard from './components/CourseCard';
import CourseDetail from './components/CourseDetail';
import LessonPlayer from './components/LessonPlayer';
import StudentDashboard from './components/StudentDashboard';
import AdminPanel from './components/AdminPanel';
import CertificateModal from './components/CertificateModal';
import AuthModal from './components/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';
import { 
  Sparkles, 
  Search, 
  Filter, 
  TrendingUp, 
  Award, 
  Users, 
  ShieldCheck, 
  Zap, 
  RefreshCw
} from 'lucide-react';

function MainApp() {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'dashboard' | 'admin'
  
  // Selection & Modal States
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [activePlayerCourseId, setActivePlayerCourseId] = useState(null);
  const [activePlayerLessonId, setActivePlayerLessonId] = useState(null);
  const [certificateCourseId, setCertificateCourseId] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // API Data & Filter States
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [sortBy, setSortBy] = useState('popular');

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Fetch API Courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await api.getCourses({
        search: searchQuery,
        category: selectedCategory,
        level: selectedLevel,
        sort_by: sortBy
      });
      setCourses(data);
    } catch (err) {
      console.error("Error fetching courses from API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedLevel, sortBy]);

  const categories = ['All', 'Development', 'Artificial Intelligence', 'Design', 'Data Science', 'Business'];
  const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <Navbar 
        theme={theme}
        toggleTheme={toggleTheme}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedCourseId(null);
          setActivePlayerCourseId(null);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main View Router */}
      <main style={{ flex: 1 }}>
        {activePlayerCourseId ? (
          /* 1. Fullscreen Video LMS Player */
          <LessonPlayer 
            courseId={activePlayerCourseId}
            initialLessonId={activePlayerLessonId}
            onBack={() => setActivePlayerCourseId(null)}
            onOpenCertificate={(courseId) => setCertificateCourseId(courseId)}
          />
        ) : selectedCourseId ? (
          /* 2. Detailed Course View Page */
          <CourseDetail 
            courseId={selectedCourseId}
            onBack={() => setSelectedCourseId(null)}
            onOpenPlayer={(lessonId) => {
              setActivePlayerCourseId(selectedCourseId);
              setActivePlayerLessonId(lessonId);
            }}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        ) : activeTab === 'admin' ? (
          /* 3. Admin CRUD & Management Panel */
          <AdminPanel onBack={() => setActiveTab('explore')} />
        ) : activeTab === 'dashboard' ? (
          /* 4. Student Personal Learning Dashboard */
          <StudentDashboard 
            onOpenPlayer={(courseId) => {
              setActivePlayerCourseId(courseId);
              setActivePlayerLessonId(null);
            }}
            onViewCertificate={(courseId) => setCertificateCourseId(courseId)}
            onExploreCourses={() => setActiveTab('explore')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        ) : (
          /* 5. Main Course Catalog & Marketplace */
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
            
            {/* Hero Banner Section */}
            <div className="glass-card" style={{
              padding: '3rem 2.5rem',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              marginBottom: '3rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ maxWidth: '680px', position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.35rem 0.85rem', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99,102,241,0.4)', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
                  <Sparkles size={14} /> Production API Platform 2026
                </div>

                <h1 style={{ fontSize: '2.75rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
                  Master High-Demand <span className="text-gradient">Engineering Skills</span>
                </h1>

                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                  Learn from principal engineers & researchers. Interactive curriculum backed by real-time API state, JWT authentication, and database tracking.
                </p>

                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <ShieldCheck size={18} color="#10b981" /> 100% Verified Certificates
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <Zap size={18} color="#f59e0b" /> FastAPI & DB Persistence
                  </div>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        border: '1px solid var(--border-color)',
                        background: selectedCategory === cat ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                        color: selectedCategory === cat ? '#ffffff' : 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Level & Sorting Selectors */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    style={{ padding: '0.5rem 0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-color)', fontSize: '0.85rem' }}
                  >
                    {levels.map(lvl => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ padding: '0.5rem 0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-color)', fontSize: '0.85rem' }}
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                <Sparkles size={32} className="animate-spin" style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                <div>Fetching courses from FastAPI backend API...</div>
              </div>
            ) : courses.length === 0 ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                <Search size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <h3>No Courses Found</h3>
                <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search query or filter settings.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}>
                {courses.map((course) => (
                  <CourseCard 
                    key={course.id}
                    course={course}
                    onClick={() => setSelectedCourseId(course.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Global Certificate Modal */}
      {certificateCourseId && (
        <CertificateModal 
          courseId={certificateCourseId}
          onClose={() => setCertificateCourseId(null)}
        />
      )}

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
