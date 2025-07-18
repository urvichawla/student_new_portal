import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:5000/api';

export default function AllStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setStudents(data);
        } else {
          setError(data.error || 'Failed to fetch students');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-screen text-white">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center pt-24">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-10 tracking-tight drop-shadow-lg">All Students</h1>
      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="min-w-full bg-black/80 text-white rounded-2xl shadow-2xl overflow-hidden text-lg md:text-xl">
          <thead>
            <tr className="bg-gradient-to-r from-blue-900/80 to-blue-700/60">
              <th className="px-8 py-4 text-left font-bold uppercase tracking-wider">Name</th>
              <th className="px-8 py-4 text-left font-bold uppercase tracking-wider">Email</th>
              <th className="px-8 py-4 text-left font-bold uppercase tracking-wider">Fees Paid</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <tr key={student._id} className={
                `border-b border-white/10 ${idx % 2 === 0 ? 'bg-white/5' : 'bg-black/40'} hover:bg-blue-900/30 transition-colors`
              }>
                <td className="px-8 py-4 font-semibold">{student.name}</td>
                <td className="px-8 py-4">{student.email}</td>
                <td className="px-8 py-4">
                  {student.feesPaid ? (
                    <span className="text-green-400 font-bold">Yes</span>
                  ) : (
                    <span className="text-red-400 font-bold">No</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 