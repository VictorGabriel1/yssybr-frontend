# Monitor de Processos em Tempo Real com Socket.IO - Frontend Next.js

Este projeto de frontend [Next.js](https://nextjs.org/docs) se conecta ao servidor Socket.io via [Socket.IO Client](https://socket.io/docs/v4/client-api/) para exibir informações em tempo real sobre os processos iniciados e encerrados. Utiliza a biblioteca ps-list para obter informações sobre os processos, no back-end já criado, disponível em outro dos meus repositórios([yssysbr-backend](https://github.com/VictorGabriel1/yssys-backend)).

## Como Rodar o Projeto

1. **Instalação de Dependências:**
   Certifique-se de ter o Node.js instalado em seu ambiente. Execute o seguinte comando para instalar as dependências do projeto:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

2. **Execução do Servidor Next.js:**
   Inicie o servidor Next.js executando o seguinte comando:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

   O servidor estará disponível na porta padrão do Next.js (geralmente 3000).

3. **Execução do Servidor Socket.IO:**
   Vá até o repostório [yssysbr-backend](https://github.com/VictorGabriel1/yssys-backend), e siga as instruções de como rodar.

## Página Principal (src/app/page.tsx)

A página principal exibe duas tabelas, uma para processos iniciados e outra para processos encerrados. Cada tabela é alimentada pelos eventos emitidos pelo servidor Socket.IO.

```tsx
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
```

## Componente ProcessesTable (src/components/processesTable.tsx)

O componente ProcessesTable é responsável por exibir a tabela de processos. Ele se conecta ao servidor Socket.IO e atualiza dinamicamente os processos conforme os eventos são recebidos. Como a conexão está aqui, certifique-se de que a porta utilizada está correta, e também certifique se que no servidor Socket.IO, a porta configurada pelo CORS, é a que está rodando nesse projeto.

O callback "setProcessesCallback" está responsavel pela adição de um atributo, o "n_processes", que impede que a mesma atividade, ou sub atividades de uma mesma aplicação, sendo executada ao mesmo tempo, apareça diversas vezes na lista.

```tsx
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
```

---

# Real-Time Process Monitor with Socket.IO - Next.js Frontend

This Next.js frontend project connects to the Socket.IO server via [Socket.IO Client](https://socket.io/docs/v4/client-api/) to display real-time information about started and ended processes. It utilizes the [ps-list](https://www.npmjs.com/package/ps-list) library to obtain process information from the backend server, which is available in another of my repositories ([yssysbr-backend](https://github.com/VictorGabriel1/yssys-backend)).

## How to Run the Project

1. **Install Dependencies:**
   Make sure you have Node.js installed in your environment. Run the following command to install project dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

2. **Run Next.js Server:**
   Start the Next.js server by running the following command:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

   The server will be available on the default Next.js port (usually 3000).

3. **Socket.IO Server Execution:**
   Go to the [yssysbr-backend](https://github.com/VictorGabriel1/yssys-backend) repository and follow the instructions on how to run.

## Main Page (src/app/page.tsx)

The main page displays two tables, one for processes that have started and another for processes that have ended. Each table is populated by events emitted by the Socket.IO server.

```tsx
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
```

## Component ProcessesTable (src/components/processesTable.tsx)

The ProcessesTable component is responsible for displaying the process table. It connects to the Socket.IO server and dynamically updates processes as events are received. As the connection is established here, ensure that the port used is correct. Also, make sure that on the Socket.IO server, the CORS port is set to the one used in this project.

The callback "setProcessesCallback" is responsible for adding an attribute, "n_processes," which prevents the same activity or sub-activities of the same application being executed at the same time from appearing multiple times in the list.

```tsx
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
        // Check if an object with the same "name" and "startTime" already exists
        const existingProcessIndex = prev.findIndex(
          (process) =>
            process.name === newProcess.name && process.date === newProcess.date
        );

        if (existingProcessIndex !== -1) {
          // If it already exists, increment the "processes" property by 1
          const updatedProcesses = [...prev];
          updatedProcesses[existingProcessIndex].n_processes += 1;
          return updatedProcesses;
        } else {
          // If it doesn't exist, add a new object with "processes" equal to 1
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
```

---
