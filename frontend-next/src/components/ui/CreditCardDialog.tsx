"use client";

import React, { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { CreditCard } from "lucide-react";

export function CreditCardDialog({ open, onClose, onPay, loading }: {
  open: boolean;
  onClose: () => void;
  onPay: (details: { cardHolder: string; cardNumber: string; expiry: string; cvc: string }) => void;
  loading?: boolean;
}) {
  const [form, setForm] = useState({
    cardHolder: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cardHolder || !form.cardNumber || !form.expiry || !form.cvc) {
      setError("All fields are required.");
      return;
    }
    setError("");
    onPay(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-2">Pay Fees</h2>
        <p className="text-gray-500 mb-4 text-sm">Enter your credit card details to pay your fees.</p>
        {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="cardHolder">Card Holder*</Label>
            <Input
              id="cardHolder"
              name="cardHolder"
              placeholder="Card Holder Name"
              value={form.cardHolder}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="cardNumber">Card Number*</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="Card number"
                value={form.cardNumber}
                onChange={handleChange}
                required
                className="pl-8"
              />
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="expiry">Expiration (MM/YY)*</Label>
              <Input
                id="expiry"
                name="expiry"
                placeholder="MM/YY"
                value={form.expiry}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="cvc">CVC*</Label>
              <Input
                id="cvc"
                name="cvc"
                placeholder="CVC"
                value={form.cvc}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="button" className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Paying..." : "Pay Fees"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 