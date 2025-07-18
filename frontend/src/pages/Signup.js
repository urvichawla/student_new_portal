import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";

const API_BASE = 'http://localhost:5000/api';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess("");
    setError("");
    // Email validation: must be something@gmail.com
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(form.email)) {
      setError("Please enter a valid Gmail address (e.g., yourname@gmail.com)");
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/students/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Successfully registered! Please log in.');
        setTimeout(() => {
          setSuccess("");
          navigate('/profile');
        }, 2000);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-10"
        style={{ perspective: 1500 }}
      >
        <div className="relative group">
          <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.05] shadow-2xl overflow-hidden">
            <div className="text-center space-y-1 mb-5">
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">Create Account</h1>
              <p className="text-white/60 text-xs">Sign up to get started</p>
            </div>
            {success && (
              <Alert className="mb-4">
                <AlertTitle>Successfully registered!</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            {/* Only show one alert at a time: prioritize email validation error */}
            {error && (!success) && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>
                  {error.includes('gmail')
                    ? 'Invalid email address'
                    : error.includes('duplicate') || error.includes('exists')
                    ? 'Email already exists'
                    : 'Registration failed'}
                </AlertTitle>
                <AlertDescription>
                  {error.includes('gmail')
                    ? 'Please enter a valid Gmail address (e.g., yourname@gmail.com)'
                    : error.includes('duplicate') || error.includes('exists')
                    ? 'Email already exists'
                    : error}
                </AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 pr-3"
                />
              </div>
              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 pr-3"
                />
              </div>
              <div>
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 pr-3"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black font-medium h-10 rounded-lg flex items-center justify-center mt-5"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-black/70 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Sign Up</>
                )}
              </button>
              <p className="text-center text-xs text-white/60 mt-4">
                Already have an account?{' '}
                <Link to="/profile" className="text-white font-medium hover:underline">Sign in</Link>
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 