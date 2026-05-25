"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CleanSheetPreview({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const targetId = unwrappedParams.id;

  const [assignment, setAssignment] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("veda_assignments");
    if (saved) {
      try {
        const list = JSON.parse(saved);
        const match = list.find((item: any) => item.id === targetId);
        if (match) setAssignment(match);
      } catch (e) {
        console.error(e);
      }
    }
  }, [targetId]);

  const readDifficultyColors = (difficulty: string) => {
    const d = difficulty?.toLowerCase() || "";
    if (d.includes("easy")) return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    if (d.includes("mod")) return "bg-amber-50 text-amber-700 border border-amber-200";
    return "bg-rose-50 text-rose-700 border border-rose-200";
  };

  if (!assignment) {
    return (
      <div className="p-8 text-center text-xs font-bold text-gray-400">
        Locating examination data sheet entries...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto print:p-0 print:max-w-full animate-fade-in">
      {/* Top Utility Header Bar Action Rows */}
      <div className="mb-6 flex justify-between items-center print:hidden bg-neutral-900 text-white p-4 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold">
          <span className="text-orange-400">✨</span>
          <p>Generated paper is locked and ready for distribution.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => router.push("/assignment")} className="bg-neutral-800 hover:bg-neutral-700 text-white text-[11px] font-bold px-3 py-2 rounded-xl border border-neutral-700 transition">Back to Dashboard</button>
          <button onClick={() => window.print()} className="bg-white text-neutral-900 text-[11px] font-black px-4 py-2 rounded-xl shadow hover:bg-neutral-50 transition">💾 Download as PDF</button>
        </div>
      </div>

      {/* Production Grade Printable Sheet Canvas */}
      <div className="bg-white border border-gray-200 rounded-3xl p-12 shadow-sm print:border-none print:shadow-none print:p-0 font-serif text-neutral-900">
        
        {/* Academic Meta Headers */}
        <div className="text-center space-y-1 border-b-2 border-neutral-900 pb-5 mb-6 font-sans">
          <h1 className="text-xl font-black tracking-tight uppercase">Delhi Public School, Sector-4, Bokaro</h1>
          <p className="text-sm font-black text-gray-700 uppercase">Subject: {assignment.title}</p>
          <p className="text-[11px] font-bold text-gray-400">Class Matrix Evaluation / Assessment Term Paper</p>
          
          <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 pt-3 px-1 max-w-md mx-auto">
            <div>Time Allowed: <span className="text-neutral-900 font-black">45 minutes</span></div>
            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
            <div>Maximum Marks: <span className="text-neutral-900 font-black">{assignment.totalMarks} Marks</span></div>
          </div>
        </div>

        {/* Verification Lines Block */}
        <div className="grid grid-cols-3 gap-6 font-sans text-[10px] font-bold text-gray-500 border-b border-gray-100 pb-5 mb-6">
          <div>Name: <div className="border-b border-gray-300 h-5 mt-0.5"></div></div>
          <div>Roll Number: <div className="border-b border-gray-300 h-5 mt-0.5"></div></div>
          <div>Class/Section: <div className="border-b border-gray-300 h-5 mt-0.5"></div></div>
        </div>

        <p className="text-[11px] font-bold text-neutral-700 italic mb-6 font-sans">
          * All questions are compulsory. Follow marked guidelines for each section carefully.
        </p>

        {/* Generated Content Sections Iteration */}
        {assignment.sectionsData?.map((section: any, sIdx: number) => (
          <div key={sIdx} className="mb-8 page-break-inside-avoid">
            <div className="border-b border-gray-300 pb-1 mb-4 flex justify-between items-end font-sans">
              <h3 className="text-xs font-black text-neutral-900 uppercase tracking-wider">{section.title}</h3>
              <span className="text-[10px] font-bold text-gray-400 italic">{section.instruction}</span>
            </div>

            <ol className="space-y-4 list-decimal pl-5 text-[14px] font-medium leading-relaxed">
              {section.questions?.map((q: any, qIdx: number) => (
                <li key={qIdx} className="pl-1 marker:font-bold marker:text-neutral-900">
                  <div className="flex justify-between items-start">
                    <span className="pr-4 text-neutral-900">{q.text}</span>
                    <div className="flex items-center space-x-2 shrink-0 font-sans text-[9px] font-bold tracking-tight">
                      <span className={`px-1.5 py-0.5 rounded uppercase font-bold tracking-wide ${readDifficultyColors(q.difficulty)}`}>
                        {q.difficulty}
                      </span>
                      <span className="text-neutral-900 font-extrabold">({q.marks}M)</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}

        {/* Answer Key Grading Block Container */}
        {assignment.sectionsData && (
          <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-200 page-break-before-always font-sans">
            <h4 className="text-xs font-black text-neutral-900 uppercase tracking-widest mb-4 flex items-center space-x-1">
              <span>🔑</span> <span>Answer Key & Core Evaluation Rubrics</span>
            </h4>
            <div className="space-y-4 text-[11px] text-gray-500 leading-relaxed">
              {assignment.sectionsData.map((section: any, sIdx: number) => (
                <div key={sIdx} className="space-y-1">
                  <p className="font-black text-gray-800 uppercase text-[9px] tracking-wider">{section.title}</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    {section.questions?.map((q: any, qIdx: number) => (
                      <li key={qIdx} className="text-gray-500 font-medium">
                        <span className="font-bold text-neutral-800">Expected Response Parameters ({q.marks}M):</span> Core conceptual definition mapping complete step accuracy constraints. Points are awarded based on matching theoretical validations.
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}