import React from 'react';
import { Star, Clock, Users, Play, Sparkles, ArrowRight } from 'lucide-react';

export default function CourseCard({ course, onClick }) {
  const studentsCount = course.students_count || course.studentsCount || 0;
  const isBestseller = course.is_bestseller || course.isBestseller || false;
  const originalPrice = course.original_price || course.originalPrice;
  const instructor = course.instructor || { name: 'Expert Instructor', avatar: '' };

  return (
    <div 
      className="card" 
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      {/* Thumbnail Header */}
      <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to top, rgba(11,15,25,0.8) 0%, transparent 60%)'
        }} />

        {/* Badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
          {isBestseller && (
            <span className="badge badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={12} /> Bestseller
            </span>
          )}
          <span className="badge badge-pink">{course.category}</span>
        </div>

        {/* Play Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '12px', right: '12px',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          borderRadius: '50%',
          width: '38px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff'
        }}>
          <Play size={18} fill="#fff" />
        </div>
      </div>

      {/* Content Body */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {/* Metadata Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} color="var(--primary)" /> {course.duration || '20+ Hours'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Users size={14} color="#10b981" /> {studentsCount.toLocaleString()} students
            </span>
          </div>

          {/* Title */}
          <h3 
            style={{ 
              fontSize: '1.1rem', 
              fontWeight: 700, 
              marginBottom: '0.5rem', 
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {course.title}
          </h3>

          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5
          }}>
            {course.subtitle}
          </p>

          {/* Instructor & Rating */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {instructor.avatar && (
                <img 
                  src={instructor.avatar} 
                  alt={instructor.name}
                  style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }} 
                />
              )}
              <span style={{ fontWeight: 600, color: 'var(--text-color)' }}>{instructor.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'rgba(245, 158, 11, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <span style={{ fontWeight: 700, color: '#f59e0b' }}>{course.rating}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions & Price */}
        <div style={{ 
          borderTop: '1px solid var(--border-color)', 
          paddingTop: '1rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-color)' }}>
              ${course.price}
            </span>
            {originalPrice && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '6px' }}>
                ${originalPrice}
              </span>
            )}
          </div>

          <button 
            className="btn btn-primary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', gap: '0.4rem' }}
          >
            Explore <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
