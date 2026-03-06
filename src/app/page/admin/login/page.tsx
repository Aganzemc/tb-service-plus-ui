import AdminLoginCard from "@/components/AdminLoginCard";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-220px)] items-center justify-center px-4 py-10 md:px-6 md:py-16">
      <div className="w-full max-w-[560px]">
        <AdminLoginCard />
      </div>
    </div>
  );
}