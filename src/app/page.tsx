import PlannerBoard from "@/components/planner/PlannerBoard";

export default function Home() {
  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">Weekly Planner</h1>
          <p className="text-gray-500">Organize your nutrition, effortlessly.</p>
        </div>
      </div>

      <div className="min-h-[600px]">
        <PlannerBoard />
      </div>
    </div>
  );
}
