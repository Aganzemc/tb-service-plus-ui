export type SocialNetwork = "facebook" | "instagram" | "tiktok" | "linkedin";

export default function SocialNetworkIcon({
  network,
  className,
}: {
  network: SocialNetwork;
  className?: string;
}) {
  if (network === "facebook") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M13.5 20v-6.2h2.8l.4-3.1h-3.2V8.8c0-.9.3-1.5 1.6-1.5h1.8V4.5c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4v2.3H8v3.1h2.5V20h3z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (network === "instagram") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="4" y="4" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (network === "tiktok") {
    return (
      <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M14 4v8.5a3.5 3.5 0 11-2.5-3.3V6.5h2a4.3 4.3 0 003.5 3.4v2.1A6.1 6.1 0 0114 10.8V4h0z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M7.5 9.5A2.5 2.5 0 0110 7h7v10h-7a2.5 2.5 0 01-2.5-2.5v-5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M7 10h-1a2 2 0 100 4h1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M11 10.5v3M13.5 10.5v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
