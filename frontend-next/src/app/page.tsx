import { SquaresDemo } from "@/components/ui/SquaresDemo";
import { SparklesText } from "@/components/ui/sparkles-text";
import { NavBarDemo } from "@/components/ui/tubelight-navbar";

export default function Home() {
  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen">
      {/* Main heading */}
      <SparklesText text="Welcome to Students Portal" className="text-4xl md:text-6xl font-bold text-white mb-4" />
      {/* Subheading */}
      <p className="text-lg md:text-xl text-white/80 mb-8 text-center max-w-xl">
        Manage your profile, pay fees, and access student services hassle-free.
      </p>
      <SquaresDemo />
      <NavBarDemo />
    </main>
  );
}
