import { Skeleton } from "@/components/ui/skeleton";

export default function LearnLoading() {
  return (
    <div className="flex flex-1 p-6 max-w-4xl mx-auto w-full space-y-4">
      <div className="w-full space-y-4">
        <Skeleton className="aspect-video w-full rounded-lg" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
