import { SquaresDemo } from "@/components/ui/SquaresDemo";
import { SparklesText } from "@/components/ui/sparkles-text";
import { NavBarDemo } from "@/components/ui/tubelight-navbar";

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen">
      <div className="z-10 pt-32">
        <SparklesText text="Welcome to Students Portal" />
      </div>
      <SquaresDemo />
      <NavBarDemo />
    </main>
  );
}
