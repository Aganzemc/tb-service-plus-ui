import type { ReactNode } from "react";

export default function AdminRouteLayout({ children }: { children: ReactNode }) {
  return <div className="page-admin-route">{children}</div>;
}
