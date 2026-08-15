import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Clock, Play, Download, CheckCircle, Sparkles, Trophy, FileText } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function StudentDashboard({ onOpenPlayer, onViewCertificate, onExploreCourses, onOpenAuth }) {
  const [enrollments, setEnrollments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);

  const { user, isAuthenticated } = useAuth();

  const loadDashboard = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [myCourses, myNotes, myCerts] = await Promise.all([
        api.getMyCourses().catch(() => []),
        api.getUserNotes().catch(() => []),
        api.getUserCertificates().catch(() => [])
      ]);

      setEnrollments(myCourses);
      setNotes(myNotes);
      setCertificates(myCerts);

      // Fetch progress for each course
      const pMap = {};
      for (const enc of myCourses) {
        if (enc.course_id) {
          const prog = await api.getCourseProgress(enc.course_id).catch(() => null);
          if (prog) pMap[enc.course_id] = prog.progress_percentage;
        }
      }
      setProgressMap(pMap);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '1280px', margin: '4rem auto', textAlign: 'center', padding: '0 1.5rem' }}>
        <div className="card" style={{ padding: '3rem', maxWidth: '500px', margin: '0 auto' }}>
          <Award size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Student Portal Access</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Please sign in to view your enrolled courses, database notes, and completion certificates.</p>
          <button onClick={onOpenAuth} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Sign In to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ maxWidth: '1280px', margin: '4rem auto', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Sparkles size={32} className="animate-spin" style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
        <div>Loading your student dashboard from backend API...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }} className="animate-fade-in">
      {/* Student Welcome Header Banner */}
      <div className="card" style={{
        padding: '2.5rem',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.1) 100%)',
        border: '1px solid rgba(99,102,241,0.3)',
        marginBottom: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
            <span className="badge badge-purple">Student Portal</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Logged in as {user.full_name} ({user.email})</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Welcome Back, {user.full_name.split(' ')[0]}! 👋</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
            Track your progress, resume video lessons, and access your database notes & earned certificates.
          </p>
        </div>

        {/* Dashboard Stat Counters */}
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem 1.5rem', borderRadius: '14px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', display: 'block' }}>{enrollments.length}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enrolled Courses</span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem 1.5rem', borderRadius: '14px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', display: 'block' }}>{notes.length}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Database Notes</span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem 1.5rem', borderRadius: '14px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', display: 'block' }}>{certificates.length}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Certificates Earned</span>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Grid */}
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <BookOpen size={22} color="var(--primary)" /> My Active Courses ({enrollments.length})
      </h2>

      {enrollments.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', marginBottom: '3rem' }}>
          <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>No Enrolled Courses Yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Explore our API catalog and start mastering in-demand engineering skills today.</p>
          <button onClick={onExploreCourses} className="btn btn-primary" style={{ display: 'inline-flex' }}>
            Explore Course Catalog
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {enrollments.map((enc) => {
            const course = enc.course;
            if (!course) return null;
            const progress = progressMap[course.id] || 0;

            return (
              <div key={enc.id} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: '170px' }}>
                  <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    <span className="badge badge-emerald">Enrolled</span>
                  </div>
                </div>

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.3 }}>{course.title}</h3>
                    
                    {/* Progress Bar */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        <span>Course Completion</span>
                        <strong style={{ color: 'var(--text-color)' }}>{progress}%</strong>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #10b981)' }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => onOpenPlayer(course.id)}
                      className="btn btn-primary" 
                      style={{ flex: 1, justifyContent: 'center', padding: '0.6rem', fontSize: '0.85rem' }}
                    >
                      <Play size={16} /> Resume Learning
                    </button>
                    <button 
                      onClick={() => onViewCertificate(course.id)}
                      className="btn btn-secondary" 
                      style={{ padding: '0.6rem 0.8rem' }}
                      title="View Verified Certificate"
                    >
                      <Award size={16} color="#f59e0b" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Database Notes Summary Section */}
      {notes.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="#f59e0b" /> My Saved Database Notes ({notes.length})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {notes.map((n) => (
              <div key={n.id} className="card" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.4rem' }}>
                  Course: {n.course_id} • Lesson: {n.lesson_id}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, whiteSpace: 'pre-wrap' }}>
                  {n.note_text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
