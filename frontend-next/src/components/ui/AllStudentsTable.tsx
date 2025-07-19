"use client";

import React, { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

interface Student {
  _id: string;
  name: string;
  email: string;
  feesPaid: boolean;
}

export default function AllStudentsTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  // Fetch current user info for highlighting (if logged in)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${API_BASE}/students/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.email) setCurrentUserEmail(data.email);
      });
  }, []);

  // Fetch all students (public)
  const fetchStudents = () => {
    setLoading(true);
    setError("");
    fetch(`${API_BASE}/students/`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setStudents(data);
        else setError(data.error || "Failed to fetch students");
        setLoading(false);
      })
      .catch(() => {
        setError("Network error");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStudents();
    // Listen for localStorage changes (profile/fees update)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "profile-updated" || e.key === null) {
        fetchStudents();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (loading) return <div className="text-center py-10">Loading students...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full border border-gray-200 bg-white rounded-xl shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Fees Paid</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr
              key={student._id}
              className={
                currentUserEmail === student.email
                  ? "bg-blue-50 font-semibold"
                  : ""
              }
            >
              <td className="px-4 py-2 border-t">{student.name}</td>
              <td className="px-4 py-2 border-t">{student.email}</td>
              <td className="px-4 py-2 border-t">
                {student.feesPaid ? (
                  <span className="text-green-600 font-bold">Yes</span>
                ) : (
                  <span className="text-red-500 font-bold">No</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 