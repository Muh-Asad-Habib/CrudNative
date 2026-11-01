import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return <GraduationCap aria-hidden strokeWidth={1.75} className={cn("size-6 text-primary", className)} />
}

export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn("flex min-h-11 items-center gap-2 rounded-md text-foreground", className)}
      aria-label="CRUDNative, ke beranda"
    >
      <LogoMark className="size-[22px]" />
      <span className="font-serif text-lg leading-none font-bold tracking-tight">
        CRUD<span className="marker">Native</span>
      </span>
    </Link>
  );
}