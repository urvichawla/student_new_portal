import AllStudentsTable from "@/components/ui/AllStudentsTable";

export default function AllStudentsPage() {
  return (
    <div className="min-h-screen bg-black py-10">
      <h1 className="text-2xl font-bold text-center mb-8 text-white">All Students</h1>
      <div className="max-w-3xl mx-auto">
        <AllStudentsTable />
      </div>
    </div>
  );
} 