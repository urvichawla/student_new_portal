"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileStatus from "@/components/ui/ProfileStatus";

export default function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      router.replace("/profile");
    } else {
      setReady(true);
    }
  }, [searchParams, router]);

  if (!ready) {
    return <div className="flex justify-center items-center min-h-screen text-white">Loading...</div>;
  }

  return <ProfileStatus />;
} 