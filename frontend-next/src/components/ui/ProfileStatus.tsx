"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { motion } from 'framer-motion';
import { Alert, AlertTitle, AlertDescription } from "./alert";
import { CreditCardDialog } from "./CreditCardDialog";

// Autofill fix for white text
const autofillStyle = `
  input:-webkit-autofill,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:active {
    -webkit-text-fill-color: #fff !important;
    caret-color: #fff !important;
    box-shadow: 0 0 0 1000px rgba(0,0,0,0.2) inset !important;
    background-clip: content-box !important;
  }
`;

// Force white text and placeholder in pay fees form
const payFeesFormStyle = `
  .pay-fees-form input,
  .pay-fees-form input::placeholder {
    color: #fff !important;
    -webkit-text-fill-color: #fff !important;
    caret-color: #fff !important;
    opacity: 1 !important;
  }
`;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';
type Student = {
  name: string;
  email: string;
  feesPaid: boolean;
  // add other properties if needed
};

export default function ProfileStatus() {
  const router = useRouter();
 
  const [student, setStudent] = useState<Student | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({ card: '', amount: '' });
  const [paying, setPaying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const cardInputRef = useRef<HTMLInputElement | null>(null);
const amountInputRef = useRef<HTMLInputElement | null>(null);
  const [showCreditDialog, setShowCreditDialog] = useState(false);

  useEffect(() => {
    async function fetchStudent() {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace("/sign-in");
        return;
      }
      const res = await fetch(`${API_BASE}/students/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.error) {
        router.replace("/sign-in");
        return;
      }
      setStudent(data);
      setForm({ name: data.name, email: data.email });
      setLoading(false);
    }
    fetchStudent();
  }, [router]);

  useEffect(() => {
    if (cardInputRef.current) {
      cardInputRef.current.style.color = '#fff';
      cardInputRef.current.style.caretColor = '#fff';
      cardInputRef.current.style.background = 'rgba(255,255,255,0.08)';
      cardInputRef.current.setAttribute('autocomplete', 'off');
      cardInputRef.current.style.setProperty('color', '#fff', 'important');
      cardInputRef.current.style.setProperty('background-color', 'rgba(255,255,255,0.08)', 'important');
    }
    if (amountInputRef.current) {
      amountInputRef.current.style.color = '#fff';
      amountInputRef.current.style.caretColor = '#fff';
      amountInputRef.current.style.background = 'rgba(255,255,255,0.08)';
      amountInputRef.current.setAttribute('autocomplete', 'off');
      amountInputRef.current.style.setProperty('color', '#fff', 'important');
      amountInputRef.current.style.setProperty('background-color', 'rgba(255,255,255,0.08)', 'important');
    }
  }, [showPayment]);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setForm({
      name: student?.name || "",
      email: student?.email || ""
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      alert('Name and email cannot be empty.');
      return;
    }
    setSaving(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/students/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && !data.error) {
        setStudent(data);
        setEditMode(false);
        setSuccess("Your changes have been updated successfully.");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        alert('Error updating profile: ' + (data.error || 'Unknown error'));
      }
    } catch {
      alert('Network error while updating profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePayFees = () => setShowCreditDialog(true);
  const handleCreditPay = async (details: { cardHolder: string; cardNumber: string; expiry: string; cvc: string }) => {
    setPaying(true);
    setSuccess("");
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_BASE}/students/me/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(details),
      });
      const res = await fetch(`${API_BASE}/students/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStudent(data);
      setShowCreditDialog(false);
      setSuccess("Fees paid successfully");
    } catch {
      // Optionally handle error
    } finally {
      setPaying(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen text-white">Loading...</div>;
  if (!student) return <div className="flex justify-center items-center min-h-screen text-white">No student data found or you are not logged in.</div>;

  return (
    <>
      <style>{autofillStyle}</style>
      <style>{payFeesFormStyle}</style>
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
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">Your Profile</h1>
                <p className="text-white/60 text-xs">View and edit your details, and pay your fees below.</p>
              </div>
              {success && (
                <Alert className="mb-4">
                  <AlertTitle>Profile updated successfully!</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              <div className="flex justify-end mb-4">
                <Button
                  onClick={handleLogout}
                  className="bg-white !text-black border border-gray-300 shadow hover:bg-gray-100 font-semibold px-4 py-2 rounded transition"
                  style={{ color: "#000" }}
                >
                  Logout
                </Button>
              </div>
              <form onSubmit={editMode ? handleSave : e => e.preventDefault()} className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-white">Name</Label>
                  {editMode ? (
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 pr-3"
                    />
                  ) : (
                    <div className="px-3 py-2 rounded bg-muted text-white border border-input">{student.name}</div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  {editMode ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 pr-3"
                    />
                  ) : (
                    <div className="px-3 py-2 rounded bg-muted text-white border border-input">{student.email}</div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label className="text-white">Fees Paid</Label>
                  <span className={student.feesPaid ? 'text-green-500' : 'text-red-500'}>
                    {student.feesPaid ? 'Yes' : 'No'}
                  </span>
                </div>
                {editMode && (
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-white text-black font-medium h-10 rounded-lg flex items-center justify-center mt-5"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                )}
              </form>
              <div className="flex gap-2 mt-2">
                {!editMode && (
                  <button
                    type="button"
                    className="w-full bg-white text-black font-medium h-10 rounded-lg flex items-center justify-center mt-5"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                )}
                {editMode && (
                  <button
                    type="button"
                    className="w-full bg-transparent text-white font-medium h-10 rounded-lg border border-white hover:bg-white/10 flex items-center justify-center mt-5 transition"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                )}
              </div>
              {showPayment && (
                <form onSubmit={e => {
                  e.preventDefault();
                  handleCreditPay({
                    cardHolder: paymentDetails.card,
                    cardNumber: paymentDetails.card,
                    expiry: paymentDetails.amount, // Assuming expiry is amount for simplicity
                    cvc: paymentDetails.amount, // Assuming cvc is amount for simplicity
                  });
                }} className="pay-fees-form mt-6 flex flex-col gap-6">
                  {/* {payError && (
                    <div className="mb-2 bg-red-500/10 border border-red-500/30 rounded p-3 text-red-400">
                      <div className="font-semibold mb-1">Error</div>
                      <div>{payError}</div>
                    </div>
                  )} */}
                  <div className="grid gap-2">
                    <Label htmlFor="card" className="text-white">Card Number</Label>
                    <Input
                      id="card"
                      name="card"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={paymentDetails.card}
                      onChange={e => {
                        // Only allow numbers
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setPaymentDetails(d => ({ ...d, card: val }));
                      }}
                      onKeyDown={e => {
                        // Prevent non-numeric input
                        if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      required
                      placeholder="Enter card number"
                      className="w-full border-transparent focus:border-white/20 h-10 pr-3"
                      style={{ color: '#fff', caretColor: '#fff', background: 'rgba(255,255,255,0.08)' }}
                      ref={cardInputRef}
                    />
                    <span className="text-xs text-gray-400 mt-1">Only numbers allowed.</span>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount" className="text-white">Amount</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={paymentDetails.amount}
                      onChange={e => {
                        // Only allow numbers
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setPaymentDetails(d => ({ ...d, amount: val }));
                      }}
                      onKeyDown={e => {
                        // Prevent non-numeric input
                        if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      required
                      placeholder="Enter amount"
                      className="w-full border-transparent focus:border-white/20 h-10 pr-3"
                      style={{ color: '#fff', caretColor: '#fff', background: 'rgba(255,255,255,0.08)' }}
                      ref={amountInputRef}
                    />
                    <span className="text-xs text-gray-400 mt-1">Only numbers allowed.</span>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-white text-black font-medium h-10 rounded-lg flex items-center justify-center mt-5"
                    disabled={paying}
                  >
                    {paying ? 'Paying...' : 'Pay Now'}
                  </button>
                  <button
                    type="button"
                    className="w-full bg-transparent text-white font-medium h-10 rounded-lg border border-white hover:bg-white/10 flex items-center justify-center mt-5 transition"
                    onClick={() => setShowPayment(false)}
                  >
                    Cancel
                  </button>
                </form>
              )}
              <div className="flex-col gap-2 mt-2">
                {!student.feesPaid && !showPayment && (
                  <button
                    type="button"
                    className="w-full bg-white text-black font-medium h-10 rounded-lg flex items-center justify-center mt-5"
                    onClick={handlePayFees}
                  >
                    Pay Fees
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Credit Card Dialog */}
      <CreditCardDialog
        open={showCreditDialog}
        onClose={() => setShowCreditDialog(false)}
        onPay={handleCreditPay}
        loading={paying}
      />
    </>
  );
} 