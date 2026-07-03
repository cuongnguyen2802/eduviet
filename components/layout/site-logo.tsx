import Image from "next/image";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function SiteLogo({ logoUrl, className }: { logoUrl: string | null; className?: string }) {
  return (
    <Link href="/" className={className ?? "flex items-center gap-2 font-bold text-lg"}>
      {logoUrl ? (
        <span className="relative h-8 w-32">
          <Image src={logoUrl} alt="EduViet" fill className="object-contain object-left" />
        </span>
      ) : (
        <>
          <GraduationCap className="h-6 w-6 text-primary" />
          EduViet
        </>
      )}
    </Link>
  );
}
