"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function VedaLayoutShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeCount, setActiveCount] = useState(0);

  // Read local storage to update navigation indicator bubbles dynamically
  useEffect(() => {
    const syncBadgeCount = () => {
      const stored = localStorage.getItem("veda_assignments");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setActiveCount(parsed.length);
        } catch (e) {
          console.error(e);
        }
      }
    };
    syncBadgeCount();
    // Set up an interval to keep counts synced across views
    const interval = setInterval(syncBadgeCount, 1500);
    return () => clearInterval(interval);
  }, [pathname]);

  const navItems = [
    { label: "Home", icon: "🏠", path: "/assignment" },
    { label: "My Groups", icon: "👥", path: "#" },
    { label: "Assignments", icon: "📄", path: "/assignment", badge: activeCount > 0 ? String(activeCount) : undefined },
    { label: "AI Teacher's Toolkit", icon: "🛠️", path: "#" },
    { label: "My Library", icon: "📚", path: "#" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
      {/* Permanent Fixed Left Sidebar Panel */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-5 sticky top-0 h-screen shrink-0 z-20">
        <div className="space-y-6">
          {/* Logo Brand Title */}
          <div className="flex items-center space-x-2.5 px-1 cursor-pointer" onClick={() => router.push("/assignment")}>
            <div className="w-9 h-9 bg-orange-600 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-md shadow-orange-500/20">
              V
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">VedaAI</span>
          </div>

          {/* Core Sidebar Creation CTA */}
          <button 
            onClick={() => router.push("/assignment/create")}
            className="w-full bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl py-3 px-4 font-bold text-xs shadow-sm flex items-center justify-center space-x-2 transition active:scale-98"
          >
            <span>✨</span>
            <span>Create Assignment</span>
          </button>

          {/* Navigation Path Iterators */}
          <nav className="space-y-1">
            {navItems.map((item, idx) => {
              const isSelected = pathname === item.path || (item.path !== "/assignment" && pathname.startsWith(item.path));
              return (
                <div
                  key={idx}
                  onClick={() => item.path !== "#" && router.push(item.path)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                    isSelected 
                      ? "bg-neutral-100 text-neutral-900 font-extrabold" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-base opacity-90">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full min-w-[18px] text-center">
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* School Footer Information Card */}
        <div className="border-t border-gray-100 pt-4 flex items-center space-x-3 px-1">
          <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-base">
            🏫
          </div>
          <div className="truncate text-left">
            <p className="text-xs font-black text-gray-900 truncate">Delhi Public School</p>
            <p className="text-[10px] font-bold text-gray-400 truncate">Bokaro Steel City</p>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Universal Top Application Header Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30 print:hidden">
          <div className="flex items-center space-x-2 text-gray-400 text-xs font-bold">
            <span className="cursor-pointer hover:text-gray-900 transition" onClick={() => router.push("/assignment")}>Dashboard</span>
            {pathname.includes("/create") && (
              <>
                <span>/</span>
                <span className="text-gray-900">Create New</span>
              </>
            )}
            {pathname.match(/\/[a-z0-9-]+$/i) && !pathname.includes("/create") && (
              <>
                <span>/</span>
                <span className="text-gray-900">Exam Preview</span>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition text-sm">🔔</button>
            <div className="flex items-center space-x-2 border border-gray-200 rounded-xl py-1.5 px-3 bg-gray-50">
              <div className="w-5 h-5 rounded-full bg-neutral-800 text-white text-[10px] flex items-center justify-center font-bold">JD</div>
              <span className="text-xs font-bold text-gray-700">John Doe</span>
              <span className="text-[9px] text-gray-400">▼</span>
            </div>
          </div>
        </header>

        {/* View Workspace Injection Frame Area */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}