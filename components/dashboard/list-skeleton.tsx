import { Skeleton } from "@/components/ui/skeleton";

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div>
      <Skeleton className="h-8 w-56 mb-6" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
