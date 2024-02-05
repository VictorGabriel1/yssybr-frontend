"use client";

import { io } from "socket.io-client";
import { useCallback, useEffect, useState } from "react";

type Process = {
  name: string;
  n_processes: number;
  pid: number;
  date: string;
};

type ProcessTableProps = {
  type: "processesStarted" | "processesEnded";
};

export default function ProcessesTable({ type }: ProcessTableProps) {
  const [processes, setProcesses] = useState<Process[]>([]);

  const setProcessesCallback = useCallback(
    (newProcess: Process) => {
      setProcesses((prev) => {
        // Verifica se já existe um objeto com o mesmo "name" e "startTime"
        const existingProcessIndex = prev.findIndex(
          (process) =>
            process.name === newProcess.name && process.date === newProcess.date
        );

        if (existingProcessIndex !== -1) {
          // Se já existir, incrementa a propriedade "processes" em 1
          const updatedProcesses = [...prev];
          updatedProcesses[existingProcessIndex].n_processes += 1;
          return updatedProcesses;
        } else {
          // Se não existir, adiciona um novo objeto com "processes" igual a 1
          return [...prev, { ...newProcess, n_processes: 1 }];
        }
      });

      console.log(newProcess);
    },
    [setProcesses]
  );

  useEffect(() => {
    const socket = io("http://localhost:8000");
    socket.on(type, (newProcess) => setProcessesCallback(newProcess));

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="w-[500px] h-[500px] m-5 overflow-y-auto">
      <table className="w-full">
        <thead className="sticky  top-0 bg-purple-950">
          <tr>
            <th className="p-2 border-l-2 border-gray-400">Name</th>
            <th className="p-2 border-x-2 border-gray-400">Date</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((process, index) => (
            <tr
              key={`table-${type}-${index}`}
              className="border border-gray-400"
            >
              <td className="border-2 border-gray-400 p-2">
                {process.name} ({process.n_processes})
              </td>
              <td className="border-2 border-gray-400 p-2">{process.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
