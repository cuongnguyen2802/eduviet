import { Skeleton } from "@/components/ui/skeleton";

export default function CourseDetailLoading() {
  return (
    <div>
      <div className="bg-secondary/30 border-b">
        <div className="container py-10 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-9 w-full max-w-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="lg:row-start-1 lg:col-start-3">
            <Skeleton className="aspect-video w-full rounded-lg" />
          </div>
        </div>
      </div>
      <div className="container py-10 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
