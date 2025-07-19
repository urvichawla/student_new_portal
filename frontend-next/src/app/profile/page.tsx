"use client";
import { Suspense } from "react";
import ProfilePageContent from "./ProfilePageContent";

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen text-white">Loading...</div>}>
      <ProfilePageContent />
    </Suspense>
  );
} 