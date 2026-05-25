"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface ConfigurationRow {
  type: string;
  count: number;
  marks: number;
}

export default function InteractiveFormWizard() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [instructions, setInstructions] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  const selectionPool = [
    "Multiple Choice Questions",
    "Short Questions",
    "Diagram/Graph-Based Questions",
    "Numerical Problems",
    "Long Essay Questions"
  ];

  // Match the design configuration parameters precisely
  const [matrix, setMatrix] = useState<ConfigurationRow[]>([
    { type: "Multiple Choice Questions", count: 4, marks: 1 },
    { type: "Short Questions", count: 3, marks: 2 },
    { type: "Diagram/Graph-Based Questions", count: 5, marks: 5 },
    { type: "Numerical Problems", count: 5, marks: 5 }
  ]);

  const updateMatrixValues = (idx: number, field: "count" | "marks", offset: number) => {
    const updated = [...matrix];
    updated[idx][field] = Math.max(1, updated[idx][field] + offset);
    setMatrix(updated);
  };

  const changeRowType = (idx: number, targetType: string) => {
    const updated = [...matrix];
    updated[idx].type = targetType;
    setMatrix(updated);
  };

  const addMatrixRow = () => {
    const existing = matrix.map(m => m.type);
    const fallback = selectionPool.find(p => !existing.includes(p)) || "Short Questions";
    setMatrix([...matrix, { type: fallback, count: 2, marks: 2 }]);
  };

  const removeMatrixRow = (idx: number) => {
    if (matrix.length === 1) return;
    setMatrix(matrix.filter((_, i) => i !== idx));
  };

  const calculatedQuestions = matrix.reduce((sum, current) => sum + current.count, 0);
  const calculatedMarks = matrix.reduce((sum, current) => sum + (current.count * current.marks), 0);

  const simulateFileSelector = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  // Saves mock generated assignments instantly to local storage to enable the dashboard state toggle
  const executeFormSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert("Please clarify your custom assignment title name.");

    const generatedId = "paper-" + Math.random().toString(36).substring(2, 9);
    const payload = {
      id: generatedId,
      title: title,
      dueDate: dueDate || "2026-06-15",
      createdOn: new Date().toISOString().split("T")[0],
      totalQuestions: calculatedQuestions,
      totalMarks: calculatedMarks,
      instructions: instructions,
      sectionsData: matrix.map((row, rIdx) => ({
        title: `Section ${String.fromCharCode(65 + rIdx)}: ${row.type}`,
        instruction: `Answer all items carefully. Each item carries ${row.marks} marks.`,
        questions: Array.from({ length: row.count }).map((_, qIdx) => ({
          text: `Sample evaluation question tracking task #${qIdx + 1} regarding key properties of ${title || "the selected syllabus framework chapter"}.`,
          difficulty: qIdx % 3 === 0 ? "Easy" : qIdx % 3 === 1 ? "Moderate" : "Challenging",
          marks: row.marks
        }))
      }))
    };

    const saved = localStorage.getItem("veda_assignments");
    const currentList = saved ? JSON.parse(saved) : [];
    localStorage.setItem("veda_assignments", JSON.stringify([payload, ...currentList]));
    
    router.push(`/assignment/${generatedId}`);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto animate-fade-in">
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Create Assignment</h2>
          <p className="text-xs font-bold text-gray-400">Set up a new assessment sheet for your student courses</p>
        </div>

        {/* Drag and Drop File Frame Container Box */}
        <label className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50/60 hover:bg-gray-50 cursor-pointer group transition">
          <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={simulateFileSelector} />
          <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm text-gray-400 group-hover:scale-105 transition text-base">☁️</div>
          <p className="text-xs font-bold text-gray-800 mt-2">{fileName ? fileName : "Choose a file or drag & drop it here"}</p>
          <p className="text-[10px] font-bold text-gray-400 mt-0.5">JPEG, PNG, PDF up to 10MB</p>
          <span className="mt-3 text-[11px] font-extrabold text-neutral-900 bg-white border border-gray-200 shadow-sm px-3 py-1 rounded-xl group-hover:bg-gray-50 transition">Browse Files</span>
        </label>

        <form onSubmit={executeFormSubmission} className="space-y-5">
          {/* Title Parameter Entry Box */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-wider">Assignment Title / Context Subject</label>
            <input required type="text" placeholder="e.g. Chemical Effects of Electric Current" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* Target Due Date Field */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-wider">Due Date Target</label>
            <input type="date" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>

          {/* Main Matrix Inputs Block Container */}
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2 px-1 text-[10px] font-black text-gray-400 uppercase tracking-wider">
              <div className="col-span-6">Question Type</div>
              <div className="col-span-3 text-center">No. of Questions</div>
              <div className="col-span-3 text-center">Marks per Item</div>
            </div>

            <div className="space-y-2">
              {matrix.map((row, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  {/* Selection Selector dropdown elements row */}
                  <div className="col-span-6 flex items-center space-x-1.5">
                    <button type="button" onClick={() => removeMatrixRow(idx)} className="text-gray-400 hover:text-rose-500 font-bold p-1 text-sm transition">✕</button>
                    <select className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-neutral-900" value={row.type} onChange={(e) => changeRowType(idx, e.target.value)}>
                      {selectionPool.map((opt, oIdx) => <option key={oIdx} value={opt}>{opt}</option>)}
                    </select>
                  </div>

                  {/* Count Stepper Wrapper */}
                  <div className="col-span-3 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-1 max-w-[100px] mx-auto w-full">
                    <button type="button" onClick={() => updateMatrixValues(idx, "count", -1)} className="w-6 h-6 flex items-center justify-center text-xs font-bold text-gray-400 bg-white border border-gray-100 rounded-lg shadow-sm hover:bg-gray-100">-</button>
                    <span className="text-xs font-black text-neutral-800">{row.count}</span>
                    <button type="button" onClick={() => updateMatrixValues(idx, "count", 1)} className="w-6 h-6 flex items-center justify-center text-xs font-bold text-gray-400 bg-white border border-gray-100 rounded-lg shadow-sm hover:bg-gray-100">+</button>
                  </div>

                  {/* Marks Stepper Wrapper */}
                  <div className="col-span-3 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-1 max-w-[100px] mx-auto w-full">
                    <button type="button" onClick={() => updateMatrixValues(idx, "marks", -1)} className="w-6 h-6 flex items-center justify-center text-xs font-bold text-gray-400 bg-white border border-gray-100 rounded-lg shadow-sm hover:bg-gray-100">-</button>
                    <span className="text-xs font-black text-neutral-800">{row.marks}</span>
                    <button type="button" onClick={() => updateMatrixValues(idx, "marks", 1)} className="w-6 h-6 flex items-center justify-center text-xs font-bold text-gray-400 bg-white border border-gray-100 rounded-lg shadow-sm hover:bg-gray-100">+</button>
                  </div>
                </div>
              ))}
            </div>

            <button type="button" onClick={addMatrixRow} className="text-[11px] font-black text-neutral-900 flex items-center space-x-1.5 hover:opacity-70 transition pt-1 pl-1">
              <span>➕</span> <span>Add Question Type</span>
            </button>
          </div>

          {/* Sum Indicators Footer */}
          <div className="flex justify-end space-x-6 text-right pr-1 text-[11px] font-bold text-gray-400 border-t border-gray-100 pt-3">
            <div>Total Questions: <span className="text-neutral-900 font-black text-xs ml-0.5">{calculatedQuestions}</span></div>
            <div>Total Marks: <span className="text-neutral-900 font-black text-xs ml-0.5">{calculatedMarks}</span></div>
          </div>

          {/* Context Criteria Prompt Slot */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-wider">Additional Information (For better output)</label>
            <textarea rows={2} placeholder="e.g. Generate a question paper matching standard curriculum layout rules matching CBSE..." className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition resize-none font-sans" value={instructions} onChange={(e) => setInstructions(e.target.value)} />
          </div>

          {/* Navigation Action Triggers */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <button type="button" onClick={() => router.push("/assignment")} className="bg-white border border-gray-200 text-gray-600 px-5 py-2 rounded-xl font-bold text-xs shadow-sm hover:bg-gray-50 transition">← Previous</button>
            <button type="submit" className="bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition">Generate Paper →</button>
          </div>
        </form>
      </div>
    </div>
  );
}