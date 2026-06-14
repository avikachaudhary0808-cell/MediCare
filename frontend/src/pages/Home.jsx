import React from 'react';
import {
  Stethoscope,
  TrendingUp,
  Clock,
  Calendar,
  Shield,
  CheckCircle2,
  Activity,
  Heart,
  BriefcaseMedical,
  ArrowRight,
  Star,
  Users,
  Zap,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

/* ─── CSS Variable Tokens ─── */
const t = {
  primary: '#00f2c3',
  primaryHover: '#00c7a0',
  primaryGlow: 'rgba(0, 242, 195, 0.3)',
  secondary: '#00b4d8',
  textPrimary: '#f3f6f8',
  textSecondary: '#90a4ae',
  textMuted: '#546e7a',
  panelBg: 'rgba(18, 30, 36, 0.65)',
  panelBorder: 'rgba(255, 255, 255, 0.07)',
  fontHeading: "'Outfit', sans-serif",
  fontBody: "'Plus Jakarta Sans', sans-serif",
  radiusLg: '20px',
  radiusMd: '12px',
  bgFrom: '#0b1519',
  bgTo: '#060b0d',
};

/* ─── Reusable Style Objects ─── */
const glassPanel = {
  background: t.panelBg,
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: `1px solid ${t.panelBorder}`,
  borderRadius: t.radiusLg,
};

const sectionPadding = { padding: '80px 0' };

const sectionInner = {
  maxWidth: 1200,
  margin: '0 auto',
  padding: '0 24px',
};

const sectionTag = {
  display: 'inline-block',
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: '1.6px',
  textTransform: 'uppercase',
  color: t.primary,
  marginBottom: 12,
  fontFamily: t.fontBody,
};

const sectionTitle = {
  fontFamily: t.fontHeading,
  fontSize: 'clamp(28px, 4vw, 42px)',
  fontWeight: 700,
  color: t.textPrimary,
  marginBottom: 16,
  lineHeight: 1.2,
};

const sectionDesc = {
  fontFamily: t.fontBody,
  fontSize: 17,
  color: t.textSecondary,
  maxWidth: 600,
  lineHeight: 1.7,
};

/* ─── Data ─── */
const features = [
  {
    Icon: Stethoscope,
    title: 'AI Symptom Checker',
    desc: 'Describe your symptoms and our advanced AI instantly provides accurate insights and guidance for your health concerns.',
  },
  {
    Icon: TrendingUp,
    title: 'Health Dashboard',
    desc: 'Visualise your vitals, trends, and progress in a beautiful real-time dashboard tailored to your unique profile.',
  },
  {
    Icon: Clock,
    title: 'Medication Reminders',
    desc: 'Never miss a dose again. Smart reminders adapt to your schedule and keep your treatment plan on track.',
  },
  {
    Icon: Calendar,
    title: 'Doctor Consultation',
    desc: 'Seamlessly book video or in-clinic consultations with verified specialists in just a few taps.',
  },
];

const steps = [
  {
    num: 1,
    title: 'Create Your Account',
    desc: 'Sign up in seconds and set up your personal health profile with relevant medical history.',
  },
  {
    num: 2,
    title: 'AI Health Analysis',
    desc: 'Our AI analyses your symptoms and health data using clinically validated models for accurate results.',
  },
  {
    num: 3,
    title: 'Get Personalized Care',
    desc: 'Receive tailored recommendations and connect with verified doctors for professional guidance.',
  },
];

const benefits = [
  { Icon: Shield, title: '24/7 AI Assistant', desc: 'Round-the-clock intelligent health guidance whenever you need it.' },
  { Icon: Shield, title: 'Privacy & Security', desc: 'Bank-grade encryption keeps your medical data safe and private.' },
  { Icon: CheckCircle2, title: 'Verified Doctors', desc: 'Every specialist is credential-verified and board-certified.' },
  { Icon: Activity, title: 'Real-time Monitoring', desc: 'Continuous tracking of vitals with instant anomaly alerts.' },
  { Icon: Clock, title: 'Smart Reminders', desc: 'Context-aware notifications that adapt to your daily routine.' },
  { Icon: Calendar, title: 'Easy Booking', desc: 'Book, reschedule, or cancel appointments in one click.' },
];

const stats = [
  { value: '10K+', label: 'Users' },
  { value: '50+', label: 'Doctors' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9★', label: 'Rating' },
];

const quickLinks = ['Home', 'Features', 'About', 'Contact', 'Privacy Policy'];

/* ─── Keyframe CSS ─── */
const keyframes = `
@keyframes floatOrb {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-30px) scale(1.05); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(32px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 20px ${t.primaryGlow}; }
  50% { box-shadow: 0 0 40px ${t.primaryGlow}, 0 0 60px rgba(0, 180, 216, 0.15); }
}
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.home-cta-primary:hover {
  background: ${t.primaryHover} !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px ${t.primaryGlow} !important;
}
.home-cta-secondary:hover {
  background: rgba(255,255,255,0.08) !important;
  transform: translateY(-2px);
}
.home-feature-card:hover {
  transform: translateY(-6px);
  border-color: rgba(0, 242, 195, 0.25) !important;
  box-shadow: 0 12px 40px rgba(0, 242, 195, 0.08);
}
.home-benefit-card:hover {
  transform: translateY(-4px);
  border-color: rgba(0, 242, 195, 0.2) !important;
}
.home-step-card:hover {
  transform: translateY(-4px);
  border-color: rgba(0, 242, 195, 0.2) !important;
}
.home-footer-link:hover {
  color: ${t.primary} !important;
}
`;

/* ─── Component ─── */
export default function Home({ onGetStarted }) {
  return (
    <div
      style={{
        background: `linear-gradient(170deg, ${t.bgFrom} 0%, ${t.bgTo} 100%)`,
        minHeight: '100vh',
        color: t.textPrimary,
        fontFamily: t.fontBody,
        overflowX: 'hidden',
      }}
    >
      <style>{keyframes}</style>

      {/* ═══════════ HERO ═══════════ */}
      <section
        style={{
          position: 'relative',
          minHeight: '92vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Animated orbs */}
        {[
          { w: 420, top: '-8%', left: '-6%', bg: `radial-gradient(circle, ${t.primaryGlow}, transparent 70%)`, dur: '7s' },
          { w: 320, top: '55%', right: '-5%', bg: `radial-gradient(circle, rgba(0,180,216,0.2), transparent 70%)`, dur: '9s' },
          { w: 200, top: '30%', left: '40%', bg: `radial-gradient(circle, rgba(0,242,195,0.12), transparent 70%)`, dur: '11s' },
        ].map((orb, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: orb.w,
              height: orb.w,
              borderRadius: '50%',
              background: orb.bg,
              top: orb.top,
              left: orb.left,
              right: orb.right,
              animation: `floatOrb ${orb.dur} ease-in-out infinite`,
              pointerEvents: 'none',
              zIndex: 0,
              filter: 'blur(2px)',
            }}
          />
        ))}

        <div
          style={{
            ...sectionInner,
            display: 'flex',
            alignItems: 'center',
            gap: 60,
            position: 'relative',
            zIndex: 1,
            flexWrap: 'wrap',
          }}
        >
          {/* Left copy */}
          <div style={{ flex: '1 1 480px', animation: 'fadeInUp 0.8s ease-out both' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 16px',
                borderRadius: 999,
                background: 'rgba(0,242,195,0.08)',
                border: '1px solid rgba(0,242,195,0.18)',
                marginBottom: 28,
              }}
            >
              <Zap size={14} color={t.primary} />
              <span style={{ fontSize: 13, fontWeight: 600, color: t.primary, letterSpacing: 0.4 }}>
                AI-Powered Healthcare
              </span>
            </div>

            <h1
              style={{
                fontFamily: t.fontHeading,
                fontSize: 'clamp(36px, 5.2vw, 62px)',
                fontWeight: 800,
                lineHeight: 1.1,
                color: t.textPrimary,
                marginBottom: 24,
              }}
            >
              Your Intelligent{' '}
              <span
                style={{
                  background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Health &amp; Wellness
              </span>{' '}
              Companion
            </h1>

            <p
              style={{
                fontSize: 18,
                color: t.textSecondary,
                lineHeight: 1.75,
                maxWidth: 520,
                marginBottom: 40,
              }}
            >
              MediCare is an AI-powered healthcare platform that provides intelligent symptom analysis,
              personalised health insights, and seamless doctor consultations — all in one place.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button
                className="home-cta-primary"
                onClick={onGetStarted}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '15px 34px',
                  background: t.primary,
                  color: '#0b1519',
                  fontWeight: 700,
                  fontSize: 15,
                  border: 'none',
                  borderRadius: t.radiusMd,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: t.fontBody,
                  boxShadow: `0 4px 20px ${t.primaryGlow}`,
                }}
              >
                Get Started <ArrowRight size={18} />
              </button>
              <button
                className="home-cta-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '15px 34px',
                  background: 'rgba(255,255,255,0.04)',
                  color: t.textPrimary,
                  fontWeight: 600,
                  fontSize: 15,
                  border: `1px solid rgba(255,255,255,0.12)`,
                  borderRadius: t.radiusMd,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: t.fontBody,
                }}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right image */}
          <div
            style={{
              flex: '1 1 400px',
              display: 'flex',
              justifyContent: 'center',
              animation: 'fadeInUp 1s ease-out 0.2s both',
            }}
          >
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  inset: -20,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${t.primaryGlow}, transparent 70%)`,
                  animation: 'pulseGlow 4s ease-in-out infinite',
                  zIndex: 0,
                }}
              />
              <img
                src="/images/hero-medical.png"
                alt="MediCare Hero"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  maxWidth: '100%',
                  width: 480,
                  borderRadius: t.radiusLg,
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section style={sectionPadding}>
        <div style={sectionInner}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={sectionTag}>Features</span>
            <h2 style={{ ...sectionTitle, textAlign: 'center' }}>What We Offer</h2>
            <p style={{ ...sectionDesc, margin: '0 auto' }}>
              Comprehensive tools designed to empower your health journey with cutting-edge AI technology.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 24,
            }}
          >
            {features.map(({ Icon, title, desc }, i) => (
              <div
                key={title}
                className="home-feature-card"
                style={{
                  ...glassPanel,
                  padding: 32,
                  transition: 'all 0.35s ease',
                  animation: `fadeInUp 0.6s ease-out ${0.1 * i}s both`,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: t.radiusMd,
                    background: 'rgba(0,242,195,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                  }}
                >
                  <Icon size={26} color={t.primary} strokeWidth={1.8} />
                </div>
                <h3
                  style={{
                    fontFamily: t.fontHeading,
                    fontSize: 20,
                    fontWeight: 700,
                    color: t.textPrimary,
                    marginBottom: 10,
                  }}
                >
                  {title}
                </h3>
                <p style={{ fontSize: 14.5, color: t.textSecondary, lineHeight: 1.7, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section style={{ ...sectionPadding, background: 'rgba(0,0,0,0.15)' }}>
        <div style={sectionInner}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={sectionTag}>Process</span>
            <h2 style={{ ...sectionTitle, textAlign: 'center' }}>How It Works</h2>
            <p style={{ ...sectionDesc, margin: '0 auto' }}>
              Getting started with MediCare is simple — three easy steps to better health.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 60,
              flexWrap: 'wrap',
            }}
          >
            {/* Steps */}
            <div style={{ flex: '1 1 420px', display: 'flex', flexDirection: 'column', gap: 28 }}>
              {steps.map(({ num, title, desc }, i) => (
                <div
                  key={num}
                  className="home-step-card"
                  style={{
                    ...glassPanel,
                    padding: '28px 32px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 20,
                    transition: 'all 0.3s ease',
                    animation: `fadeInUp 0.6s ease-out ${0.15 * i}s both`,
                  }}
                >
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      minWidth: 50,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: t.fontHeading,
                      fontWeight: 800,
                      fontSize: 20,
                      color: '#0b1519',
                    }}
                  >
                    {num}
                  </div>
                  <div>
                    <h4
                      style={{
                        fontFamily: t.fontHeading,
                        fontSize: 18,
                        fontWeight: 700,
                        color: t.textPrimary,
                        marginBottom: 6,
                      }}
                    >
                      {title}
                    </h4>
                    <p style={{ fontSize: 14.5, color: t.textSecondary, lineHeight: 1.7, margin: 0 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Image */}
            <div
              style={{
                flex: '1 1 380px',
                display: 'flex',
                justifyContent: 'center',
                animation: 'fadeInUp 0.8s ease-out 0.3s both',
              }}
            >
              <img
                src="/images/how-it-works.png"
                alt="How it works"
                style={{
                  maxWidth: '100%',
                  width: 460,
                  borderRadius: t.radiusLg,
                  border: `1px solid ${t.panelBorder}`,
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ WHY CHOOSE MEDICARE ═══════════ */}
      <section style={sectionPadding}>
        <div style={sectionInner}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={sectionTag}>Benefits</span>
            <h2 style={{ ...sectionTitle, textAlign: 'center' }}>Why Choose MediCare</h2>
            <p style={{ ...sectionDesc, margin: '0 auto' }}>
              We combine clinical expertise with intelligent technology to deliver a healthcare experience you can trust.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 20,
            }}
          >
            {benefits.map(({ Icon, title, desc }, i) => (
              <div
                key={title}
                className="home-benefit-card"
                style={{
                  ...glassPanel,
                  padding: '26px 28px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 18,
                  transition: 'all 0.3s ease',
                  animation: `fadeInUp 0.5s ease-out ${0.08 * i}s both`,
                }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    minWidth: 46,
                    borderRadius: t.radiusMd,
                    background: 'rgba(0,242,195,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={22} color={t.primary} strokeWidth={1.8} />
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: t.fontHeading,
                      fontSize: 17,
                      fontWeight: 700,
                      color: t.textPrimary,
                      marginBottom: 4,
                    }}
                  >
                    {title}
                  </h4>
                  <p style={{ fontSize: 14, color: t.textSecondary, lineHeight: 1.65, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* ═══════════ ABOUT ═══════════ */}
      <section style={{ ...sectionPadding, background: 'rgba(0,0,0,0.15)' }}>
        <div style={sectionInner}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={sectionTag}>Our Story</span>
            <h2 style={{ ...sectionTitle, textAlign: 'center' }}>About MediCare</h2>
          </div>
 
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 60,
              flexWrap: 'wrap',
            }}
          >
            {/* Text */}
            <div style={{ flex: '1 1 440px', animation: 'fadeInUp 0.7s ease-out both' }}>
              <p
                style={{
                  fontSize: 17,
                  color: t.textSecondary,
                  lineHeight: 1.8,
                  marginBottom: 20,
                }}
              >
                MediCare was born from a simple belief: everyone deserves access to intelligent, compassionate healthcare
                — regardless of where they live or what they earn. Our team of physicians, AI researchers, and product
                designers work together to build a platform that bridges the gap between cutting-edge technology and
                human-centred care.
              </p>
              <p
                style={{
                  fontSize: 17,
                  color: t.textSecondary,
                  lineHeight: 1.8,
                  marginBottom: 40,
                }}
              >
                Powered by clinically validated machine-learning models and backed by a network of board-certified
                specialists, MediCare delivers accurate symptom analysis, personalised wellness plans, and effortless
                doctor bookings — all within a secure, privacy-first environment.
              </p>
 
              {/* Stats row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 16,
                }}
              >
                {stats.map(({ value, label }) => (
                  <div
                    key={label}
                    style={{
                      ...glassPanel,
                      padding: '20px 12px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: t.fontHeading,
                        fontSize: 24,
                        fontWeight: 800,
                        background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: 4,
                      }}
                    >
                      {value}
                    </div>
                    <div style={{ fontSize: 13, color: t.textMuted, fontWeight: 500 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
 
            {/* Image */}
            <div
              style={{
                flex: '1 1 380px',
                display: 'flex',
                justifyContent: 'center',
                animation: 'fadeInUp 0.8s ease-out 0.2s both',
              }}
            >
              <img
                src="/images/features-medical.png"
                alt="About MediCare"
                style={{
                  maxWidth: '100%',
                  width: 460,
                  borderRadius: t.radiusLg,
                  border: `1px solid ${t.panelBorder}`,
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        </div>
      </section>
 
      {/* ═══════════ FOOTER ═══════════ */}
      <footer
        style={{
          borderTop: `1px solid ${t.panelBorder}`,
          padding: '60px 0 32px',
          background: 'rgba(0,0,0,0.25)',
        }}
      >
        <div
          style={{
            ...sectionInner,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 40,
            marginBottom: 48,
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 16,
              }}
            >
              <BriefcaseMedical size={28} color={t.primary} strokeWidth={1.8} />
              <span
                style={{
                  fontFamily: t.fontHeading,
                  fontSize: 22,
                  fontWeight: 800,
                  color: t.textPrimary,
                }}
              >
                Medi
                <span style={{ color: t.primary }}>Care</span>
              </span>
            </div>
            <p style={{ fontSize: 14, color: t.textSecondary, lineHeight: 1.7, maxWidth: 260 }}>
              Your intelligent health companion — empowering better decisions through AI-driven insights and
              personalised care.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontFamily: t.fontHeading,
                fontSize: 16,
                fontWeight: 700,
                color: t.textPrimary,
                marginBottom: 18,
              }}
            >
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {quickLinks.map((link) => (
                <li key={link}>
                  <span
                    className="home-footer-link"
                    style={{
                      fontSize: 14,
                      color: t.textSecondary,
                      cursor: 'pointer',
                      transition: 'color 0.25s',
                    }}
                  >
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                fontFamily: t.fontHeading,
                fontSize: 16,
                fontWeight: 700,
                color: t.textPrimary,
                marginBottom: 18,
              }}
            >
              Contact Info
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { Icon: Mail, text: 'support@medicare.ai' },
                { Icon: Phone, text: '+1 (800) 123-4567' },
                { Icon: MapPin, text: 'San Francisco, CA' },
              ].map(({ Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={16} color={t.primary} />
                  <span style={{ fontSize: 14, color: t.textSecondary }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            ...sectionInner,
            borderTop: `1px solid ${t.panelBorder}`,
            paddingTop: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 13, color: t.textMuted }}>
            © {new Date().getFullYear()} MediCare. All rights reserved.
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, color: t.textMuted }}>Made with</span>
            <Heart size={14} color="#ef4444" fill="#ef4444" />
            <span style={{ fontSize: 13, color: t.textMuted }}>for better health</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
