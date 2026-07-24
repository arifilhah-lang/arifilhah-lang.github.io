import React, { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================
// 🔗 RAILWAY DEMO LINK — paste your Railway URL below.
// Leave as "#" until your Railway deployment is live.
// Every "Try Live Demo" button on the site reads from here,
// so you only need to change this one line.
// ============================================================
const RAILWAY_DEMO_URL = "https://web-production-8e1c2.up.railway.app/";

// ============================================================
// 🎬 VIDEO — paste EITHER a full YouTube link OR a full Google
// Drive share link below (whichever you're using). Bare IDs
// also still work. Leave the other one as "" (empty).
//
// YouTube — any of these formats work:
//   https://www.youtube.com/watch?v=XXXXXXXXXXX
//   https://youtu.be/XXXXXXXXXXX
//   https://www.youtube.com/shorts/XXXXXXXXXXX
//
// Google Drive — any of these formats work:
//   https://drive.google.com/file/d/XXXXXXXXXXX/view?usp=sharing
//   https://drive.google.com/open?id=XXXXXXXXXXX
//
// VIDEO_ASPECT_RATIO — set this to match your actual video shape
// so there are no black bars. Common values:
//   "16:9"  → normal landscape video (most common, YouTube default)
//   "9:16"  → vertical/reels-style video (phone-recorded, TikTok-style)
//   "1:1"   → square video
//   "4:3"   → old-style landscape
// ============================================================
const YOUTUBE_INPUT = "";
const GOOGLE_DRIVE_INPUT = "https://drive.google.com/file/d/11zuHAMHcCSnaMi5CcCzcAsHjAIvacnq2/view";
const VIDEO_ASPECT_RATIO = "16:9";

const extractYoutubeId = (input) => {
  if (!input) return "";
  const match = input.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : (/^[a-zA-Z0-9_-]{11}$/.test(input.trim()) ? input.trim() : "");
};

const extractDriveId = (input) => {
  if (!input) return "";
  const match = input.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]{20,})/);
  return match ? match[1] : (/^[a-zA-Z0-9_-]{20,}$/.test(input.trim()) ? input.trim() : "");
};

const getVideoEmbedUrl = () => {
  const ytId = extractYoutubeId(YOUTUBE_INPUT);
  if (ytId) return `https://www.youtube.com/embed/${ytId}?playsinline=1&rel=0&modestbranding=1`;
  const driveId = extractDriveId(GOOGLE_DRIVE_INPUT);
  return `https://drive.google.com/file/d/${driveId}/preview`;
};

const getVideoAspectPadding = () => {
  const ratios = { "16:9": "56.25%", "9:16": "177.78%", "1:1": "100%", "4:3": "75%" };
  return ratios[VIDEO_ASPECT_RATIO] || "56.25%";
};

const isLiveDemoReady = RAILWAY_DEMO_URL && RAILWAY_DEMO_URL !== "#";

// Geometric node structure matching company logo
const BrandLogo = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="24" fill="#0077B6" />
    <g stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Hexagon Perimeter */}
      <polygon points="50,20 76,35 76,65 50,80 24,65 24,35" />
      {/* Radii */}
      <line x1="50" y1="50" x2="50" y2="20" />
      <line x1="50" y1="50" x2="76" y2="35" />
      <line x1="50" y1="50" x2="76" y2="65" />
      <line x1="50" y1="50" x2="50" y2="80" />
      <line x1="50" y1="50" x2="24" y2="65" />
      <line x1="50" y1="50" x2="24" y2="35" />
      {/* Hexagram (Star of David connections) */}
      <polygon points="50,20 76,65 24,65" />
      <polygon points="50,80 76,35 24,35" />
    </g>
    <g fill="white">
      <circle cx="50" cy="50" r="4.5" />
      <circle cx="50" cy="20" r="4.5" />
      <circle cx="76" cy="35" r="4.5" />
      <circle cx="76" cy="65" r="4.5" />
      <circle cx="50" cy="80" r="4.5" />
      <circle cx="24" cy="65" r="4.5" />
      <circle cx="24" cy="35" r="4.5" />
    </g>
  </svg>
);

const MenuIcon = ({ className = "w-6 h-6" }) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const CloseIcon = ({ className = "w-6 h-6" }) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const PlayIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);

// Feature Icons
const IconSales = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);
const IconStock = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);
const IconInvoice = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);
const IconCRM = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Home', 'Features', 'Pricing', 'FAQ', 'Contact'];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/70 backdrop-blur-xl border-b border-white/40 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.03)]' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer">
            <BrandLogo className="w-9 h-9" />
            <span className="font-extrabold text-xl tracking-tight text-brand-900">Projukti X</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-8 bg-white/40 backdrop-blur-md px-8 py-2.5 rounded-full border border-white/60 shadow-sm">
            {navLinks.map((link) => (
              <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-sm font-semibold text-slate-700 hover:text-brand-700 transition-colors">
                {link}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={isLiveDemoReady ? RAILWAY_DEMO_URL : "#"}
              target={isLiveDemoReady ? "_blank" : undefined}
              rel={isLiveDemoReady ? "noopener noreferrer" : undefined}
              onClick={(e) => { if (!isLiveDemoReady) { e.preventDefault(); alert("Live demo link will be available soon. Please use 'Register for Free Demo' for now."); } }}
              aria-disabled={!isLiveDemoReady}
              className={`px-6 py-2.5 rounded-full text-sm font-bold border-2 transition-all transform hover:-translate-y-0.5 ${
                isLiveDemoReady
                  ? "text-brand-700 border-brand-700 bg-white hover:bg-brand-700 hover:text-white shadow-sm"
                  : "text-brand-700/60 border-brand-700/40 bg-white/60 cursor-not-allowed"
              }`}
            >
              Try Live Demo
            </a>
            <a href="#demo" className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-brand-700 to-brand-700 hover:from-brand-700 hover:to-brand-700 transition-all shadow-lg shadow-brand-500/25 transform hover:-translate-y-0.5">
              Free Demo
            </a>
          </div>

          {/* Mobile CTA — compact, no menu icon needed */}
          <div className="md:hidden flex items-center gap-1.5">
            <a
              href={isLiveDemoReady ? RAILWAY_DEMO_URL : "#"}
              target={isLiveDemoReady ? "_blank" : undefined}
              rel={isLiveDemoReady ? "noopener noreferrer" : undefined}
              onClick={(e) => { if (!isLiveDemoReady) { e.preventDefault(); alert("Live demo link will be available soon. Please use 'Register for Free Demo' for now."); } }}
              aria-disabled={!isLiveDemoReady}
              className={`px-3 py-2 rounded-full text-xs font-bold border-2 whitespace-nowrap transition-all ${
                isLiveDemoReady
                  ? "text-brand-700 border-brand-700 bg-white"
                  : "text-brand-700/60 border-brand-700/40 bg-white/60 cursor-not-allowed"
              }`}
            >
              Live Demo
            </a>
            <a href="#demo" className="px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-brand-700 to-brand-700 shadow-md whitespace-nowrap">
              Free Demo
            </a>
          </div>
        </div>

        {/* Mobile Quick Nav — small always-visible buttons instead of a hamburger/3-dot menu */}
        <div className="md:hidden flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(' ', '-')}`}
              className="shrink-0 px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-white/70 backdrop-blur-md border border-white/70 shadow-sm hover:bg-brand-700 hover:text-white hover:border-brand-700 transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <div id="home" className="relative pt-24 pb-4 md:pt-32 md:pb-8 min-h-[calc(100vh-60px)] md:min-h-screen overflow-hidden flex flex-col justify-center">
      {/* Soft, airy fluid gradient background simulating the light theme vibe */}
      <div className="absolute inset-0 bg-transparent -z-20"></div>

      {/* Animated fluid blobs for the premium glassmorphic feel */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-100/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob -z-10 translate-x-1/3 -translate-y-1/4"></div>
      <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-blue-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000 -z-10 -translate-x-1/3"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-100/60 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob animation-delay-4000 -z-10"></div>

      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 lg:gap-24">
          {/* Left: Text Content */}
          <div className="w-full md:w-[45%] text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-sm mb-8 lg:mb-10 hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-default">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
              <span className="text-xs font-bold text-brand-900 tracking-wide uppercase font-bitcount">Projukti X 1.0</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-900 tracking-tight leading-[1.15] mb-8 lg:mb-10 font-bitcount animate-[fade-in-up_1s_ease-out_both]">
              Streamline Your <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-700 via-brand-700 to-brand-700 bg-300% animate-gradient font-bitcount">
                Business Operations
              </span>
            </h1>
            <h2 className="inline-flex items-center gap-2 text-lg sm:text-xl font-extrabold mb-8 lg:mb-10 px-4 py-2 rounded-2xl bg-gradient-to-r from-brand-700/10 via-brand-500/10 to-brand-700/10 border border-brand-500/20 shadow-sm animate-[fade-in-up_1s_ease-out_0.2s_both] font-bitcount">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-700 via-brand-500 to-brand-700 bg-300% animate-gradient">
                Feel your business's own personal software.
              </span>
            </h2>
            <p className="text-base md:text-lg text-slate-600 mb-2 font-medium leading-[1.8] max-w-lg mx-auto lg:mx-0 animate-[fade-in-up_1s_ease-out_0.4s_both] font-bitcount">
              The ultimate business management and ERP software designed to help owners seamlessly manage sales, stock, invoices, and customer history in one place.
            </p>
          </div>

          {/* Right: Screenshot Card */}
          <div className="w-full md:w-[55%] lg:w-[58%] flex justify-end animate-[fade-in-up_1s_ease-out_0.6s_both] mt-10 md:mt-0 relative">
            {/* Dynamic Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-96 h-64 md:h-96 bg-brand-500/20 rounded-full blur-[80px] animate-pulse pointer-events-none"></div>
            <div className="absolute top-1/4 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-[60px] animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite] pointer-events-none delay-700"></div>
            {/* Floating Top Left Amber Card */}
            <div className="absolute top-[5%] left-[5%] md:left-[-5%] bg-[#FF9800] rounded-xl shadow-[0_15px_30px_rgba(255,152,0,0.3)] -rotate-[8deg] flex items-center gap-3 px-4 py-3 animate-float opacity-90 hover:scale-105 transition-transform cursor-default z-10" style={{ animationDelay: '0.9s' }}>
              <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center text-white text-lg">👥</div>
              <div className="flex flex-col">
                <div className="text-white font-bold text-sm leading-tight">CRM Database</div>
                <div className="text-orange-100 text-[10px]">Client history</div>
              </div>
            </div>

            {/* Floating Middle Left Green Card */}
            <div className="absolute top-[45%] left-[5%] md:left-[-10%] bg-[#10B981] rounded-xl shadow-[0_15px_30px_rgba(16,185,129,0.3)] rotate-[6deg] flex items-center gap-3 px-4 py-3 animate-float opacity-95 hover:scale-105 transition-transform cursor-default z-20" style={{ animationDelay: '0.4s' }}>
              <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center text-white text-lg">🚚</div>
              <div className="flex flex-col">
                <div className="text-white font-bold text-sm leading-tight">Delivery Sync</div>
                <div className="text-green-100 text-[10px]">Courier integration</div>
              </div>
            </div>

            {/* Floating Top Right Blue Card */}
            <div className="absolute top-[0%] right-[5%] md:right-[0%] bg-[#5473FF] rounded-xl shadow-[0_15px_30px_rgba(84,115,255,0.4)] rotate-[15deg] flex items-center gap-3 px-4 py-3 animate-float opacity-95 hover:scale-105 transition-transform cursor-default z-0" style={{ animationDelay: '0.2s' }}>
              <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center text-white text-lg">🚀</div>
              <div className="flex flex-col">
                <div className="text-white font-bold text-sm leading-tight">Sales Tracking</div>
                <div className="text-blue-100 text-[10px]">Real-time analytics</div>
              </div>
            </div>

            {/* Floating Bottom Left Red Card */}
            <div className="absolute bottom-[10%] left-[0%] md:left-[0%] bg-[#F44336] rounded-xl shadow-[0_15px_30px_rgba(244,67,54,0.4)] -rotate-[12deg] flex items-center gap-3 px-4 py-3 animate-float opacity-95 hover:scale-105 transition-transform cursor-default z-20" style={{ animationDelay: '0.5s' }}>
              <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center text-white text-lg">📦</div>
              <div className="flex flex-col">
                <div className="text-white font-bold text-sm leading-tight">Stock Control</div>
                <div className="text-red-100 text-[10px]">Live inventory</div>
              </div>
            </div>

            {/* Floating Top Center Teal Card */}
            <div className="absolute top-[-10%] md:top-[-12%] left-[40%] md:left-[50%] bg-[#00BCD4] rounded-xl shadow-[0_15px_30px_rgba(0,188,212,0.3)] rotate-[4deg] flex items-center gap-3 px-4 py-3 animate-float opacity-90 hover:scale-105 transition-transform cursor-default z-0" style={{ animationDelay: '1.2s' }}>
              <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center text-white text-lg">☁️</div>
              <div className="flex flex-col">
                <div className="text-white font-bold text-sm leading-tight">Cloud Backup</div>
                <div className="text-cyan-100 text-[10px]">Data safety</div>
              </div>
            </div>

            <img
              src="/hero-mockup-bg-removed.png"
              alt="Projukti X App Mockup"
              loading="lazy"
              className="relative z-10 w-full h-auto object-contain drop-shadow-[0_30px_60px_rgba(0,119,182,0.3)] animate-float hover:scale-[1.02] transition-transform duration-500"
            />

            {/* Floating Middle Right Purple Card */}
            <div className="absolute top-[40%] md:top-[45%] right-[5%] md:right-[-5%] bg-[#9C27B0] rounded-xl shadow-[0_15px_30px_rgba(156,39,176,0.3)] -rotate-[5deg] flex items-center gap-3 px-4 py-3 animate-float opacity-95 hover:scale-105 transition-transform cursor-default z-20" style={{ animationDelay: '0.7s' }}>
              <div className="w-8 h-8 bg-white/20 rounded-md flex items-center justify-center text-white text-lg">📊</div>
              <div className="flex flex-col">
                <div className="text-white font-bold text-sm leading-tight">Custom Reports</div>
                <div className="text-purple-100 text-[10px]">Export analytics</div>
              </div>
            </div>

            {/* Floating Bottom Right White Card */}
            <div className="absolute bottom-[-5%] md:bottom-[-2%] right-[10%] md:right-[5%] bg-white rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] -rotate-6 flex items-center gap-3 px-4 py-3 animate-float hover:scale-105 transition-transform cursor-default z-20" style={{ animationDelay: '0.8s' }}>
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-lg">🧾</div>
              <div className="flex flex-col">
                <div className="text-slate-800 font-bold text-sm leading-tight">Smart Invoices</div>
                <div className="text-slate-500 text-[10px]">Automated billing</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 🔘 CTA BUTTONS — shown after the screenshot banner, before the promo video
// ============================================================
const CtaButtons = () => {
  return (
    <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-10 lg:pb-16">
      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
        <a href="#demo" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-center text-base font-bold text-white bg-brand-900 hover:bg-brand-900/90 shadow-[0_8px_20px_rgba(15,23,42,0.2)] transition-all transform hover:-translate-y-1 active:scale-95">
          Register for Free Demo
        </a>
        <a
          href={isLiveDemoReady ? RAILWAY_DEMO_URL : "#"}
          target={isLiveDemoReady ? "_blank" : undefined}
          rel={isLiveDemoReady ? "noopener noreferrer" : undefined}
          onClick={(e) => { if (!isLiveDemoReady) { e.preventDefault(); alert("Live demo link will be available soon. Please use 'Register for Free Demo' for now."); } }}
          className={`w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 rounded-full text-center text-base font-bold border-2 transition-all transform hover:-translate-y-1 ${
            isLiveDemoReady
              ? "text-brand-900 border-brand-900 bg-white/80 backdrop-blur hover:bg-brand-900 hover:text-white"
              : "text-brand-900/60 border-brand-900/40 bg-white/60 backdrop-blur cursor-not-allowed"
          }`}
        >
          Try Live Demo
        </a>
      </div>
    </div>
  );
};

// ============================================================
// 🎬 PROMO VIDEO — shown after the CTA buttons
const ScreenshotCarousel = () => {
  // Keep file extensions exactly as your files are (.jpg / .png / .webp)
  const screenshots = [
    { src: "/screenshots/screenshot-1.png", alt: "Projukti X - Dashboard & Analytics" },
    { src: "/screenshots/screenshot-2.png", alt: "Projukti X - Billing & Sales" },
    { src: "/screenshots/screenshot-4.png", alt: "Projukti X - Delivery System" },
    { src: "/screenshots/screenshot-5.png", alt: "Projukti X - Customer Database" },
    { src: "/screenshots/screenshot-6.png", alt: "Projukti X - Finance & Accounts" },
    { src: "/screenshots/screenshot-8.png", alt: "Projukti X - Activity & Reports" },
    { src: "/screenshots/screenshot-9.png", alt: "Projukti X - Expense Entry" },
    { src: "/screenshots/screenshot-10.png", alt: "Projukti X - Security Logs" },
    { src: "/screenshots/screenshot-11.png", alt: "Projukti X - Role Management" },
    { src: "/screenshots/screenshot-12.png", alt: "Projukti X - Delivery History" },
    { src: "/screenshots/screenshot-13.png", alt: "Projukti X - Adv Courier" },
  ];

  const [index, setIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  // Auto-advance every 4s, but pause on hover/touch
  React.useEffect(() => {
    if (screenshots.length <= 1 || isPaused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % screenshots.length);
    }, 4000);
    return () => clearInterval(t);
  }, [isPaused, screenshots.length]);

  // Drag/swipe support - works for both touch (finger) and mouse (click-drag)
  const dragStart = React.useRef(0);
  const isDragging = React.useRef(false);

  const handleDragStart = (clientX) => {
    dragStart.current = clientX;
    isDragging.current = true;
    setIsPaused(true);
  };
  const handleDragEnd = (clientX) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const dx = clientX - dragStart.current;
    if (Math.abs(dx) > 40) {
      setIndex((i) => (dx < 0 ? (i + 1) % screenshots.length : (i - 1 + screenshots.length) % screenshots.length));
    }
    setIsPaused(false);
  };

  const handleTouchStart = (e) => handleDragStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => handleDragEnd(e.changedTouches[0].clientX);
  const handleMouseDown = (e) => { e.preventDefault(); handleDragStart(e.clientX); };
  const handleMouseUp = (e) => handleDragEnd(e.clientX);

  return (
    <div
      id="screenshots"
      className="py-16 lg:py-24 bg-transparent relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={(e) => { setIsPaused(false); if (isDragging.current) handleDragEnd(e.clientX); }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-900 mb-3 tracking-tight font-bitcount">
            See Projukti X in Action
          </h2>
          <p className="text-slate-500 text-base md:text-lg font-medium">
            Take a quick tour of the modules - dashboard, billing, stock and more.
          </p>
        </div>

        {/* Slider viewport */}
        <div className="relative w-full max-w-5xl mx-auto select-none cursor-grab active:cursor-grabbing">
          <div className="overflow-hidden rounded-2xl sm:rounded-[2rem] border border-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] bg-white/60 backdrop-blur">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {screenshots.map((s, i) => (
                <div key={i} className="w-full flex-shrink-0 px-3 sm:px-6 py-4 sm:py-8">
                  <div className="relative w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-100" style={{ paddingBottom: '56.25%' }}>
                    <img
                      src={s.src}
                      alt={s.alt}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        // Hide broken image and show friendly placeholder
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement.classList.add('flex', 'items-center', 'justify-center');
                        const ph = document.createElement('div');
                        ph.className = 'absolute inset-0 flex items-center justify-center text-slate-400 text-sm font-medium p-6 text-center';
                        ph.textContent = `Screenshot not found: ${s.src}`;
                        e.currentTarget.parentElement.appendChild(ph);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot indicators */}
          {screenshots.length > 1 && (
            <div className="flex justify-center gap-2 mt-5">
              {screenshots.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${i === index ? 'w-8 bg-brand-700' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const Features = () => {
  const features = [
    { iconBg: "bg-blue-100", iconDot: "bg-blue-500", title: "Dashboard & Analytics", desc: "Real-time overview of your business performance and daily insights." },
    { iconBg: "bg-emerald-100", iconDot: "bg-emerald-500", title: "Billing & Sales", desc: "Process payments and generate retail or wholesale bills instantly." },
    { iconBg: "bg-amber-100", iconDot: "bg-amber-500", title: "Product & Stock", desc: "Manage your complete inventory, stock levels, and product catalogs." },
    { iconBg: "bg-red-100", iconDot: "bg-red-500", title: "Delivery System", desc: "Track shipping, manage couriers, and monitor pending deliveries." },
    { iconBg: "bg-cyan-100", iconDot: "bg-cyan-500", title: "Customer Database", desc: "Maintain detailed customer profiles, histories, and outstanding dues." },
    { iconBg: "bg-indigo-100", iconDot: "bg-indigo-500", title: "Finance & Accounts", desc: "Track daily income, capital, and generate financial profit/loss reports." },
    { iconBg: "bg-purple-100", iconDot: "bg-purple-500", title: "Supplier & Bank", desc: "Manage supplier accounts, bank details, and outgoing payments." },
    { iconBg: "bg-pink-100", iconDot: "bg-pink-500", title: "Activity & Reports", desc: "Detailed audit logs, security reports, and staff activity tracking." },
    { iconBg: "bg-orange-100", iconDot: "bg-orange-500", title: "Expense Entry", desc: "Record daily office expenses and monitor your cash flow easily." }
  ];

  return (
    <div id="features" className="py-24 relative overflow-hidden bg-transparent">
      {/* Subtle glass background details */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      
      <div className="max-w-[100vw] mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-900 mb-2 tracking-tight font-bitcount">Comprehensive Modules</h2>
          <p className="text-brand-700 text-4xl font-cookie mb-4">
            Everything you need in one place
          </p>
          <p className="text-slate-500 text-lg">
            Our ERP system comes packed with all the essential modules to run your entire operation seamlessly.
          </p>
        </div>

        {/* Looping Marquee */}
        <div className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden flex flex-col gap-6">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused] py-4">
            {[...features, ...features].map((feature, index) => (
              <div key={index} className="w-[280px] sm:w-[320px] mx-3 sm:mx-4 flex-shrink-0 bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(3,4,94,0.1)] transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
                <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                  <div className={`w-4 h-4 rounded-[4px] ${feature.iconDot} shadow-sm transform rotate-3 group-hover:rotate-12 transition-transform duration-300`}></div>
                </div>
                <h3 className="text-lg font-bold text-brand-900 mb-2 font-bitcount">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Steps = () => {
  const steps = [
    { num: "1", title: "Register", desc: "Download and book your brand business" },
    { num: "2", title: "Consult", desc: "Always available to answer your business." },
    { num: "3", title: "Choose Plan", desc: "Buy pro package today, X ceexeed" },
    { num: "4", title: "Manage", desc: "Buy pormcie payments is diff deys of borings" }
  ];

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <div className="py-24 bg-transparent relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/40 to-transparent pointer-events-none"></div>
      <div className="absolute -left-48 top-1/2 -translate-y-1/2 w-96 h-96 bg-brand-100/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left Visual: Glassmorphic UI Cluster — hidden on mobile (complex UI breaks layout) */}
          <div
            className="relative h-[400px] sm:h-[500px] hidden lg:flex items-center justify-center cursor-crosshair group perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => { setIsHovering(false); setMousePos({ x: 0, y: 0 }); }}
          >
             {/* Custom Graphical Dashboard Mockup (Matching Actual UI) */}
             <div 
               className="relative w-full max-w-lg aspect-[16/10] bg-slate-50 rounded-xl border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-20 flex overflow-hidden transition-transform duration-300 ease-out"
               style={{
                 transform: isHovering ? `rotateX(${-mousePos.y * 10}deg) rotateY(${mousePos.x * 10}deg) scale(1.02)` : 'rotateX(0deg) rotateY(0deg) scale(1)'
               }}
             >
               
               {/* Sidebar (Dark Blue) */}
               <div className="w-[22%] h-full bg-[#1e2336] flex flex-col pt-3 px-2 border-r border-slate-800">
                 {/* Logo area */}
                 <div className="w-full flex items-center gap-1.5 mb-4 px-1">
                   <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                   </div>
                   <div className="w-full h-2 bg-slate-300 rounded-full opacity-80"></div>
                 </div>
                 
                 {/* Active Menu Item */}
                 <div className="w-full h-5 bg-blue-600/30 rounded flex items-center px-1.5 gap-1.5 border border-blue-500/30 mb-2">
                   <div className="w-2 h-2 bg-blue-300 rounded-sm flex-shrink-0"></div>
                   <div className="w-full max-w-[40px] h-1.5 bg-white/90 rounded-full"></div>
                 </div>
                 
                 {/* Inactive Menu Items */}
                 <div className="flex flex-col gap-2 px-1.5 mt-2">
                   <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-slate-500 rounded-sm flex-shrink-0"></div><div className="w-full max-w-[48px] h-1 bg-slate-400 rounded-full"></div></div>
                   <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-slate-500 rounded-sm flex-shrink-0"></div><div className="w-full max-w-[32px] h-1 bg-slate-400 rounded-full"></div></div>
                   <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-slate-500 rounded-sm flex-shrink-0"></div><div className="w-full max-w-[40px] h-1 bg-slate-400 rounded-full"></div></div>
                   <div className="mt-2"><div className="w-6 h-[2px] bg-slate-600 rounded-full mb-1"></div></div>
                   <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-slate-500 rounded-sm flex-shrink-0"></div><div className="w-full max-w-[36px] h-1 bg-slate-400 rounded-full"></div></div>
                   <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-slate-500 rounded-sm flex-shrink-0"></div><div className="w-full max-w-[44px] h-1 bg-slate-400 rounded-full"></div></div>
                 </div>
                 
                 {/* Green bottom menu item */}
                 <div className="mt-auto mb-2 w-full h-5 bg-emerald-500 rounded flex items-center px-1.5 gap-1.5">
                    <div className="w-2 h-2 bg-white/60 rounded-sm flex-shrink-0"></div>
                    <div className="w-full max-w-[32px] h-1 bg-white/90 rounded-full"></div>
                 </div>
               </div>
               
               {/* Main Content Area */}
               <div className="flex-1 flex flex-col bg-[#f4f7fb]">
                 
                 {/* Topbar */}
                 <div className="h-8 bg-white border-b border-slate-200 flex items-center justify-between px-3 shadow-sm z-10">
                   <div className="flex items-center gap-2 w-full max-w-[65%]">
                      <div className="flex flex-col gap-[2px]">
                         <div className="w-3 h-[2px] bg-blue-500 rounded-full"></div>
                         <div className="w-3 h-[2px] bg-blue-500 rounded-full"></div>
                         <div className="w-3 h-[2px] bg-blue-500 rounded-full"></div>
                      </div>
                      <div className="w-full h-4 bg-slate-50 border border-slate-200 rounded-full flex items-center px-2 gap-1.5">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                         <div className="w-16 h-[2px] bg-slate-400 rounded-full"></div>
                      </div>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <div className="w-10 h-1 bg-slate-300 rounded-full"></div>
                      <div className="w-4 h-4 bg-blue-100 rounded-full border border-blue-200 flex items-center justify-center"><div className="w-2 h-2 bg-blue-500 rounded-full"></div></div>
                   </div>
                 </div>
                 
                 {/* Content Body */}
                 <div className="flex-1 p-3 flex flex-col">
                    {/* 4 Colored Metric Cards */}
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      <div className="h-10 bg-[#3b66d8] rounded p-1.5 flex flex-col justify-between relative overflow-hidden shadow-sm">
                        <div className="w-8 h-1 bg-white/50 rounded-full"></div>
                        <div className="w-6 h-2.5 bg-white rounded-full"></div>
                        <div className="absolute right-1 top-1 bottom-1 w-6 bg-white/10 rounded flex items-center justify-center"><div className="w-3 h-3 rounded-full bg-white/20"></div></div>
                      </div>
                      <div className="h-10 bg-[#0ea5e9] rounded p-1.5 flex flex-col justify-between relative overflow-hidden shadow-sm">
                        <div className="w-10 h-1 bg-white/50 rounded-full"></div>
                        <div className="w-5 h-2.5 bg-white rounded-full"></div>
                        <div className="absolute right-1 top-1 bottom-1 w-6 bg-white/10 rounded flex items-center justify-center"><div className="w-3 h-3 bg-white/20 skew-y-12"></div></div>
                      </div>
                      <div className="h-10 bg-[#f59e0b] rounded p-1.5 flex flex-col justify-between relative overflow-hidden shadow-sm">
                        <div className="w-12 h-1 bg-white/50 rounded-full"></div>
                        <div className="w-7 h-2.5 bg-white rounded-full"></div>
                        <div className="absolute right-1 top-1 bottom-1 w-6 bg-white/10 rounded flex items-center justify-center"><div className="w-3 h-3 border-2 border-white/20 rounded-sm"></div></div>
                      </div>
                      <div className="h-10 bg-[#dc2626] rounded p-1.5 flex flex-col justify-between relative overflow-hidden shadow-sm">
                        <div className="w-8 h-1 bg-white/50 rounded-full"></div>
                        <div className="w-5 h-2.5 bg-white rounded-full"></div>
                        <div className="absolute right-1 top-1 bottom-1 w-6 bg-white/10 rounded flex items-center justify-center"><div className="w-1 h-3 bg-white/20"></div></div>
                      </div>
                    </div>
                    
                    {/* Quick Actions Title */}
                    <div className="w-16 h-1.5 bg-slate-400 rounded-full mb-2"></div>
                    
                    {/* 6 Quick Action Cards (3x2) */}
                    <div className="grid grid-cols-3 gap-2 flex-1">
                       {[
                         { bg: 'bg-white', iconBg: 'bg-blue-100', icon: 'bg-blue-500' },
                         { bg: 'bg-white', iconBg: 'bg-emerald-100', icon: 'bg-emerald-500' },
                         { bg: 'bg-white', iconBg: 'bg-amber-100', icon: 'bg-amber-500' },
                         { bg: 'bg-white', iconBg: 'bg-red-100', icon: 'bg-red-500' },
                         { bg: 'bg-white', iconBg: 'bg-cyan-100', icon: 'bg-cyan-500' },
                         { bg: 'bg-white', iconBg: 'bg-slate-200', icon: 'bg-slate-500' }
                       ].map((item, i) => (
                          <div key={i} className={`bg-white rounded border border-slate-200 flex flex-col items-center justify-center gap-1.5 p-1 shadow-sm`}>
                             <div className={`w-6 h-6 rounded-full flex items-center justify-center ${item.iconBg}`}>
                                <div className={`w-2.5 h-2.5 rounded-[3px] ${item.icon}`}></div>
                             </div>
                             <div className="w-14 h-1.5 bg-slate-800 rounded-full"></div>
                             <div className="w-16 h-1 bg-slate-400 rounded-full"></div>
                          </div>
                       ))}
                    </div>
                 </div>
               </div>
             </div>

             {/* Floating Element 1: Total Sales Metric (Blue) */}
             <div 
               className="absolute -top-8 right-12 w-32 h-16 bg-[#3b66d8]/90 backdrop-blur-md rounded-xl p-2.5 flex flex-col justify-between shadow-2xl border border-white/20 z-30 transition-transform duration-300 ease-out pointer-events-none"
               style={{
                 transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px) rotate(8deg)`
               }}
             >
                <div className="w-12 h-1.5 bg-white/60 rounded-full"></div>
                <div className="w-10 h-4 bg-white rounded-full"></div>
                <div className="absolute right-2 top-2 bottom-2 w-10 bg-white/10 rounded-lg flex items-center justify-center">
                   <div className="w-5 h-5 rounded-full bg-white/20"></div>
                </div>
             </div>

             {/* Floating Element 2: Total Customer Due (Red) */}
             <div 
               className="absolute -bottom-4 -left-8 w-28 h-14 bg-[#dc2626]/90 backdrop-blur-md rounded-xl p-2.5 flex flex-col justify-between shadow-2xl border border-white/20 z-30 transition-transform duration-300 ease-out pointer-events-none"
               style={{
                 transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 20}px) rotate(-10deg)`
               }}
             >
                <div className="w-10 h-1.5 bg-white/60 rounded-full"></div>
                <div className="w-8 h-3 bg-white rounded-full"></div>
                <div className="absolute right-2 top-2 bottom-2 w-8 bg-white/10 rounded-lg flex items-center justify-center">
                   <div className="w-1.5 h-4 bg-white/30 rounded-sm"></div>
                </div>
             </div>
             
             {/* Floating Element 3: Create New Invoice (Quick Action) */}
             <div 
               className="absolute bottom-16 right-4 w-36 bg-white/80 backdrop-blur-xl rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-2 p-3 shadow-2xl z-30 transition-transform duration-300 ease-out pointer-events-none"
               style={{
                 transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 40}px) rotate(4deg)`
               }}
             >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-blue-100`}>
                   <div className={`w-3 h-3 rounded-[3px] bg-blue-500`}></div>
                </div>
                <div className="w-20 h-2 bg-slate-800 rounded-full"></div>
                <div className="w-24 h-1.5 bg-slate-400 rounded-full"></div>
             </div>
          </div>

          {/* Right Content */}
          <div className="max-w-xl relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-900 mb-4 tracking-tight font-bitcount">Simple <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-700 to-brand-700">Solutions!</span></h2>
            <p className="text-slate-500 text-lg mb-10 font-medium">
              We understand that no two businesses are alike. That's why we take the time to understand.
            </p>
            
            <div className="space-y-6 mb-10">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-brand-700 flex items-center justify-center font-bold text-brand-700 bg-white font-bitcount">
                    {step.num}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-brand-900 mb-1 font-bitcount">{step.title}</h4>
                    <p className="text-sm text-slate-500 font-medium">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a href="#pricing" className="text-center w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-brand-700 to-brand-700 hover:shadow-lg hover:shadow-brand-500/30 transition-all">
                Get Started
              </a>
              <a href="#demo" className="text-center w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-full text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
                Free Demo
              </a>
              <a
                href={isLiveDemoReady ? RAILWAY_DEMO_URL : "#"}
                target={isLiveDemoReady ? "_blank" : undefined}
                rel={isLiveDemoReady ? "noopener noreferrer" : undefined}
                onClick={(e) => { if (!isLiveDemoReady) { e.preventDefault(); alert("Live demo link will be available soon. Please use 'Register for Free Demo' for now."); } }}
                className={`text-center w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-full text-sm font-bold border-2 ${
                  isLiveDemoReady ? "text-brand-700 border-brand-700 bg-white hover:bg-brand-700 hover:text-white" : "text-brand-700/60 border-brand-700/40 bg-white/60 cursor-not-allowed"
                } transition-colors`}
              >
                Try Live Demo
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};


const Pricing = ({ onOpenOrderForm }) => {
  const [cycle, setCycle] = React.useState("monthly"); // monthly | quarterly | halfyearly | yearly
  const [isAnimating, setIsAnimating] = React.useState(false);

  const handleCycleChange = (newCycle) => {
    setIsAnimating(true);
    setCycle(newCycle);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const cycles = [
    { key: "monthly", label: "Monthly", suffix: "/mo" },
    { key: "quarterly", label: "3 Month", suffix: "/3mo" },
    { key: "halfyearly", label: "6 Month", suffix: "/6mo" },
    { key: "yearly", label: "Yearly plan", suffix: "/yr" },
  ];

  const plans = [
    {
      name: "Basic",
      desc: "Ideal for small shops",
      price: { monthly: "249", quarterly: "699", halfyearly: "1199", yearly: "2199" },
      highlighted: false,
      buttonText: "Get Now",
      features: [
        "Quick Invoice",
        "Stock Tracking",
        "Customer Database",
        "Delivery Sequence",
        "Role Management (Up to 2 Members)",
      ],
    },
    {
      name: "Standard",
      desc: "Perfect for growing businesses",
      price: { monthly: "449", quarterly: "1149", halfyearly: "1999", yearly: "3999" },
      highlighted: true,
      buttonText: "Get Now",
      note: { monthly: "1 month free for first purchase only", quarterly: "1 month free for first purchase only", halfyearly: "1 month free for first purchase only", yearly: "1 month free for first purchase only" },
      features: [
        "All Basic Features",
        "Cloud Database Backup",
        "10 Invoice Templates",
        "Billing Section",
        "Low Stock Alert & Bazar List",
        "Advance Delivery Section",
        "Party Ledger",
        "Wallet Section (Track Your Money)",
        "Financial Report",
        "Role Management (Up to 2 Managers & 2 Staff)",
      ],
    },
    {
      name: "Pro",
      desc: "Advanced tools for pros",
      price: { monthly: "549", quarterly: "1499", halfyearly: "2499", yearly: "4999" },
      highlighted: false,
      buttonText: "Get Now",
      note: { monthly: "2 month free for first purchase only", quarterly: "2 month free for first purchase only", halfyearly: "2 month free for first purchase only", yearly: "2 month free for first purchase only" },
      features: [
        "All Basic + Standard Features",
        "Full Personalized Invoice",
        "Daily Staff Activities",
        "Live Staff Monitoring",
        "Bulk Order Import",
        "Role Management (Unlimited Managers & Staff)",
      ],
    },
    {
      name: "Customized",
      desc: "For large organizations",
      price: { monthly: "Custom", quarterly: "Custom", halfyearly: "Custom", yearly: "Custom" },
      highlighted: false,
      buttonText: "Contact Today",
      features: [
        "Tailored ERP Modules",
        "Dedicated Onboarding",
        "Custom Integrations",
        "Priority Support",
      ],
    },
  ];

  return (
    <div id="pricing" className="py-24 bg-transparent relative">
      {/* The solid colored band behind the pricing cards as seen in the reference */}
      <div className="absolute top-1/2 left-0 w-full h-64 bg-brand-500/10 backdrop-blur-3xl -translate-y-12 z-0"></div>

      <div className="max-w-[100vw] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-900 mb-4 tracking-tight font-bitcount">Flexible Plans for Every Business</h2>
          <p className="text-slate-500 text-lg">
            Let's your business management and ERP software
          </p>
        </div>

        {/* Billing cycle toggle */}
        <div className="flex justify-center mb-24">
          <div className="inline-flex bg-white rounded-full p-1.5 shadow-md border border-slate-100">
            {cycles.map((c) => (
              <button
                key={c.key}
                onClick={() => handleCycleChange(c.key)}
                className={`px-5 sm:px-7 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ease-in-out ${
                  cycle === c.key
                    ? "bg-gradient-to-r from-brand-700 to-brand-500 text-white shadow-md transform scale-105"
                    : "text-slate-500 hover:text-brand-900"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch max-w-7xl mx-auto px-2 sm:px-0">
          {plans.map((plan, index) => {
            const price = plan.price[cycle];
            const isCustom = price === "Custom";
            const note = plan.note && plan.note[cycle];
            return (
              <div key={index} className={`relative bg-white rounded-[2rem] p-6 lg:p-8 border ${plan.highlighted ? 'border-2 border-brand-500 shadow-[0_25px_60px_rgba(0,119,182,0.22)] lg:scale-105 lg:-translate-y-3 z-20 lg:hover:scale-110' : 'border-slate-100 shadow-xl z-10 hover:scale-105'} flex flex-col text-center transition-transform duration-300 cursor-pointer hover:shadow-2xl`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-extrabold text-white bg-gradient-to-r from-brand-700 to-brand-500 shadow-md whitespace-nowrap tracking-wide uppercase font-sans">
                    ⭐ Most Demand
                  </div>
                )}
                <h3 className="text-xl font-bold text-brand-900 font-sans">{plan.name}</h3>
                <p className="text-sm text-slate-500 font-medium mb-4">{plan.desc}</p>
                <div className={`text-5xl lg:text-6xl font-black text-brand-900 mb-1 font-sans tracking-tighter flex items-baseline justify-center transition-all duration-300 ${isAnimating ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'} ${isCustom ? 'text-4xl lg:text-5xl py-2' : ''}`}>
                  {!isCustom && <span className="text-xl text-slate-400 font-bold font-sans mr-2 uppercase tracking-wide">৳</span>}
                  {price}
                  {!isCustom && <span className="text-lg text-slate-400 font-bold font-sans ml-1">{cycles.find(c => c.key === cycle).suffix}</span>}
                </div>
                {note && (
                  <div className="inline-flex justify-center w-full mb-3 mt-1">
                    <span className="px-2 py-1 rounded-full text-[9px] sm:text-[10px] font-extrabold text-emerald-700 bg-emerald-100/80 border border-emerald-200 uppercase whitespace-nowrap shadow-sm flex items-center gap-1.5 overflow-hidden">
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="truncate">{note}</span>
                    </span>
                  </div>
                )}

                <ul className="text-sm text-slate-600 font-medium space-y-3.5 my-6 flex-1 text-left px-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.name === 'Customized' ? (
                  <div className="space-y-2">
                    <a href="#contact" className="block w-full py-3.5 rounded-full text-sm font-bold transition-all bg-brand-900 text-white hover:bg-slate-800">
                      {plan.buttonText}
                    </a>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button onClick={onOpenOrderForm} className={`w-full py-3.5 rounded-full text-sm font-bold transition-all active:scale-95 ${plan.highlighted ? 'bg-gradient-to-r from-brand-700 to-brand-700 text-white shadow-md' : 'bg-brand-900 text-white hover:bg-slate-800'}`}>
                      {plan.buttonText}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
const DemoRequest = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target);
    // Add Web3Forms required fields
    formData.append("access_key", "96fa57c3-fc61-4fd6-b4f1-fc2abde84093");
    formData.append("subject", "New Demo Request - Projukti X");
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsSubmitted(true);
        e.target.reset();
      } else {
        console.error("Web3Forms error:", data);
        alert("There was an error submitting your request: " + data.message);
      }
    } catch (error) {
      console.error("Error submitting form", error);
      alert("There was a network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="demo" className="pt-24 pb-12 bg-transparent relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#eef2ff] to-[#f5f3ff] rounded-[3rem] p-8 md:p-16 border border-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden text-center">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-200/50 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-900 mb-4 tracking-tight font-bitcount">Request a <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-700 to-brand-700">Free Demo</span></h2>
            <p className="text-slate-500 text-lg mb-10 font-medium">
              Experience Projukti X in action. Our team will guide you through the software and answer your questions.
            </p>
            
            {isSubmitted ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-green-100 shadow-sm animate-[float_0.3s_ease-out]">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-brand-900 mb-2">Request Received!</h3>
                <p className="text-slate-600">Thank you for your interest. Our team will contact you shortly to schedule your free demo.</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 px-6 py-2 rounded-full text-brand-600 font-bold hover:bg-brand-50 transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form className="space-y-4 text-left relative" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" name="fullName" required placeholder="Full Name" className="w-full px-5 py-4 rounded-xl border border-white bg-white/60 backdrop-blur shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-slate-700 font-medium placeholder-slate-400" />
                  <input type="email" name="workEmail" required placeholder="Work Email" className="w-full px-5 py-4 rounded-xl border border-white bg-white/60 backdrop-blur shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-slate-700 font-medium placeholder-slate-400" />
                  <input type="text" name="companyName" required placeholder="Company Name" className="w-full px-5 py-4 rounded-xl border border-white bg-white/60 backdrop-blur shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-slate-700 font-medium placeholder-slate-400" />
                  <input type="tel" name="phoneNumber" required placeholder="Phone Number" className="w-full px-5 py-4 rounded-xl border border-white bg-white/60 backdrop-blur shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-slate-700 font-medium placeholder-slate-400" />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full py-4 mt-4 rounded-xl text-base font-bold text-white bg-brand-900 shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed hover:translate-y-0' : 'hover:bg-brand-900/90'}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Sending...
                    </>
                  ) : "Request Demo"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactInfo = () => {
  return (
    <div id="contact" className="pb-24 pt-12 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-900 mb-4 tracking-tight font-bitcount">Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-700 to-brand-700">Touch</span></h2>
          <p className="text-slate-500 text-lg font-medium">Reach out to us directly through any of our official channels.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <a href="https://wa.me/8801805719603" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-center gap-4 p-8 bg-white/60 backdrop-blur rounded-[2rem] border border-white hover:bg-white/90 hover:border-green-300 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.3)] transition-all group">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
               <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            </div>
            <div>
               <div className="text-xs font-bold text-slate-400 group-hover:text-green-600 transition-colors uppercase tracking-wider mb-2">WhatsApp</div>
               <div className="font-bold text-brand-900 truncate">01805-719603</div>
            </div>
          </a>

          {/* Email */}
          <a href="mailto:projuktix@gmail.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-center gap-4 p-8 bg-white/60 backdrop-blur rounded-[2rem] border border-white hover:bg-white/90 hover:border-blue-300 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)] transition-all group">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
            </div>
            <div>
               <div className="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors uppercase tracking-wider mb-2">Email</div>
               <div className="font-bold text-brand-900 truncate">projuktix@gmail.com</div>
            </div>
          </a>

          {/* Facebook */}
          <a href="https://www.facebook.com/profile.php?id=61589976338651" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-center gap-4 p-8 bg-white/60 backdrop-blur rounded-[2rem] border border-white hover:bg-white/90 hover:border-indigo-300 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.3)] transition-all group">
            <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
               <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
            </div>
            <div>
               <div className="text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-wider mb-2">Facebook</div>
               <div className="font-bold text-brand-900 truncate">@ProjuktiX</div>
            </div>
          </a>

          {/* Instagram */}
          <a href="https://www.instagram.com/projuktix/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-center gap-4 p-8 bg-white/60 backdrop-blur rounded-[2rem] border border-white hover:bg-white/90 hover:border-pink-300 hover:shadow-[0_20px_40px_-15px_rgba(236,72,153,0.3)] transition-all group">
            <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
               <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </div>
            <div>
               <div className="text-xs font-bold text-slate-400 group-hover:text-pink-600 transition-colors uppercase tracking-wider mb-2">Instagram</div>
               <div className="font-bold text-brand-900 truncate">@projuktix</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};


const FAQ = () => {
  const faqs = [
    {
      q: "Is Projukti X a cloud-based software?",
      a: "Yes, Projukti X is a completely cloud-based business management software. As long as you have an internet connection, you can access your business from anywhere, on any device (mobile, tablet, or computer). There is no need to install any software locally.",
    },
    {
      q: "Is the demo actually free?",
      a: "Yes, we provide a completely free demo. Simply click the 'Register for Free Demo' button above and fill out the form. Our team will get in touch to schedule your personalized demo session.",
    },
    {
      q: "Will my business data be safe?",
      a: "Absolutely. All your business data is securely encrypted and stored on our enterprise-grade servers. We also run regular automated backups to ensure you never lose any data.",
    },
    {
      q: "How long does setup take?",
      a: "Generally, account setup and basic configuration can be completed within 1-2 business days. If your business requires a complex custom setup, we will discuss your requirements and provide a clear timeline.",
    },
    {
      q: "Can I get a refund if I cancel my subscription?",
      a: "Our refund policy may vary depending on your specific plan. We recommend contacting us via WhatsApp or email before placing your order to clarify any refund or cancellation terms.",
    },
    {
      q: "How do I get customer support?",
      a: "You can reach out to us anytime via WhatsApp, email, or our contact form. Our dedicated support team is always ready to assist you!",
    },
  ];

  const [openIndex, setOpenIndex] = React.useState(0);

  return (
    <div id="faq" className="py-24 bg-transparent relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-900 mb-3 tracking-tight font-bitcount">Frequently Asked Questions</h2>
          <p className="text-slate-500 text-base md:text-lg font-medium">Ja jante chao, shob answer ekhane pabe.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border transition-all overflow-hidden ${isOpen ? 'border-brand-500/30 bg-white/80 shadow-md' : 'border-slate-200 bg-white/50'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-4 sm:py-5"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-slate-800 text-sm sm:text-base">{item.q}</span>
                  <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all ${isOpen ? 'bg-brand-700 border-brand-700 rotate-45' : 'border-slate-300 text-slate-500'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" className={isOpen ? 'text-white' : ''} />
                    </svg>
                  </span>
                </button>
                <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <p className="px-5 sm:px-6 pb-4 sm:pb-5 text-slate-500 text-sm sm:text-base leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
const WhatsAppFloatButton = () => {
  return (
    <a
      href="https://wa.me/8801805719603"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] shadow-[0_10px_30px_rgba(37,211,102,0.5)] flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-50" />
      <svg viewBox="0 0 32 32" className="w-7 h-7 sm:w-8 sm:h-8 relative" fill="white">
        <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.696 4.611 1.897 6.484L4 29l7.697-1.865A11.93 11.93 0 0 0 16.001 27C22.63 27 28 21.627 28 15S22.63 3 16.001 3zm6.964 17.032c-.297.834-1.47 1.53-2.406 1.727-.64.135-1.474.243-4.286-.92-3.594-1.488-5.905-5.13-6.087-5.366-.176-.235-1.454-1.935-1.454-3.69 0-1.756.914-2.62 1.24-2.977.297-.324.65-.404.867-.404.216 0 .434.002.624.011.2.009.469-.076.734.56.297.71.987 2.457 1.073 2.635.086.178.144.386.029.622-.115.235-.173.382-.34.588-.169.206-.354.46-.505.618-.169.176-.345.367-.148.72.196.353.874 1.443 1.877 2.337 1.29 1.15 2.377 1.507 2.729 1.678.353.17.559.147.766-.088.207-.235.882-1.03 1.118-1.383.235-.353.47-.294.79-.176.32.117 2.032.958 2.381 1.132.348.176.58.264.667.412.086.147.086.85-.211 1.684z"/>
      </svg>
    </a>
  );
};


const Footer = ({ onOpenPrivacyPolicy }) => {
  return (
    <div className="flex flex-col">
      {/* Pre-Footer Banner */}
      <div className="bg-[#0A0F1C] border-b border-slate-800 py-16 relative overflow-hidden">
        {/* Background abstract lines */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, #4f46e5 1px, transparent 1px), linear-gradient(to bottom, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
           <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3 tracking-tight font-bitcount">Ready to get started?</h3>
           <p className="text-slate-400 font-medium mb-8">Ready to take control of your business?</p>
           <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
             <a
               href={isLiveDemoReady ? RAILWAY_DEMO_URL : "#"}
               target={isLiveDemoReady ? "_blank" : undefined}
               rel={isLiveDemoReady ? "noopener noreferrer" : undefined}
               onClick={(e) => { if (!isLiveDemoReady) { e.preventDefault(); alert("Live demo link will be available soon."); } }}
               className={`w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-bold border-2 transition-colors ${
                 isLiveDemoReady ? "text-white border-white bg-transparent hover:bg-white hover:text-brand-900" : "text-white/60 border-white/40 cursor-not-allowed"
               }`}
             >
               Try Live Demo
             </a>
             <a href="#demo" className="w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-bold text-brand-900 bg-white hover:bg-slate-100 shadow-lg transition-colors">
               Register for Free Demo
             </a>
           </div>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="bg-[#0f1629] text-white pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Col 1 */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <BrandLogo className="w-8 h-8 text-white" />
                <span className="font-extrabold text-xl tracking-tight text-white">Projukti X</span>
              </div>
              <div className="flex gap-4">
                {/* Facebook */}
                <a href="https://www.facebook.com/profile.php?id=61589976338651" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 hover:bg-brand-700 hover:text-white hover:-translate-y-1 transition-all">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
                
                {/* WhatsApp */}
                <a href="https://wa.me/8801805719603" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white hover:-translate-y-1 transition-all">
                  <span className="sr-only">WhatsApp</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.115.553 4.17 1.6 5.996L.108 23.518l5.65-1.48c1.782.956 3.774 1.46 5.82 1.46 6.647 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm0 21.484c-1.84 0-3.645-.494-5.228-1.433l-.375-.22-3.882 1.018 1.036-3.784-.243-.386c-1.033-1.636-1.58-3.528-1.58-5.462 0-5.63 4.58-10.21 10.21-10.21 5.63 0 10.21 4.58 10.21 10.21 0 5.63-4.58 10.21-10.21 10.21zm5.59-7.64c-.307-.153-1.815-.895-2.096-1-.28-.102-.486-.153-.69.153-.204.306-.791 1-.97 1.205-.18.204-.36.23-.666.076-.307-.153-1.295-.477-2.468-1.523-.912-.815-1.527-1.823-1.706-2.128-.18-.306-.02-.472.133-.625.138-.138.307-.358.46-.537.154-.18.205-.307.307-.512.103-.205.05-.384-.025-.537-.077-.154-.69-1.664-.946-2.278-.25-.6-.505-.518-.69-.527-.18-.01-.385-.01-.59-.01-.205 0-.538.076-.82.383-.28.306-1.074 1.05-1.074 2.557s1.1 2.968 1.253 3.173c.154.205 2.164 3.303 5.244 4.634 2.152.928 2.87.828 3.398.716.638-.135 1.815-.742 2.07-1.46.255-.716.255-1.33.18-1.46-.077-.128-.28-.205-.587-.358z"/></svg>
                </a>
                
                {/* Email */}
                <a href="mailto:projuktix@gmail.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 hover:bg-blue-500 hover:text-white hover:-translate-y-1 transition-all">
                  <span className="sr-only">Email</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </a>

                {/* Instagram */}
                <a href="https://www.instagram.com/projuktix/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white hover:-translate-y-1 transition-all">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                </a>
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100 font-bitcount">Company</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Team</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100 font-bitcount">Legal</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-400">
                <li><button onClick={onOpenPrivacyPolicy} className="hover:text-white transition-colors cursor-pointer text-left">Privacy Policies</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tax & Compliance</a></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-slate-100 font-bitcount">Resources</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Software Demo</a></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 text-center">
             <p className="text-sm font-medium text-slate-500">
              Copyright © 2026 Projukti X. All rights reserved.
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-[float_0.3s_ease-out]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-100 bg-slate-50/80">
          <div>
            <h2 className="text-2xl font-extrabold text-brand-900 font-bitcount tracking-tight">Privacy Policy</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          <div className="prose prose-slate max-w-none">
            <h3 className="text-xl font-bold text-brand-900 mb-3">1. Introduction</h3>
            <p className="text-slate-600 mb-6">
              Welcome to Projukti X. We are committed to protecting your privacy and safeguarding the information you entrust to us. This Privacy Policy explains how we collect, use, disclose, store, and protect your personal and business information when you access or use the Projukti X website, mobile application, and related services (collectively, the "Services"). By creating an account or using our Services, you acknowledge that you have read and understood this Privacy Policy and consent to the collection and use of your information as described herein, subject to applicable laws of Bangladesh.
            </p>

            <h3 className="text-xl font-bold text-brand-900 mb-3">2. Information We Collect</h3>
            <p className="text-slate-600 mb-4">To operate our Services efficiently, we collect only the information reasonably necessary for legitimate business purposes.</p>
            
            <h4 className="font-bold text-brand-800 mt-4 mb-2">2.1 Account Information</h4>
            <p className="text-slate-600 mb-4">When you register for Projukti X, we may collect: Full name, Business or company name, Email address, Mobile phone number, Business address, Designation or role, Profile information you choose to provide.</p>
            
            <h4 className="font-bold text-brand-800 mt-4 mb-2">2.2 Business Information</h4>
            <p className="text-slate-600 mb-4">To provide ERP and business management services, you may enter information including: Customer records, Supplier information, Product and inventory details, Sales and purchase records, Financial records, Employee information, Branch information, Reports and invoices. This information remains your business data.</p>
            
            <h4 className="font-bold text-brand-800 mt-4 mb-2">2.3 Verification Information</h4>
            <p className="text-slate-600 mb-4">Where necessary for fraud prevention, legal compliance, or account verification, we may request supporting business documents such as: Trade License, BIN, TIN, Other business registration documents. We will only request government-issued identification where legally required or otherwise necessary for verification.</p>

            <h4 className="font-bold text-brand-800 mt-4 mb-2">2.4 Technical Information</h4>
            <p className="text-slate-600 mb-4">We automatically collect certain technical information, including: IP address, Browser type, Operating system, Device information, Login timestamps, Usage analytics, Error logs, Session information.</p>

            <h4 className="font-bold text-brand-800 mt-4 mb-2">2.5 Payment Information</h4>
            <p className="text-slate-600 mb-6">Payments are securely processed by trusted third-party payment providers. Projukti X does <strong>not</strong> store: Credit or debit card numbers, CVV codes, Mobile banking PINs, Banking passwords.</p>

            <h3 className="text-xl font-bold text-brand-900 mb-3">3. How We Use Your Information</h3>
            <p className="text-slate-600 mb-4">We use your information only for legitimate business purposes, including to:</p>
            <ul className="list-disc pl-5 text-slate-600 mb-6 space-y-1">
              <li>Create and manage your account</li>
              <li>Provide ERP and POS functionality</li>
              <li>Generate invoices and reports</li>
              <li>Process subscription payments</li>
              <li>Verify business identity</li>
              <li>Respond to customer support requests</li>
              <li>Improve our Services</li>
              <li>Monitor platform performance and security</li>
              <li>Prevent fraud and unauthorized access</li>
              <li>Comply with legal obligations</li>
              <li>Notify you of important updates and service announcements</li>
            </ul>
            <p className="text-slate-600 font-medium mb-6">We do not sell your personal information.</p>

            <h3 className="text-xl font-bold text-brand-900 mb-3">4. Legal Basis for Processing</h3>
            <p className="text-slate-600 mb-6">We process information based on one or more of the following: Your consent, Performance of our agreement with you, Compliance with applicable legal obligations, Legitimate business interests such as maintaining platform security, preventing fraud, and improving our Services.</p>

            <h3 className="text-xl font-bold text-brand-900 mb-3">5. Cookies and Similar Technologies</h3>
            <p className="text-slate-600 mb-6">Projukti X uses cookies and similar technologies to: Keep you signed in, Remember your preferences, Improve website performance, Analyze usage patterns, Enhance security. You may manage cookie preferences through your browser settings; however, disabling certain cookies may affect the functionality of the Services.</p>

            <h3 className="text-xl font-bold text-brand-900 mb-3">6. Sharing of Information</h3>
            <p className="text-slate-600 mb-4 font-medium">We do not sell or rent your information. We may share information only with:</p>
            <h4 className="font-bold text-brand-800 mt-4 mb-2">Service Providers</h4>
            <p className="text-slate-600 mb-4">Trusted vendors that assist us with: Cloud hosting, Payment processing, Email delivery, Customer support, Security monitoring, Analytics. These providers are required to protect your information and use it only for authorized purposes.</p>
            <h4 className="font-bold text-brand-800 mt-4 mb-2">Legal Requirements</h4>
            <p className="text-slate-600 mb-4">We may disclose information when required to: comply with applicable laws; respond to lawful requests from courts or government authorities; or protect the rights, safety, property, or security of Projukti X, our users, or others.</p>
            <h4 className="font-bold text-brand-800 mt-4 mb-2">Business Transfers</h4>
            <p className="text-slate-600 mb-6">If Projukti X undergoes a merger, acquisition, or sale of assets, user information may be transferred as part of that transaction, subject to applicable legal requirements.</p>

            <h3 className="text-xl font-bold text-brand-900 mb-3">7. International Data Transfers</h3>
            <p className="text-slate-600 mb-6">Some of our service providers or hosting infrastructure may be located outside Bangladesh. Where information is transferred internationally, we take reasonable measures to ensure appropriate safeguards are in place and that such transfers comply with applicable legal requirements.</p>

            <h3 className="text-xl font-bold text-brand-900 mb-3">8. Data Security</h3>
            <p className="text-slate-600 mb-6">Protecting your information is one of our highest priorities. We implement appropriate administrative, technical, and organizational security measures, including: Encrypted HTTPS connections, Secure cloud infrastructure, Password hashing, Role-based access controls, System monitoring, Audit logging, Regular software updates, Routine data backups. Although we strive to protect your information, no method of electronic storage or transmission can be guaranteed to be completely secure.</p>

            <h3 className="text-xl font-bold text-brand-900 mb-3">9. Data Retention</h3>
            <p className="text-slate-600 mb-6">We retain personal and business information only for as long as necessary to: provide our Services; comply with legal, accounting, and tax obligations; resolve disputes; and enforce our agreements. When information is no longer required, we will securely delete or anonymize it where reasonably practicable.</p>

            <h3 className="text-xl font-bold text-brand-900 mb-3">10. Your Rights</h3>
            <p className="text-slate-600 mb-6">Subject to applicable law, you may have the right to: Access your personal information, Correct inaccurate information, Update your account details, Request deletion of eligible personal information, Withdraw consent where processing is based on consent, Request information about how your data is processed. Certain requests may be limited where we are legally required to retain information or where retention is necessary to provide our Services.</p>

            <h3 className="text-xl font-bold text-brand-900 mb-3">11. Business Data Ownership</h3>
            <p className="text-slate-600 mb-6">All business data that you upload or create using Projukti X—including inventory records, invoices, customer information, supplier data, employee records, reports, and financial information—remains your property. Projukti X does not claim ownership of your business data.</p>

            <h3 className="text-xl font-bold text-brand-900 mb-3">12. Account Deletion</h3>
            <p className="text-slate-600 mb-6">You may request deletion of your account by contacting us. Following account deletion, we may retain certain information where required for legal, accounting, tax, fraud prevention, security, or dispute resolution purposes.</p>

            <h3 className="text-xl font-bold text-brand-900 mb-3">13. Children's Privacy</h3>
            <p className="text-slate-600 mb-6">Projukti X is designed for businesses and individuals who are legally able to enter into binding agreements. Our Services are not intended for children.</p>

            <h3 className="text-xl font-bold text-brand-900 mb-3">14. Changes to This Privacy Policy</h3>
            <p className="text-slate-600 mb-6">We may update this Privacy Policy from time to time. Any updates will be published on our website together with the revised effective date. Your continued use of the Services after changes become effective constitutes acceptance of the updated Privacy Policy.</p>

            <h3 className="text-xl font-bold text-brand-900 mb-3">15. Contact Us</h3>
            <p className="text-slate-600 mb-4">If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:</p>
            <div className="bg-brand-50 rounded-xl p-6 border border-brand-100">
              <p className="font-bold text-brand-900 mb-4">Company: Projukti X</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  </div>
                  <a href="mailto:projuktix@gmail.com" className="text-slate-600 font-medium hover:text-brand-600 transition-colors">projuktix@gmail.com</a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  </div>
                  <a href="https://wa.me/8801805719603" target="_blank" rel="noopener noreferrer" className="text-slate-600 font-medium hover:text-brand-600 transition-colors">01805-719603</a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                  </div>
                  <a href="https://www.facebook.com/profile.php?id=61589976338651" target="_blank" rel="noopener noreferrer" className="text-slate-600 font-medium hover:text-brand-600 transition-colors">@ProjuktiX</a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </div>
                  <a href="https://www.instagram.com/projuktix/" target="_blank" rel="noopener noreferrer" className="text-slate-600 font-medium hover:text-brand-600 transition-colors">@projuktix</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm hover:shadow-md transition-all"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
};

const OrderFormModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden animate-[float_0.3s_ease-out]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/80">
          <div>
            <h2 className="text-2xl font-extrabold text-brand-900 font-bitcount tracking-tight">Order Projukti X</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Please fill out the form below to confirm your order.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 w-full relative bg-slate-50">
          <iframe 
            src="https://docs.google.com/forms/d/e/1FAIpQLSfNgeugTn8jVmfLQOY51EDpR9utBpZ73RO6oH97nverD4nt5g/viewform?embedded=true" 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            marginHeight="0" 
            marginWidth="0"
            className="absolute inset-0"
            title="Order Form"
          >
            Loading…
          </iframe>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-100 via-brand-300 to-brand-500 font-inter selection:bg-brand-900/30 selection:text-brand-900 text-brand-900">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Bitcount+Single:wght@100..900&family=Cookie&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
        
        .font-inter {
          font-family: "Inter", sans-serif;
          font-optical-sizing: auto;
        }

        /* Custom Pixelated Cursor */
        * {
          cursor: url("data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 2v16l5-5h7l-12-11z' fill='%233b82f6' stroke='%230f172a' stroke-width='2' stroke-linejoin='miter'/%3E%3C/svg%3E") 2 2, auto !important;
        }
        
        a, button, [role="button"], input, select, textarea, .cursor-pointer {
          cursor: url("data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 2v16l5-5h7l-12-11z' fill='%2310b981' stroke='%230f172a' stroke-width='2' stroke-linejoin='miter'/%3E%3C/svg%3E") 2 2, pointer !important;
        }
        
        .font-cookie {
          font-family: "Cookie", cursive;
          font-weight: 400;
          font-style: normal;
        }
        
        .font-bitcount {
          font-family: "Bitcount Single", system-ui;
          font-optical-sizing: auto;
          font-variation-settings: "slnt" 0, "CRSV" 0.5, "ELSH" 0, "ELXP" 0;
        }

        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(var(--tw-rotate)); }
          50% { transform: translateY(-15px) rotate(var(--tw-rotate)); }
          100% { transform: translateY(0px) rotate(var(--tw-rotate)); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes roam {
          0% { transform: translateX(0); }
          50% { transform: translateX(calc(-100vw + 140px)); }
          100% { transform: translateX(0); }
        }
        .animate-roam {
          animation: roam 30s ease-in-out infinite;
        }
        @keyframes shimmer {
          100% { transform: translateX(100%) skewX(12deg); }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        @keyframes pageEnter {
          0% { opacity: 0; transform: translateY(16px) scale(0.99); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-page-enter {
          animation: pageEnter 0.7s ease-out both;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
      <Navbar />
      <main className="animate-page-enter">
        <Hero />
        <ScreenshotCarousel />
        <CtaButtons />
        <Features />
        <Steps />
        <Pricing onOpenOrderForm={() => setIsOrderFormOpen(true)} />
        <DemoRequest />
        <FAQ />
        <ContactInfo />
      </main>
      <Footer onOpenPrivacyPolicy={() => setIsPrivacyPolicyOpen(true)} />
      
      {/* Modals */}
      <PrivacyPolicyModal isOpen={isPrivacyPolicyOpen} onClose={() => setIsPrivacyPolicyOpen(false)} />
      <OrderFormModal isOpen={isOrderFormOpen} onClose={() => setIsOrderFormOpen(false)} />

      {/* Sticky WhatsApp button */}
      <WhatsAppFloatButton />
    </div>
  );
}
