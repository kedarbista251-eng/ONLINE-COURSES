import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Users, DollarSign, Award, Layers, Video, ArrowLeft, Check, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export default function AdminPanel({ onBack }) {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses'); // 'courses', 'instructors'

  // Modals / Editors
  const [editingCourse, setEditingCourse] = useState(null); // null, 'new', or course object
  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    subtitle: '',
    category: 'Development',
    level: 'All Levels',
    price: 49,
    original_price: 99,
    is_bestseller: false,
    thumbnail: '',
    duration: '10 Hours',
    instructor_id: 1,
    tagsStr: 'React, FastAPI',
    learnStr: 'Build fullstack applications\nDeploy microservices',
    sections: [
      {
        section_title: 'Section 1: Getting Started',
        duration: '1h 30m',
        lessons: [
          { id: 'sec1-l1', title: 'Introduction', duration: '10:00', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', is_preview: true }
        ]
      }
    ]
  });

  const [instructorData, setInstructorData] = useState({
    name: '',
    title: '',
    avatar: '',
    bio: ''
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, coursesData, instData] = await Promise.all([
        api.getAdminStats().catch(() => null),
        api.getCourses(),
        api.getInstructors().catch(() => [])
      ]);
      if (statsData) setStats(statsData);
      setCourses(coursesData);
      setInstructors(instData);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleOpenNewCourse = () => {
    const slug = `course-${Date.now()}`;
    setFormData({
      id: slug,
      title: '',
      subtitle: '',
      category: 'Development',
      level: 'All Levels',
      price: 49,
      original_price: 99,
      is_bestseller: false,
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      duration: '10 Hours',
      instructor_id: instructors[0]?.id || 1,
      tagsStr: 'React, Python, FastAPI',
      learnStr: 'Master modern fullstack development\nBuild APIs with FastAPI and React',
      sections: [
        {
          section_title: 'Section 1: Introduction & Overview',
          duration: '1h 00m',
          lessons: [
            { id: `${slug}-l1`, title: 'Course Overview', duration: '15:00', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', is_preview: true }
          ]
        }
      ]
    });
    setEditingCourse('new');
  };

  const handleOpenEditCourse = (course) => {
    setFormData({
      id: course.id,
      title: course.title,
      subtitle: course.subtitle || '',
      category: course.category,
      level: course.level || 'All Levels',
      price: course.price,
      original_price: course.original_price || course.price * 2,
      is_bestseller: course.is_bestseller || false,
      thumbnail: course.thumbnail || '',
      duration: course.duration || '10 Hours',
      instructor_id: course.instructor?.id || (instructors[0]?.id || 1),
      tagsStr: (course.tags || []).join(', '),
      learnStr: (course.what_you_will_learn || []).join('\n'),
      sections: course.curriculum || []
    });
    setEditingCourse(course);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm(`Are you sure you want to delete course '${courseId}'?`)) return;
    try {
      await api.deleteCourse(courseId);
      setMsg('Course deleted successfully');
      loadAdminData();
    } catch (err) {
      alert(err.message || 'Failed to delete course');
    }
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: formData.title,
        subtitle: formData.subtitle,
        category: formData.category,
        level: formData.level,
        price: parseFloat(formData.price),
        original_price: parseFloat(formData.original_price),
        is_bestseller: formData.is_bestseller,
        thumbnail: formData.thumbnail,
        duration: formData.duration,
        instructor_id: parseInt(formData.instructor_id),
        tags: formData.tagsStr.split(',').map(t => t.trim()).filter(Boolean),
        what_you_will_learn: formData.learnStr.split('\n').map(l => l.trim()).filter(Boolean),
        sections: formData.sections.map(sec => ({
          section_title: sec.section_title,
          duration: sec.duration || '30m',
          lessons: (sec.lessons || []).map(les => ({
            id: les.id,
            title: les.title,
            duration: les.duration || '10:00',
            video_url: les.video_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            is_preview: Boolean(les.is_preview)
          }))
        }))
      };

      if (editingCourse === 'new') {
        payload.id = formData.id;
        await api.createCourse(payload);
        setMsg('New course created successfully!');
      } else {
        await api.updateCourse(formData.id, payload);
        setMsg('Course updated successfully!');
      }

      setEditingCourse(null);
      loadAdminData();
    } catch (err) {
      alert(err.message || 'Error saving course');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          section_title: `Section ${prev.sections.length + 1}: New Section`,
          duration: '45m',
          lessons: [
            { id: `${prev.id}-sec${prev.sections.length + 1}-l1`, title: 'Lesson 1', duration: '12:00', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', is_preview: false }
          ]
        }
      ]
    }));
  };

  const handleAddLesson = (secIdx) => {
    setFormData(prev => {
      const newSecs = [...prev.sections];
      const sec = newSecs[secIdx];
      const lNum = (sec.lessons || []).length + 1;
      sec.lessons.push({
        id: `${prev.id}-s${secIdx+1}-l${lNum}`,
        title: `Lesson ${lNum}`,
        duration: '15:00',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        is_preview: false
      });
      return { ...prev, sections: newSecs };
    });
  };

  const handleCreateInstructor = async (e) => {
    e.preventDefault();
    try {
      await api.createInstructor(instructorData);
      setIsInstructorModalOpen(false);
      setInstructorData({ name: '', title: '', avatar: '', bio: '' });
      loadAdminData();
    } catch (err) {
      alert(err.message || 'Failed to create instructor');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <button onClick={onBack} className="btn btn-secondary" style={{ marginBottom: '0.75rem', gap: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Catalog
          </button>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Admin Management Console
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>Manage courses, curriculum sections, lessons, instructors, and monitor platform revenue.</p>
        </div>

        <button onClick={loadAdminData} className="btn btn-secondary" style={{ gap: '0.5rem' }}>
          <RefreshCw size={16} /> Refresh Data
        </button>
      </div>

      {/* Admin Stats Overview */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div style={{ padding: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={18} style={{ color: 'var(--primary)' }} /> Total Courses
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.total_courses}</div>
          </div>

          <div style={{ padding: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} style={{ color: '#10b981' }} /> Total Students
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.total_students}</div>
          </div>

          <div style={{ padding: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} style={{ color: '#f59e0b' }} /> Total Enrollments
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.total_enrollments}</div>
          </div>

          <div style={{ padding: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <DollarSign size={18} style={{ color: '#8b5cf6' }} /> Total Revenue
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>${stats.total_revenue}</div>
          </div>
        </div>
      )}

      {msg && (
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Check size={18} /> {msg}
        </div>
      )}

      {/* Course List & Management */}
      {!editingCourse ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>Courses CRUD Management</h2>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setIsInstructorModalOpen(true)} className="btn btn-secondary">
                <Users size={16} /> Add Instructor
              </button>
              <button onClick={handleOpenNewCourse} className="btn btn-primary">
                <Plus size={16} /> Create New Course
              </button>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem' }}>Course Title</th>
                  <th style={{ padding: '1rem' }}>Category</th>
                  <th style={{ padding: '1rem' }}>Price</th>
                  <th style={{ padding: '1rem' }}>Students</th>
                  <th style={{ padding: '1rem' }}>Rating</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {course.thumbnail && (
                          <img src={course.thumbnail} alt="" style={{ width: '48px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} />
                        )}
                        <div>
                          <div>{course.title}</div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {course.id}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{course.category}</td>
                    <td style={{ padding: '1rem', fontWeight: 700 }}>${course.price}</td>
                    <td style={{ padding: '1rem' }}>{course.students_count || 0}</td>
                    <td style={{ padding: '1rem' }}>⭐ {course.rating}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button onClick={() => handleOpenEditCourse(course)} className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem', marginRight: '0.5rem' }}>
                        <Edit2 size={14} /> Edit
                      </button>
                      <button onClick={() => handleDeleteCourse(course.id)} className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Course Editor Form */
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>
              {editingCourse === 'new' ? 'Create New Course' : `Edit Course: ${formData.title}`}
            </h2>
            <button onClick={() => setEditingCourse(null)} className="btn btn-secondary">Cancel</button>
          </div>

          <form onSubmit={handleSaveCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Course ID (Slug)</label>
                <input
                  type="text"
                  required
                  disabled={editingCourse !== 'new'}
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-body)', color: 'var(--text-color)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Course Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-body)', color: 'var(--text-color)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Subtitle / Description</label>
              <textarea
                rows={2}
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-body)', color: 'var(--text-color)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-body)', color: 'var(--text-color)' }}
                >
                  <option value="Development">Development</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Design">Design</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-body)', color: 'var(--text-color)' }}
                >
                  <option value="All Levels">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Price ($)</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-body)', color: 'var(--text-color)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Original Price ($)</label>
                <input
                  type="number"
                  value={formData.original_price}
                  onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-body)', color: 'var(--text-color)' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Thumbnail Image URL</label>
                <input
                  type="text"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-body)', color: 'var(--text-color)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Instructor</label>
                <select
                  value={formData.instructor_id}
                  onChange={(e) => setFormData({ ...formData, instructor_id: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-body)', color: 'var(--text-color)' }}
                >
                  {instructors.map(i => (
                    <option key={i.id} value={i.id}>{i.name} ({i.title})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tagsStr}
                onChange={(e) => setFormData({ ...formData, tagsStr: e.target.value })}
                placeholder="React, TypeScript, Node.js"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-body)', color: 'var(--text-color)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>What You Will Learn (one point per line)</label>
              <textarea
                rows={4}
                value={formData.learnStr}
                onChange={(e) => setFormData({ ...formData, learnStr: e.target.value })}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-body)', color: 'var(--text-color)' }}
              />
            </div>

            {/* Curriculum Sections Builder */}
            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Curriculum Sections & Video Lessons</h3>
                <button type="button" onClick={handleAddSection} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
                  <Plus size={14} /> Add Section
                </button>
              </div>

              {formData.sections.map((sec, secIdx) => (
                <div key={secIdx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <input
                      type="text"
                      placeholder="Section Title"
                      value={sec.section_title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData(prev => {
                          const newSecs = [...prev.sections];
                          newSecs[secIdx].section_title = val;
                          return { ...prev, sections: newSecs };
                        });
                      }}
                      style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-color)' }}
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g. 1h 20m)"
                      value={sec.duration}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData(prev => {
                          const newSecs = [...prev.sections];
                          newSecs[secIdx].duration = val;
                          return { ...prev, sections: newSecs };
                        });
                      }}
                      style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-color)' }}
                    />
                  </div>

                  {/* Lessons in section */}
                  <div style={{ marginLeft: '1rem', borderLeft: '2px solid var(--primary)', paddingLeft: '1rem' }}>
                    {(sec.lessons || []).map((les, lIdx) => (
                      <div key={lIdx} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 2fr auto', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <input
                          type="text"
                          placeholder="Lesson Title"
                          value={les.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(prev => {
                              const newSecs = [...prev.sections];
                              newSecs[secIdx].lessons[lIdx].title = val;
                              return { ...prev, sections: newSecs };
                            });
                          }}
                          style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-color)', fontSize: '0.85rem' }}
                        />
                        <input
                          type="text"
                          placeholder="Duration (12:45)"
                          value={les.duration}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(prev => {
                              const newSecs = [...prev.sections];
                              newSecs[secIdx].lessons[lIdx].duration = val;
                              return { ...prev, sections: newSecs };
                            });
                          }}
                          style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-color)', fontSize: '0.85rem' }}
                        />
                        <input
                          type="text"
                          placeholder="Video URL (.mp4)"
                          value={les.video_url}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(prev => {
                              const newSecs = [...prev.sections];
                              newSecs[secIdx].lessons[lIdx].video_url = val;
                              return { ...prev, sections: newSecs };
                            });
                          }}
                          style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-color)', fontSize: '0.85rem' }}
                        />
                        <label style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <input
                            type="checkbox"
                            checked={les.is_preview}
                            onChange={(e) => {
                              const val = e.target.checked;
                              setFormData(prev => {
                                const newSecs = [...prev.sections];
                                newSecs[secIdx].lessons[lIdx].is_preview = val;
                                return { ...prev, sections: newSecs };
                              });
                            }}
                          /> Preview
                        </label>
                      </div>
                    ))}
                    <button type="button" onClick={() => handleAddLesson(secIdx)} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      + Add Lesson to Section
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setEditingCourse(null)} className="btn btn-secondary">Cancel</button>
              <button type="submit" disabled={saving} className="btn btn-primary">
                {saving ? 'Saving Course...' : 'Save Course to Database'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Instructor Modal */}
      {isInstructorModalOpen && (
        <div className="modal-overlay" onClick={() => setIsInstructorModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: 0 }}>Add New Instructor</h3>
            <form onSubmit={handleCreateInstructor} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Instructor Name</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Jane Smith"
                  value={instructorData.name}
                  onChange={(e) => setInstructorData({ ...instructorData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-body)', color: 'var(--text-color)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Professional Title</label>
                <input
                  type="text"
                  placeholder="Principal Engineer at TechCorp"
                  value={instructorData.title}
                  onChange={(e) => setInstructorData({ ...instructorData, title: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-body)', color: 'var(--text-color)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Avatar Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={instructorData.avatar}
                  onChange={(e) => setInstructorData({ ...instructorData, avatar: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-body)', color: 'var(--text-color)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Biography</label>
                <textarea
                  rows={3}
                  value={instructorData.bio}
                  onChange={(e) => setInstructorData({ ...instructorData, bio: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-body)', color: 'var(--text-color)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsInstructorModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Instructor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
