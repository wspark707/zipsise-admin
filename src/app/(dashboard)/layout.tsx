// path: src/app/(dashboard)/layout.tsx
import Sidebar from "@/components/layout/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
