import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle2, ShieldCheck, Tag, Sparkles } from 'lucide-react';

export default function CheckoutModal({ course, onClose, onSuccessEnrollment }) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'DEV2026' || coupon.toUpperCase() === 'WELCOME') {
      setDiscount(20);
    } else {
      alert('Invalid Promo Code. Try "DEV2026" for $20 OFF!');
    }
  };

  const finalPrice = Math.max(0, course.price - discount);

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccessEnrollment(course);
      }, 1800);
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '560px',
        background: 'var(--bg-secondary)',
        borderRadius: '20px',
        padding: '2rem',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.5rem', right: '1.5rem',
            background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{
              width: '70px', height: '70px', borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)', color: '#10b981',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
              border: '2px solid #10b981'
            }}>
              <CheckCircle2 size={40} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Enrollment Confirmed!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Welcome to <strong>{course.title}</strong>. Opening course player...
            </p>
          </div>
        ) : (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={20} color="var(--accent-primary)" /> Secure Checkout
            </h2>

            {/* Course Summary Pill */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              padding: '1rem',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              marginBottom: '1.5rem'
            }}>
              <img src={course.thumbnail} alt={course.title} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.3 }}>{course.title}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instructor: {course.instructor.name}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>${finalPrice}</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input 
                  type="text" 
                  placeholder="Promo Code (Try 'DEV2026')"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-color)',
                    padding: '0.65rem 1rem 0.65rem 2.5rem',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                />
                <Tag size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              <button onClick={applyCoupon} className="btn-secondary" style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}>
                Apply
              </button>
            </div>

            {/* Payment Method Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>Payment Method</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: paymentMethod === 'card' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    background: paymentMethod === 'card' ? 'rgba(99,102,241,0.1)' : 'transparent',
                    color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  <CreditCard size={18} /> Card / Debit
                </button>
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: paymentMethod === 'paypal' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    background: paymentMethod === 'paypal' ? 'rgba(99,102,241,0.1)' : 'transparent',
                    color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  <Sparkles size={18} /> PayPal / UPI
                </button>
              </div>
            </div>

            {/* Card Mock Form */}
            <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <input 
                  type="text" 
                  placeholder="Cardholder Name" 
                  defaultValue="Alex Johnson" 
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-color)',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    color: '#fff'
                  }}
                />
              </div>

              <div>
                <input 
                  type="text" 
                  placeholder="Card Number" 
                  defaultValue="4532 •••• •••• 8892" 
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-color)',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    color: '#fff'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input 
                  type="text" 
                  placeholder="MM/YY" 
                  defaultValue="12/28" 
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-color)',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    color: '#fff'
                  }}
                />
                <input 
                  type="password" 
                  placeholder="CVC" 
                  defaultValue="888" 
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-color)',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    color: '#fff'
                  }}
                />
              </div>

              <button 
                type="submit" 
                disabled={isProcessing}
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem' }}
              >
                {isProcessing ? "Processing Security Payment..." : `Pay $${finalPrice} & Access Course`}
              </button>

              <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                <ShieldCheck size={14} color="#10b981" /> 256-Bit SSL Encrypted Instant Access
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
