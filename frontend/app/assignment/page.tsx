"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AssignmentModel {
  id: string;
  title: string;
  dueDate: string;
  createdOn: string;
  totalQuestions: number;
  totalMarks: number;
}

export default function SmartDashboardController() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<AssignmentModel[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Retrieve files array from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("veda_assignments");
    if (saved) {
      try { setAssignments(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const deleteAssignment = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = assignments.filter((item) => item.id !== id);
    setAssignments(updated);
    localStorage.setItem("veda_assignments", JSON.stringify(updated));
    setActiveMenu(null);
  };

  // --- EMPTY DASHBOARD PANEL VIEW ---
  if (assignments.length === 0) {
    return (
      <div className="p-8 min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <div className="max-w-md text-center p-8 bg-white border border-gray-200 rounded-3xl shadow-sm space-y-6 flex flex-col items-center">
          <div className="w-20 h-20 bg-neutral-50 rounded-full border border-gray-100 flex items-center justify-center relative">
            <span className="text-3xl text-gray-400">📄</span>
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">✕</div>
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-neutral-900">No assignments yet</h3>
            <p className="text-xs text-gray-400 font-medium px-4 leading-relaxed">
              Create your first assignment to start collecting and grading student submissions. Let AI assist you with tracking custom criteria rules.
            </p>
          </div>
          <button 
            onClick={() => router.push("/assignment/create")}
            className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-5 py-3 rounded-xl shadow transition active:scale-95 flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Create Your First Assignment</span>
          </button>
        </div>
      </div>
    );
  }

  // --- FILLED CARD GRID DASHBOARD ---
  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-[calc(100vh-4rem)] relative" onClick={() => setActiveMenu(null)}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-neutral-900 tracking-tight">Assignments</h2>
          <p className="text-xs font-bold text-gray-400">Manage, evaluate, and view question papers generated for your classes</p>
        </div>
        <button 
          onClick={() => router.push("/assignment/create")}
          className="bg-neutral-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm hover:bg-neutral-800 transition"
        >
          ➕ Add Assignment
        </button>
      </div>

      {/* Grid Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assignments.map((item) => (
          <div 
            key={item.id}
            onClick={() => router.push(`/assignment/${item.id}`)}
            className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition duration-200 cursor-pointer relative flex flex-col justify-between h-40 group"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1 max-w-[85%]">
                <h4 className="text-sm font-black text-neutral-900 tracking-tight truncate uppercase">{item.title}</h4>
                <p className="text-[10px] font-bold text-gray-400">Assigned on: {item.createdOn}</p>
              </div>
              
              {/* Context Action Flyout Trigger */}
              <div className="relative">
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === item.id ? null : item.id); }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition font-bold"
                >
                  ⋮
                </button>
                {activeMenu === item.id && (
                  <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-40 animate-fade-in text-left">
                    <button 
                      onClick={() => router.push(`/assignment/${item.id}`)}
                      className="w-full text-left px-3 py-1.5 text-[11px] font-bold text-gray-700 hover:bg-gray-50 transition"
                    >
                      View Paper
                    </button>
                    <button 
                      onClick={(e) => deleteAssignment(item.id, e)}
                      className="w-full text-left px-3 py-1.5 text-[11px] font-black text-rose-600 hover:bg-rose-50 transition border-t border-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Total Marks Metric Footer Row */}
            <div className="flex justify-between items-center border-t border-gray-100 pt-3 text-[11px] font-bold">
              <div className="text-gray-400">
                Questions: <span className="text-neutral-900 font-extrabold">{item.totalQuestions}</span> | Marks: <span className="text-neutral-900 font-extrabold">{item.totalMarks}</span>
              </div>
              <div className="text-neutral-900 bg-neutral-50 px-2 py-0.5 rounded border border-gray-100 text-[10px] font-extrabold uppercase">
                Due: {item.dueDate}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}