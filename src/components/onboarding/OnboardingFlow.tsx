import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  User,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { OnboardingStep, UserPreferences } from '../../types/app';
import { sound } from '../../utils/audio';

interface OnboardingFlowProps {
  onComplete: (prefs: UserPreferences) => void;
  onSkipToStore: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
  onSkipToStore,
}) => {
  const [step, setStep] = useState<OnboardingStep>('splash');
  const [videoMuted, setVideoMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Form states
  const [loginEmail, setLoginEmail] = useState('erictanner.webdesignmechanic@gmail.com');
  const [loginPassword, setLoginPassword] = useState('••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [regName, setRegName] = useState('Eric Tanner');
  const [regEmail, setRegEmail] = useState('erictanner.webdesignmechanic@gmail.com');
  const [regPhone, setRegPhone] = useState('+1 (555) 392-1084');
  const [regPassword, setRegPassword] = useState('Avignon2026!');
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});

  // OTP Verification digits
  const [otp, setOtp] = useState<string[]>(['8', '2', '9', '4', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('erictanner.webdesignmechanic@gmail.com');
  const [resetSent, setResetSent] = useState(false);

  // Personalization preferences
  const [selectedFit, setSelectedFit] = useState<'Relaxed' | 'Tailored' | 'Oversized'>('Relaxed');
  const [selectedEdits, setSelectedEdits] = useState<string[]>(['Knitwear', 'Outerwear', 'Tailoring']);
  const [notifsEnabled, setNotifsEnabled] = useState(true);
  const [newsletterEnabled, setNewsletterEnabled] = useState(true);

  // Auto transition from splash to video_intro after 2.8s
  useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => {
        setStep('video_intro');
        sound.tap();
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const goTo = (nextStep: OnboardingStep) => {
    sound.tap();
    setStep(nextStep);
  };

  const handleTogglePlayVideo = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!regName.trim()) errors.name = 'Please provide your full name';
    if (!regEmail.includes('@')) errors.email = 'Please provide a valid email';
    if (regPassword.length < 6) errors.password = 'Password must be at least 6 characters';
    if (Object.keys(errors).length > 0) {
      setRegErrors(errors);
      return;
    }
    setRegErrors({});
    goTo('verify');
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);
    if (val && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleCompletePreferences = () => {
    sound.success();
    onComplete({
      fit: selectedFit,
      preferredCategories: selectedEdits,
      notificationsEnabled: notifsEnabled,
      editorialNewsletter: newsletterEnabled,
    });
  };

  return (
    <div className="relative w-full h-full bg-[#0E0F12] text-neutral-100 flex flex-col justify-between overflow-hidden select-none">
      {/* Top Bar with Step Back & Skip to Store */}
      <div className="relative z-30 px-5 pt-2 pb-1 flex items-center justify-between text-xs text-neutral-400">
        {step !== 'splash' && step !== 'video_intro' ? (
          <button
            onClick={() => {
              if (step === 'welcome') goTo('video_intro');
              else if (step === 'story') goTo('welcome');
              else if (step === 'walkthrough') goTo('story');
              else if (step === 'login') goTo('walkthrough');
              else if (step === 'register') goTo('login');
              else if (step === 'verify') goTo('register');
              else if (step === 'forgot_password') goTo('login');
              else if (step === 'preferences') goTo('verify');
            }}
            className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors py-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={onSkipToStore}
          className="text-[11px] font-medium tracking-wide uppercase text-neutral-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-full border border-white/10"
        >
          Skip to Store →
        </button>
      </div>

      {/* Main Multi-Screen Switcher */}
      <div className="relative flex-1 w-full overflow-y-auto no-scrollbar flex flex-col">
        <AnimatePresence mode="wait">
          {/* 1. Splash Screen */}
          {step === 'splash' && (
            <motion.div
              key="splash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="flex-1 flex flex-col items-center justify-center px-8 text-center"
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="w-24 h-24 mb-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-center p-3 shadow-2xl"
              >
                <img
                  src="https://avignonusa.com/wp-content/uploads/2026/09/avignon-mark-dark.png"
                  alt="Avignon USA Mark"
                  className="w-full h-full object-contain filter invert opacity-95"
                />
              </motion.div>

              <motion.h1
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="font-editorial text-3xl font-normal tracking-wide text-white mb-2"
              >
                AVIGNON USA
              </motion.h1>

              <motion.p
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-medium"
              >
                American Character · European Restraint
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="mt-12 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-ping" />
                <span className="text-[11px] text-neutral-500 tracking-wider">Atelier FW 2026</span>
              </motion.div>
            </motion.div>
          )}

          {/* 2. Cinematic Video Presentation */}
          {step === 'video_intro' && (
            <motion.div
              key="video_intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative flex-1 flex flex-col justify-between overflow-hidden"
            >
              {/* Background Video */}
              <div className="absolute inset-0 z-0">
                <video
                  ref={videoRef}
                  src="https://avignonusa.com/wp-content/uploads/2026/09/Models_walking_in_urban_environment_20260929110848-1.mp4"
                  poster="https://avignonusa.com/wp-content/uploads/2026/10/hero-video-poster.webp"
                  autoPlay
                  loop
                  muted={videoMuted}
                  playsInline
                  className="w-full h-full object-cover brightness-[0.78]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
              </div>

              {/* Video Controls overlay */}
              <div className="relative z-10 px-5 pt-3 flex justify-between items-center">
                <div className="text-[10px] tracking-widest uppercase font-mono text-neutral-300 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                  FW 2026 · Film
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setVideoMuted(!videoMuted)}
                    className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white"
                  >
                    {videoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleTogglePlayVideo}
                    className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white"
                  >
                    <Play className={`w-3.5 h-3.5 fill-current ${isVideoPlaying ? 'opacity-50' : 'opacity-100'}`} />
                  </button>
                </div>
              </div>

              {/* Bottom Video Narrative */}
              <div className="relative z-10 px-6 pb-6 text-center">
                <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-1">
                  Avignon Motion Presentation
                </p>
                <h2 className="font-editorial text-2xl text-white font-normal mb-3">
                  Models in Urban Motion
                </h2>
                <p className="text-xs text-neutral-300 leading-relaxed max-w-xs mx-auto mb-6">
                  Experience modern silhouettes, honest Italian wools, and architectural drape cut for contemporary city living.
                </p>

                <button
                  onClick={() => goTo('welcome')}
                  className="w-full h-12 rounded-xl bg-white text-neutral-900 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-xl"
                >
                  <span>Discover the Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* 3. Welcome Screen */}
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-between px-6 pb-6 pt-4"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] w-full border border-white/10 shadow-2xl">
                <img
                  src="/src/assets/images/editorial_onboarding_look_1793406475024.jpg"
                  alt="Avignon Look"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400">Atelier Lookbook</span>
                  <h3 className="font-editorial text-xl text-white">The Double-Faced Collar Jacket</h3>
                </div>
              </div>

              <div className="pt-4 text-center">
                <h2 className="font-editorial text-2xl text-white mb-2">
                  Welcome to Avignon USA
                </h2>
                <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                  An uncompromising dialogue between American casual ease and European sartorial rigor.
                </p>

                <button
                  onClick={() => goTo('story')}
                  className="w-full h-12 rounded-xl bg-white text-neutral-900 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-lg"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* 4. Brand Story: "Fewer things. Better made. Worn often." */}
          {step === 'story' && (
            <motion.div
              key="story"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-between px-6 pb-6 pt-2"
            >
              <div className="space-y-4 pt-4">
                <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 font-semibold">
                  01 · The Philosophy
                </span>
                <h2 className="font-editorial text-3xl text-white leading-tight">
                  Fewer things.<br />
                  Better made.<br />
                  <span className="italic text-neutral-400">Worn often.</span>
                </h2>
                <div className="h-px w-12 bg-neutral-700 my-4" />
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Every Avignon collection starts with the same question: will you still reach for it in five years?
                </p>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  The answer shapes everything — dense, honest fabrics, proportions that sit easily on the body and a palette quiet enough to mix without thinking.
                </p>

                <div className="grid grid-cols-3 gap-2 pt-4">
                  <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
                    <span className="text-lg font-editorial text-white">4</span>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">Edits</p>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
                    <span className="text-lg font-editorial text-white">100%</span>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">Organic</p>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
                    <span className="text-lg font-editorial text-white">5+ Yr</span>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">Wear</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => goTo('walkthrough')}
                  className="w-full h-12 rounded-xl bg-white text-neutral-900 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-lg"
                >
                  <span>Explore App Features</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* 5. Onboarding Shopping Experience Walkthrough */}
          {step === 'walkthrough' && (
            <motion.div
              key="walkthrough"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-between px-6 pb-6 pt-2"
            >
              <div className="pt-2">
                <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 font-semibold">
                  02 · The Experience
                </span>
                <h2 className="font-editorial text-2xl text-white mt-1 mb-4">
                  Crafted for iPhone 18
                </h2>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800/80 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Curated Capsule Drops</h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Priority access to small-batch seasonal releases before public storefront releases.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800/80 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-200 shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Bespoke Fit Intelligence</h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Exact garment measurements in both Imperial and Metric with tailor alterations guidance.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800/80 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">White-Glove Courier</h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Complimentary DHL express delivery with real-time route telemetry & hassle-free returns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <button
                  onClick={() => goTo('login')}
                  className="w-full h-12 rounded-xl bg-white text-neutral-900 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-lg"
                >
                  <span>Sign In / Join</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onSkipToStore}
                  className="w-full h-10 rounded-xl bg-transparent text-neutral-400 hover:text-white text-xs font-medium tracking-wide transition-colors"
                >
                  Continue as Guest
                </button>
              </div>
            </motion.div>
          )}

          {/* 6. Login Screen */}
          {step === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-between px-6 pb-6 pt-2"
            >
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 font-semibold">
                  Account
                </span>
                <h2 className="font-editorial text-2xl text-white mt-1 mb-1">
                  Welcome Back
                </h2>
                <p className="text-xs text-neutral-400 mb-5">
                  Sign in to access your atelier orders, private wishlist, and VIP reservations.
                </p>

                {/* Apple Sign-In Button */}
                <button
                  onClick={() => goTo('preferences')}
                  className="w-full h-12 rounded-xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.98] transition-all mb-4 shadow"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.3-9.66-11.08-20.48-14.33-32.44-3.26-11.97-4.89-23.27-4.89-33.91 0-14.35 3.69-26.21 11.07-35.58 7.38-9.36 16.51-14.12 27.4-14.28 4.8 0 10.11 1.25 15.94 3.75 5.82 2.5 9.77 3.86 11.84 4.08 1.74-.22 5.82-1.63 12.24-4.25 6.42-2.61 11.97-3.8 16.66-3.58 12.63.65 22.84 5.34 30.64 14.07-11.08 6.74-16.51 16.09-16.3 28.05.22 9.57 3.81 17.62 10.77 24.15 6.96 6.52 15.12 10.33 24.47 11.42-2.39 7.39-5.33 15.01-8.81 22.86zM119.22 31.81c0-7.39 2.61-14.35 7.83-20.88 5.22-6.52 11.64-10.43 19.25-11.74.87 7.61-1.63 14.79-7.51 21.53-5.87 6.74-12.39 10.55-19.57 11.09z"/>
                  </svg>
                  <span>Sign in with Apple</span>
                </button>

                <div className="flex items-center gap-3 my-3">
                  <div className="h-px flex-1 bg-neutral-800" />
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500">or email</span>
                  <div className="h-px flex-1 bg-neutral-800" />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full h-11 pl-9 pr-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500"
                        placeholder="you@domain.com"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-[11px] font-medium text-neutral-400">Password</label>
                      <button
                        onClick={() => goTo('forgot_password')}
                        className="text-[11px] text-neutral-400 hover:text-white transition-colors"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full h-11 pl-9 pr-10 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500"
                        placeholder="Your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <button
                  onClick={() => goTo('preferences')}
                  className="w-full h-12 rounded-xl bg-white text-neutral-900 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-lg"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-center pt-1">
                  <span className="text-[11px] text-neutral-400">New to Avignon? </span>
                  <button
                    onClick={() => goTo('register')}
                    className="text-[11px] font-semibold text-white hover:underline"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 7. Create Account Screen */}
          {step === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-between px-6 pb-6 pt-2"
            >
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 font-semibold">
                  Membership
                </span>
                <h2 className="font-editorial text-2xl text-white mt-1 mb-1">
                  Create Account
                </h2>
                <p className="text-xs text-neutral-400 mb-4">
                  Join the Avignon Atelier for seasonal drops and personalized sizing records.
                </p>

                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className={`w-full h-11 pl-9 pr-3 rounded-xl bg-neutral-900 border ${
                          regErrors.name ? 'border-rose-500' : 'border-neutral-800'
                        } text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500`}
                        placeholder="Eric Tanner"
                      />
                    </div>
                    {regErrors.name && <p className="text-[10px] text-rose-400 mt-1">{regErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className={`w-full h-11 pl-9 pr-3 rounded-xl bg-neutral-900 border ${
                          regErrors.email ? 'border-rose-500' : 'border-neutral-800'
                        } text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500`}
                        placeholder="you@domain.com"
                      />
                    </div>
                    {regErrors.email && <p className="text-[10px] text-rose-400 mt-1">{regErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">Mobile (for courier alerts)</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full h-11 pl-9 pr-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className={`w-full h-11 pl-9 pr-3 rounded-xl bg-neutral-900 border ${
                          regErrors.password ? 'border-rose-500' : 'border-neutral-800'
                        } text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500`}
                        placeholder="At least 6 characters"
                      />
                    </div>
                    {regErrors.password && <p className="text-[10px] text-rose-400 mt-1">{regErrors.password}</p>}
                  </div>
                </form>
              </div>

              <div className="space-y-2 pt-4">
                <button
                  onClick={handleRegisterSubmit}
                  className="w-full h-12 rounded-xl bg-white text-neutral-900 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-lg"
                >
                  <span>Continue to Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-center pt-1">
                  <span className="text-[11px] text-neutral-400">Already registered? </span>
                  <button
                    onClick={() => goTo('login')}
                    className="text-[11px] font-semibold text-white hover:underline"
                  >
                    Log In
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 8. Phone / Email Verification Screen (OTP) */}
          {step === 'verify' && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-between px-6 pb-6 pt-2"
            >
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 font-semibold">
                  Security
                </span>
                <h2 className="font-editorial text-2xl text-white mt-1 mb-1">
                  Verify Code
                </h2>
                <p className="text-xs text-neutral-400 mb-6">
                  We sent a 6-digit atelier authorization code to <span className="text-white font-mono">{regEmail}</span>.
                </p>

                {/* OTP 6-box input */}
                <div className="flex justify-between gap-2 max-w-[280px] mx-auto my-6">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-10 h-12 rounded-xl bg-neutral-900 border border-neutral-700 text-center text-lg font-mono font-bold text-white focus:outline-none focus:border-amber-300 transition-colors"
                    />
                  ))}
                </div>

                <div className="text-center">
                  <button
                    onClick={() => {
                      setOtp(['8', '2', '9', '4', '1', '0']);
                      sound.tap();
                    }}
                    className="text-[11px] text-neutral-400 hover:text-white flex items-center justify-center gap-1 mx-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resend Code (54s)</span>
                  </button>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => goTo('preferences')}
                  className="w-full h-12 rounded-xl bg-white text-neutral-900 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-lg"
                >
                  <span>Verify & Personalize</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* 9. Forgot Password Screen */}
          {step === 'forgot_password' && (
            <motion.div
              key="forgot_password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-between px-6 pb-6 pt-2"
            >
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 font-semibold">
                  Recovery
                </span>
                <h2 className="font-editorial text-2xl text-white mt-1 mb-1">
                  Reset Password
                </h2>
                <p className="text-xs text-neutral-400 mb-6">
                  Enter your email address and we will dispatch a secure reset link to your inbox.
                </p>

                {resetSent ? (
                  <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80 flex items-center justify-center mx-auto">
                      <Check className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-semibold text-white">Reset Link Dispatched</h4>
                    <p className="text-[11px] text-neutral-400">
                      Check your email ({forgotEmail}) for immediate password instructions.
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full h-11 pl-9 pr-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500"
                        placeholder="you@domain.com"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-4">
                {resetSent ? (
                  <button
                    onClick={() => goTo('login')}
                    className="w-full h-12 rounded-xl bg-white text-neutral-900 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-lg"
                  >
                    <span>Back to Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      sound.tap();
                      setResetSent(true);
                    }}
                    className="w-full h-12 rounded-xl bg-white text-neutral-900 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-lg"
                  >
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => goTo('login')}
                  className="w-full h-10 rounded-xl bg-transparent text-neutral-400 hover:text-white text-xs font-medium tracking-wide transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {/* 10. Personalization and Preferences Screen */}
          {step === 'preferences' && (
            <motion.div
              key="preferences"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-between px-6 pb-6 pt-2"
            >
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 font-semibold">
                    Tailored For You
                  </span>
                  <h2 className="font-editorial text-2xl text-white mt-1 mb-1">
                    Your Style Profile
                  </h2>
                  <p className="text-xs text-neutral-400">
                    We calibrate product recommendations and sizing based on your silhouette preferences.
                  </p>
                </div>

                {/* Silhouette Fit Selection */}
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Preferred Fit Silhouette
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Relaxed', 'Tailored', 'Oversized'] as const).map((fit) => (
                      <button
                        key={fit}
                        type="button"
                        onClick={() => {
                          setSelectedFit(fit);
                          sound.tap();
                        }}
                        className={`h-11 rounded-xl text-xs font-medium transition-all ${
                          selectedFit === fit
                            ? 'bg-white text-neutral-900 shadow-md font-semibold'
                            : 'bg-neutral-900/80 text-neutral-400 border border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        {fit}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seasonal Edits Preference */}
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Favorite Edits (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Knitwear', 'Outerwear', 'Tailoring', 'The Weekend'].map((edit) => {
                      const isSelected = selectedEdits.includes(edit);
                      return (
                        <button
                          key={edit}
                          type="button"
                          onClick={() => {
                            sound.tap();
                            if (isSelected) {
                              setSelectedEdits(selectedEdits.filter((e) => e !== edit));
                            } else {
                              setSelectedEdits([...selectedEdits, edit]);
                            }
                          }}
                          className={`p-3 rounded-xl text-left border transition-all ${
                            isSelected
                              ? 'bg-neutral-800/90 border-neutral-400 text-white'
                              : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-400 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">{edit}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notifications & Editorial consent */}
                <div className="pt-2 space-y-2 border-t border-neutral-800/80">
                  <label className="flex items-center justify-between text-xs text-neutral-300 cursor-pointer py-1">
                    <span>Drop alerts & courier status</span>
                    <input
                      type="checkbox"
                      checked={notifsEnabled}
                      onChange={(e) => setNotifsEnabled(e.target.checked)}
                      className="w-4 h-4 accent-white rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between text-xs text-neutral-300 cursor-pointer py-1">
                    <span>Avignon Gazette editorial stories</span>
                    <input
                      type="checkbox"
                      checked={newsletterEnabled}
                      onChange={(e) => setNewsletterEnabled(e.target.checked)}
                      className="w-4 h-4 accent-white rounded"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleCompletePreferences}
                  className="w-full h-12 rounded-xl bg-white text-neutral-900 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-lg"
                >
                  <span>Enter Avignon Store</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
