import ProcessesTable from "@/components/processesTable";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-20">
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-violet-950 p-6 rounded-lg w-full max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between mb-4">
            <div className="w-full md:w-1/2 mb-4 md:mb-0">
              <h2 className="text-lg font-bold mb-4 text-center">
                Processes Started
              </h2>
              <ProcessesTable type="processesStarted" />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-lg font-bold mb-4 text-center">
                Processes Ended
              </h2>
              <ProcessesTable type="processesEnded" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
