"use client";

import React, { useEffect, useState } from "react";

function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={
        "w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm " +
        (className || "")
      }
      {...props}
    />
  );
}

type User = {
  name: string;
  email: string;
  feesPaid: boolean;
};

const API_BASE = "http://localhost:5000/api";

function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

export default function ProfileCard() {
  const [student, setStudent] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paying, setPaying] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      const token = getToken();
      if (!token) {
        setError("Not authenticated. Please sign in.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/students/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to fetch user info");
        } else {
          setStudent(data);
          setForm({ name: data.name || "", email: data.email || "" });
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleEdit = () => setEditMode(true);

  const handleCancel = () => {
    setEditMode(false);
    if (student) setForm({ name: student.name, email: student.email });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      alert('Name and email cannot be empty.');
      return;
    }
    setSaving(true);
    const token = getToken();
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
    } catch (err) {
      alert('Network error while updating profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePayNow = async () => {
    setPaying(true);
    setError("");
    setSuccess("");
    const token = getToken();
    if (!token) {
      setError("Not authenticated. Please sign in.");
      setPaying(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/students/me/pay`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Payment failed");
      } else {
        setStudent(data.student);
        setSuccess("Fees paid successfully");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setPaying(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/sign-in";
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center h-96 text-red-500">{error}</div>;
  }
  if (!student) {
    return null;
  }

  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8 mt-10 z-50 relative">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
        >
          Logout
        </button>
      </div>
      <form onSubmit={handleSave}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          {editMode ? (
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mb-2"
            />
          ) : (
            <div className="text-lg">{student.name}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          {editMode ? (
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mb-2"
            />
          ) : (
            <div className="text-lg">{student.email}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Fees Paid</label>
          <div className="text-lg">
            {student.feesPaid ? (
              <span className="text-green-600 font-semibold">Yes</span>
            ) : (
              <span className="text-red-600 font-semibold">No</span>
            )}
          </div>
        </div>
        {success && <div className="text-green-600 mb-2">{success}</div>}
        {editMode ? (
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit
            </button>
            {!student.feesPaid && (
              <button
                type="button"
                onClick={handlePayNow}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                disabled={paying}
              >
                {paying ? "Paying..." : "Pay Now"}
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
} 