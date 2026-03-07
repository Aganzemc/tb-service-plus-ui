type AdminStatCardProps = {
  label: string;
  value: string;
  hint: string;
  tone?: "primary" | "coral" | "mint" | "dark";
};

const toneClasses: Record<NonNullable<AdminStatCardProps["tone"]>, string> = {
  primary: "from-brand-primary/18 via-white to-white text-brand-primary",
  coral: "from-brand-coral/18 via-white to-white text-[#d05c38]",
  mint: "from-brand-mint/26 via-white to-white text-[#21885e]",
  dark: "from-brand-ink/10 via-white to-white text-brand-ink",
};

export default function AdminStatCard({ label, value, hint, tone = "primary" }: AdminStatCardProps) {
  return (
    <article className={`rounded-[26px] border border-black/6 bg-[linear-gradient(135deg,var(--tw-gradient-stops))] p-5 shadow-[0_18px_45px_rgba(41,47,96,0.08)] ${toneClasses[tone]}`}>
      <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-muted">{label}</p>
      <p className="mt-4 text-[clamp(2rem,4vw,3rem)] font-semibold leading-none tracking-[-0.06em] text-brand-ink">{value}</p>
      <p className="mt-3 text-[14px] leading-6 text-muted">{hint}</p>
    </article>
  );
}
