import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeClosed, ArrowRight } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";


function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      className={`file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ${className || ''}`}
      {...props}
    />
  );
}

export default function Profile() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // 3D card effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsLoading(false);
        navigate('/profile-status');
      } else {
        setIsLoading(false);
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Network error');
    }
  };

  // TODO: Add Google login handler

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    console.log('Token from URL:', token);
    if (token) {
      localStorage.setItem('token', token);
      console.log('Token set in localStorage:', localStorage.getItem('token'));
      // Optionally fetch user info and store it
      fetch('http://localhost:5000/api/students/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(user => {
          localStorage.setItem('user', JSON.stringify(user));
          navigate('/profile-status');
        })
        .catch(() => {
          navigate('/profile-status');
        });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen w-screen bg-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-10"
        style={{ perspective: 1500 }}
      >
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>
              {error === "Invalid credentials" ? "Invalid credentials" : "Error"}
            </AlertTitle>
            {error !== "Invalid credentials" && (
              <AlertDescription>{error}</AlertDescription>
            )}
          </Alert>
        )}
        <motion.div
          className="relative"
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ z: 10 }}
        >
          <div className="relative group">
            <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.05] shadow-2xl overflow-hidden">
              <div className="text-center space-y-1 mb-5">
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"></span>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">Welcome Back</h1>
                <p className="text-white/60 text-xs">Sign in to continue</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <Mail className={`absolute left-3 w-4 h-4 ${focusedInput === "email" ? 'text-white' : 'text-white/40'}`} />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedInput("email")}
                      onBlur={() => setFocusedInput(null)}
                      className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 pl-10 pr-3"
                    />
                  </div>
                  <div className="relative">
                    <Lock className={`absolute left-3 w-4 h-4 ${focusedInput === "password" ? 'text-white' : 'text-white/40'}`} />
                    <Input
                      type={"password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedInput("password")}
                      onBlur={() => setFocusedInput(null)}
                      className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 pl-10 pr-10"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  {/* Removed Remember me checkbox and label */}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-black font-medium h-10 rounded-lg flex items-center justify-center mt-5"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-black/70 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </>
                  )}
                </button>
                <div className="relative mt-2 mb-5 flex items-center">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="mx-3 text-xs text-white/40">or</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>
                <button
  type="button"
  className="w-full bg-white/5 text-white font-medium h-10 rounded-lg border border-white/10 hover:border-white/20 flex items-center justify-center gap-2"
  onClick={() => window.location.href = "http://localhost:5000/api/auth/google"}
>
  <span className="w-4 h-4 flex items-center justify-center text-white/80">G</span>
  <span className="text-white/80 text-xs">Sign in with Google</span>
</button>
                <p className="text-center text-xs text-white/60 mt-4">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-white font-medium hover:underline">Sign up</Link>
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
