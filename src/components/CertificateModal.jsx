import React, { useState, useEffect } from 'react';
import { X, Award, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CertificateModal({ courseId, onClose }) {
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchOrCreateCert = async () => {
      if (!courseId) return;
      setLoading(true);
      try {
        if (!isAuthenticated) {
          setError('Please sign in to generate and view certificates.');
          return;
        }
        const data = await api.generateCertificate(courseId);
        setCert(data);
      } catch (err) {
        setError(err.message || 'Could not fetch certificate');
      } finally {
        setLoading(false);
      }
    };
    fetchOrCreateCert();
  }, [courseId, isAuthenticated]);

  if (!courseId) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 1100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="card animate-fade-in" style={{
        width: '100%',
        maxWidth: '750px',
        background: '#0d121f',
        borderRadius: '24px',
        padding: '2.5rem',
        position: 'relative',
        border: '2px solid rgba(139, 92, 246, 0.4)',
        boxShadow: '0 0 50px rgba(99, 102, 241, 0.25)'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.5rem', right: '1.5rem',
            background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
          }}
        >
          <X size={22} />
        </button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <Sparkles size={36} className="animate-spin" style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
            <div>Issuing official certificate via backend API...</div>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: '#ef4444' }}>
            <p>{error}</p>
            <button onClick={onClose} className="btn btn-secondary">Close</button>
          </div>
        ) : (
          <div>
            {/* Certificate Frame Display */}
            <div style={{
              border: '10px solid rgba(255, 255, 255, 0.04)',
              borderRadius: '16px',
              padding: '2.5rem',
              textAlign: 'center',
              background: 'radial-gradient(circle at center, rgba(99,102,241,0.08) 0%, rgba(11,15,25,0) 70%)'
            }}>
              {/* Header Seal */}
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%',
                background: 'var(--accent-gradient)', margin: '0 auto 1.25rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 25px rgba(168,85,247,0.5)'
              }}>
                <Award size={32} color="#fff" />
              </div>

              <span style={{ fontSize: '0.85rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#a855f7', fontWeight: 800 }}>
                Official Certificate of Completion
              </span>

              <h2 style={{ fontSize: '1.8rem', marginTop: '0.75rem', marginBottom: '1.25rem' }}>
                DevMastery Academy & Platform
              </h2>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>This certifies that</p>
              <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0.5rem 0', background: 'linear-gradient(135deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {cert.student_name}
              </h1>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                has successfully completed all required modules, projects, and video curriculum for
              </p>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                "{cert.course_title}"
              </h3>

              {/* Footer Metadata */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '1.25rem',
                marginTop: '1.5rem',
                fontSize: '0.8rem',
                color: 'var(--text-muted)'
              }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>Platform Verification Engine</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981' }}>
                    <CheckCircle2 size={14} /> Database Verified
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>Code: {cert.certificate_code}</div>
                  <div>Issued: {new Date(cert.issued_at).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', gap: '1rem' }}>
              <button 
                onClick={() => window.print()}
                className="btn btn-primary" 
                style={{ padding: '0.75rem 1.5rem', gap: '0.5rem' }}
              >
                <Download size={18} /> Print / Save Certificate PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
