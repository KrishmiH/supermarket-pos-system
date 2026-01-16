import { useState } from 'react'
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold">Welcome</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
