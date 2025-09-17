import { ReactNode } from "react";

interface BidLayoutProps {
  children: ReactNode;
}

export default function BidLayout({ children }: BidLayoutProps) {
  return <>{children}</>;
}
