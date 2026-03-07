import AdminLoginCard from "@/components/AdminLoginCard";

export default function AdminLoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f6ff] px-4 py-10 md:px-6 md:py-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(95,103,244,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,130,92,0.14),transparent_24%)]" />

      <div className="relative grid min-h-[calc(100vh-5rem)] w-full items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] xl:px-4 2xl:px-8">
        <section className="rounded-[32px] bg-[linear-gradient(135deg,#0f1734_0%,#5f67f4_100%)] p-7 text-white shadow-[0_28px_80px_rgba(47,56,140,0.34)] md:p-10">
          <div className="inline-flex rounded-full border border-white/14 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/86">
            Admin Portal
          </div>

          <h1 className="mt-6 text-[clamp(2.5rem,5vw,4.4rem)] font-semibold leading-[0.95] tracking-[-0.07em]">
            Manage TB Service Plus in one elegant workspace.
          </h1>

          <p className="mt-5 max-w-xl text-[16px] leading-8 text-white/80 md:text-[18px]">
            Access the dashboard, publish services, and handle customer requests from a smoother admin experience.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <FeatureCard title="Clear overview" description="A cleaner navigation flow between dashboard, services, and messages." />
            <FeatureCard title="Quick actions" description="Frequent tasks stay within reach as soon as you sign in." />
            <FeatureCard title="Customer follow-up" description="Spot unread messages and pending conversations faster." />
            <FeatureCard title="Catalog control" description="Keep active services and display order under control." />
          </div>
        </section>

        <div className="mx-auto w-full max-w-[620px]">
          <AdminLoginCard
            title="Administrator Sign In"
            subtitle="Enter your credentials to access the back office and manage website content."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[24px] border border-white/12 bg-white/10 p-5 backdrop-blur">
      <p className="text-[15px] font-semibold text-white">{title}</p>
      <p className="mt-2 text-[14px] leading-7 text-white/74">{description}</p>
    </div>
  );
}
