"use client";

export function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 overflow-y-auto relative bg-transparent">

      <div className="relative z-10 min-h-full p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
