import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle, 
  ArrowLeft, 
  FileText, 
  HelpCircle, 
  MessageSquare, 
  Award,
  Sparkles,
  Save,
  Trash2
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LessonPlayer({ courseId, initialLessonId, onBack, onOpenCertificate }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('notes');
  
  // DB Progress & Notes
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [progressPct, setProgressPct] = useState(0);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [notesList, setNotesList] = useState([]);

  const { isAuthenticated } = useAuth();

  const loadPlayerData = async () => {
    setLoading(true);
    try {
      const courseData = await api.getCourseDetail(courseId);
      setCourse(courseData);

      // Determine initial active lesson
      let foundLesson = null;
      for (const section of courseData.curriculum || []) {
        for (const lesson of section.lessons || []) {
          if (lesson.id === initialLessonId) {
            foundLesson = lesson;
            break;
          }
        }
      }
      if (!foundLesson && courseData.curriculum?.[0]?.lessons?.[0]) {
        foundLesson = courseData.curriculum[0].lessons[0];
      }
      setCurrentLesson(foundLesson);

      if (isAuthenticated) {
        const prog = await api.getCourseProgress(courseId).catch(() => null);
        if (prog) {
          setCompletedLessonIds(prog.completed_lesson_ids);
          setProgressPct(prog.progress_percentage);
        }

        const userNotes = await api.getUserNotes().catch(() => []);
        setNotesList(userNotes.filter(n => n.course_id === courseId));
      }
    } catch (err) {
      console.error("Error loading player data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayerData();
  }, [courseId, isAuthenticated]);

  // Load lesson note when lesson changes
  useEffect(() => {
    const fetchNote = async () => {
      if (currentLesson && isAuthenticated) {
        try {
          const note = await api.getLessonNote(courseId, currentLesson.id);
          setNoteText(note ? note.note_text : '');
        } catch (e) {
          setNoteText('');
        }
      }
    };
    fetchNote();
  }, [currentLesson, courseId, isAuthenticated]);

  const handleToggleComplete = async (lessonId) => {
    if (!isAuthenticated) return;
    const isDone = completedLessonIds.includes(lessonId);
    const newCompletedState = !isDone;

    try {
      const res = await api.toggleProgress(courseId, lessonId, newCompletedState);
      setCompletedLessonIds(res.completed_lesson_ids);
      setProgressPct(res.progress_percentage);
    } catch (err) {
      console.error("Failed to toggle progress:", err);
    }
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!currentLesson || !isAuthenticated) return;
    setSavingNote(true);
    try {
      await api.saveLessonNote(courseId, currentLesson.id, noteText);
      const userNotes = await api.getUserNotes();
      setNotesList(userNotes.filter(n => n.course_id === courseId));
      alert('Note saved to database!');
    } catch (err) {
      alert(err.message || 'Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await api.deleteLessonNote(noteId);
      setNotesList(notesList.filter(n => n.id !== noteId));
      if (currentLesson) setNoteText('');
    } catch (err) {
      alert('Failed to delete note');
    }
  };

  if (loading || !course || !currentLesson) {
    return (
      <div style={{ background: '#070a12', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a5b4fc' }}>
        <Sparkles size={32} className="animate-spin" style={{ marginRight: '0.75rem' }} />
        <span>Loading video player & curriculum...</span>
      </div>
    );
  }

  const curriculum = course.curriculum || [];

  return (
    <div style={{ background: '#070a12', minHeight: '100vh', color: '#f3f4f6' }}>
      {/* Top Navigation Bar */}
      <div style={{
        padding: '0.8rem 1.5rem',
        background: '#0d121f',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={onBack}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            <ArrowLeft size={16} /> Exit Course
          </button>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>{course.title}</h3>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Current Lesson: {currentLesson.title}</span>
          </div>
        </div>

        {/* Progress Bar & Certificate Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '120px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPct}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #10b981)', transition: 'width 0.3s ease' }} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>{progressPct}% Completed</span>
          </div>

          <button 
            onClick={() => onOpenCertificate(course.id)}
            className="btn btn-primary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', gap: '0.4rem' }}
          >
            <Award size={16} /> View Certificate
          </button>
        </div>
      </div>

      {/* Main Grid: Video Player + Playlist */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', height: 'calc(100vh - 60px)' }}>
        {/* Left Column: Video & Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {/* HD Video Player */}
          <div style={{ background: '#000', width: '100%', aspectRatio: '16/9', maxHeight: '520px', position: 'relative' }}>
            <video 
              key={currentLesson.id}
              src={currentLesson.video_url} 
              controls 
              autoPlay 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* Lesson Details & Actions Bar */}
          <div style={{ padding: '1.25rem 1.5rem', background: '#0d121f', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>{currentLesson.title}</h2>
              <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Duration: {currentLesson.duration}</span>
            </div>

            <button
              onClick={() => handleToggleComplete(currentLesson.id)}
              className="btn"
              style={{
                background: completedLessonIds.includes(currentLesson.id) ? '#10b981' : 'var(--primary)',
                color: '#ffffff',
                padding: '0.55rem 1.1rem',
                fontSize: '0.85rem',
                gap: '0.4rem'
              }}
            >
              <CheckCircle size={18} />
              {completedLessonIds.includes(currentLesson.id) ? 'Completed ✓' : 'Mark Completed'}
            </button>
          </div>

          {/* Player Tabs: Notes & Overview */}
          <div style={{ padding: '1.5rem', flex: 1 }}>
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.25rem' }}>
              <button
                onClick={() => setActiveTab('notes')}
                style={{
                  background: 'none', border: 'none', padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: 600,
                  color: activeTab === 'notes' ? '#818cf8' : '#9ca3af',
                  borderBottom: activeTab === 'notes' ? '2px solid #818cf8' : 'none', cursor: 'pointer'
                }}
              >
                📝 Database Lesson Notes
              </button>
              <button
                onClick={() => setActiveTab('all_notes')}
                style={{
                  background: 'none', border: 'none', padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: 600,
                  color: activeTab === 'all_notes' ? '#818cf8' : '#9ca3af',
                  borderBottom: activeTab === 'all_notes' ? '2px solid #818cf8' : 'none', cursor: 'pointer'
                }}
              >
                📚 All Saved Notes ({notesList.length})
              </button>
            </div>

            {activeTab === 'notes' && (
              <form onSubmit={handleSaveNote} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <textarea
                  rows={5}
                  placeholder="Type your notes for this specific lesson here... Notes will be stored in your PostgreSQL/SQLite database."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  style={{
                    width: '100%', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.03)', color: '#ffffff', fontSize: '0.9rem'
                  }}
                />
                <button type="submit" disabled={savingNote} className="btn btn-primary" style={{ alignSelf: 'flex-end', padding: '0.5rem 1.25rem', gap: '0.4rem' }}>
                  <Save size={16} /> {savingNote ? 'Saving to Database...' : 'Save Note to Database'}
                </button>
              </form>
            )}

            {activeTab === 'all_notes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notesList.length === 0 ? (
                  <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>No notes saved for this course yet.</div>
                ) : (
                  notesList.map((n) => (
                    <div key={n.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem', color: '#818cf8' }}>
                        <span>Lesson ID: {n.lesson_id}</span>
                        <button onClick={() => handleDeleteNote(n.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#e5e7eb', whitespace: 'pre-wrap' }}>{n.note_text}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Course Curriculum Playlist */}
        <div style={{ background: '#0a0e1a', borderLeft: '1px solid rgba(255,255,255,0.08)', overflowY: 'auto', padding: '1rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#ffffff', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            Course Content ({course.lessons_count} Lessons)
          </h4>

          {curriculum.map((section, secIdx) => (
            <div key={secIdx} style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#9ca3af', marginBottom: '0.5rem' }}>
                {section.section_title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {(section.lessons || []).map((lesson) => {
                  const isActive = currentLesson.id === lesson.id;
                  const isDone = completedLessonIds.includes(lesson.id);

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => setCurrentLesson(lesson)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)',
                        border: isActive ? '1px solid #6366f1' : '1px solid transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: isActive ? '#ffffff' : '#d1d5db' }}>
                        <Play size={14} color={isActive ? '#818cf8' : '#9ca3af'} />
                        <span style={{ fontWeight: isActive ? 600 : 400 }}>{lesson.title}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                        <span>{lesson.duration}</span>
                        {isDone && <CheckCircle size={14} color="#10b981" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
