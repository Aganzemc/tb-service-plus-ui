type AdminStatCardProps = {
  label: string;
  value: string;
  hint: string;
  tone?: "primary" | "coral" | "mint" | "dark";
};

const toneStyles: Record<NonNullable<AdminStatCardProps["tone"]>, string> = {
  primary: "bg-[#eef2ff] text-brand-primary",
  coral: "bg-[#fff1ec] text-[#d66b47]",
  mint: "bg-[#edf9f1] text-[#2c9b63]",
  dark: "bg-[#eef1f4] text-brand-ink",
};

export default function AdminStatCard({ label, value, hint, tone = "primary" }: AdminStatCardProps) {
  return (
    <article className="admin-card admin-fade-up rounded-[22px] p-4 md:p-5">
      <span className={`flex h-10 w-10 items-center justify-center rounded-[12px] text-[12px] font-semibold ${toneStyles[tone]}`}>
        {value === "--" ? "--" : label.slice(0, 1).toUpperCase()}
      </span>
      <p className="mt-4 text-[1.8rem] font-semibold leading-none tracking-[-0.05em] text-brand-ink">{value}</p>
      <p className="mt-2 text-[13px] font-medium text-brand-ink">{label}</p>
      <p className="mt-1 text-[12px] leading-6 text-muted">{hint}</p>
    </article>
  );
}
