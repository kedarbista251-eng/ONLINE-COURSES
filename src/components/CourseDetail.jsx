import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle, 
  Star, 
  Clock, 
  Award, 
  Globe, 
  FileText, 
  MessageSquare, 
  ShieldCheck, 
  Share2, 
  Lock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowLeft,
  Send
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CourseDetail({ courseId, onBack, onOpenPlayer, onOpenAuth }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [openSection, setOpenSection] = useState(0);
  const [purchasing, setPurchasing] = useState(false);

  // Review Form
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { isAuthenticated } = useAuth();

  const loadDetail = async () => {
    setLoading(true);
    try {
      const data = await api.getCourseDetail(courseId);
      setCourse(data);

      if (isAuthenticated) {
        const check = await api.checkEnrollment(courseId).catch(() => ({ is_enrolled: false }));
        setIsEnrolled(check.is_enrolled);
      }
    } catch (err) {
      console.error("Error loading course details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [courseId, isAuthenticated]);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const handleEnrollOrCheckout = async () => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }

    setPurchasing(true);
    try {
      const res = await api.createCheckoutSession(courseId);
      if (res.checkout_url) {
        if (res.is_mock) {
          setIsEnrolled(true);
          alert('🎉 Payment successful! You are now enrolled in this course.');
        } else {
          window.location.href = res.checkout_url;
        }
      }
    } catch (err) {
      alert(err.message || 'Checkout failed');
    } finally {
      setPurchasing(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmittingReview(true);
    try {
      await api.addReview(courseId, newRating, newComment);
      setNewComment('');
      loadDetail();
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading || !course) {
    return (
      <div style={{ maxWidth: '1280px', margin: '4rem auto', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Sparkles size={32} className="animate-spin" style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
        <div>Loading course details from backend API...</div>
      </div>
    );
  }

  const curriculum = course.curriculum || [];
  const reviews = course.reviews || [];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Back Button */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1.5rem 0' }}>
        <button 
          onClick={onBack}
          className="btn-secondary"
          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} /> Back to Courses
        </button>
      </div>

      {/* Hero Banner Section */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.08) 0%, rgba(11, 15, 25, 0) 100%)',
        borderBottom: '1px solid var(--border-color)',
        padding: '2.5rem 1.5rem 3.5rem',
        marginTop: '1rem'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '3rem',
          alignItems: 'start'
        }}>
          {/* Main Info Header */}
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
              <span className="badge badge-purple">{course.category}</span>
              <span className="badge badge-emerald">{course.level}</span>
              {course.updated_date && <span className="badge badge-pink">Updated {course.updated_date}</span>}
            </div>

            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
              {course.title}
            </h1>

            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              {course.subtitle}
            </p>

            {/* Ratings & Enrolled Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '1rem' }}>{course.rating}</span>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <span style={{ color: 'var(--text-muted)' }}>({course.reviews_count} ratings)</span>
              </div>

              <div style={{ color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-main)' }}>{(course.students_count || 0).toLocaleString()}</strong> students enrolled
              </div>
            </div>

            {/* Instructor */}
            {course.instructor && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {course.instructor.avatar && (
                  <img 
                    src={course.instructor.avatar} 
                    alt={course.instructor.name} 
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                  />
                )}
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Created by</span>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{course.instructor.name}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{course.instructor.title}</span>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Purchase / Access Card */}
          <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.25rem', aspectRatio: '16/9' }}>
              <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button 
                onClick={() => onOpenPlayer(curriculum[0]?.lessons[0]?.id || 'l1')}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Play size={24} fill="#fff" color="#fff" style={{ marginLeft: '4px' }} />
                </div>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>${course.price}</span>
              {course.original_price && (
                <span style={{ fontSize: '1.1rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>${course.original_price}</span>
              )}
            </div>

            {isEnrolled ? (
              <button 
                onClick={() => onOpenPlayer(curriculum[0]?.lessons[0]?.id || 'l1')}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', justifyContent: 'center', marginBottom: '1rem' }}
              >
                <Play size={18} fill="#fff" /> Continue Learning
              </button>
            ) : (
              <button 
                onClick={handleEnrollOrCheckout}
                disabled={purchasing}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', justifyContent: 'center', marginBottom: '1rem' }}
              >
                <ShieldCheck size={18} /> {purchasing ? 'Redirecting to Stripe...' : 'Enroll Now (Stripe Checkout)'}
              </button>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="var(--primary)" /> {course.duration || '40+ Hours'} on-demand video
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={16} color="var(--primary)" /> {course.lessons_count || 50} HD lessons
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={16} color="var(--primary)" /> Certificate of completion included
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Content */}
      <div style={{ maxWidth: '1280px', margin: '2rem auto 0', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
          {['overview', 'curriculum', 'reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.75rem 1.25rem',
                fontSize: '1rem',
                fontWeight: 600,
                color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: activeTab === tab ? '2px solid var(--primary)' : 'none',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: 0, marginBottom: '1rem' }}>What You Will Learn</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {(course.what_you_will_learn || []).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <CheckCircle size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {course.instructor && (
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: 0, marginBottom: '1rem' }}>About the Instructor</h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  {course.instructor.avatar && (
                    <img src={course.instructor.avatar} alt="" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
                  )}
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{course.instructor.name}</h4>
                    <div style={{ fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{course.instructor.title}</div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{course.instructor.bio}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Curriculum */}
        {activeTab === 'curriculum' && (
          <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {curriculum.map((section, secIdx) => (
              <div key={secIdx} className="card" style={{ overflow: 'hidden' }}>
                <div 
                  onClick={() => toggleSection(secIdx)}
                  style={{
                    padding: '1rem 1.25rem',
                    background: 'rgba(255,255,255,0.02)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  <div>
                    {section.section_title}
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '1rem' }}>
                      ({section.lessons?.length || 0} lessons • {section.duration})
                    </span>
                  </div>
                  {openSection === secIdx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>

                {openSection === secIdx && (
                  <div style={{ padding: '0.5rem 0' }}>
                    {(section.lessons || []).map((lesson) => (
                      <div 
                        key={lesson.id}
                        onClick={() => (isEnrolled || lesson.is_preview) && onOpenPlayer(lesson.id)}
                        style={{
                          padding: '0.75rem 1.25rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderTop: '1px solid var(--border-color)',
                          cursor: (isEnrolled || lesson.is_preview) ? 'pointer' : 'default',
                          opacity: (isEnrolled || lesson.is_preview) ? 1 : 0.6
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                          <Play size={16} color="var(--primary)" />
                          <span>{lesson.title}</span>
                          {lesson.is_preview && <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>Preview</span>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <span>{lesson.duration}</span>
                          {!isEnrolled && !lesson.is_preview && <Lock size={14} />}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab: Reviews */}
        {activeTab === 'reviews' && (
          <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Submit Review */}
            {isAuthenticated && (
              <form onSubmit={handleSubmitReview} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h4 style={{ margin: 0 }}>Leave a Course Review</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem' }}>Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      fill={star <= newRating ? '#f59e0b' : 'none'}
                      color="#f59e0b"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setNewRating(star)}
                    />
                  ))}
                </div>
                <textarea
                  rows={3}
                  placeholder="Write your feedback..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-body)', color: 'var(--text-color)' }}
                />
                <button type="submit" disabled={submittingReview} className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '0.4rem 1rem', fontSize: '0.85rem', gap: '0.4rem' }}>
                  <Send size={14} /> Submit Review
                </button>
              </form>
            )}

            {/* Existing Reviews */}
            {reviews.map((rev) => (
              <div key={rev.id} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{rev.user_name}</div>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < rev.rating ? '#f59e0b' : 'none'} color="#f59e0b" />
                    ))}
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
