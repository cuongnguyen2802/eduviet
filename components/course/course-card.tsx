import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatVND } from "@/lib/format";

export type CourseCardData = {
  slug: string;
  title: string;
  coverImageUrl: string | null;
  price: number;
  discountPrice: number | null;
  level: string;
  instructorName: string;
  avgRating?: number;
  reviewCount?: number;
};

const levelLabel: Record<string, string> = {
  BEGINNER: "Cơ bản",
  INTERMEDIATE: "Trung cấp",
  ADVANCED: "Nâng cao",
};

export function CourseCard({ course }: { course: CourseCardData }) {
  return (
    <Link href={`/courses/${course.slug}`}>
      <Card className="overflow-hidden transition-shadow hover:shadow-md h-full flex flex-col">
        <div className="relative aspect-video bg-muted">
          {course.coverImageUrl && (
            <Image
              src={course.coverImageUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
          )}
        </div>
        <CardContent className="p-4 flex flex-col gap-2 flex-1">
          <Badge variant="secondary" className="w-fit">
            {levelLabel[course.level] ?? course.level}
          </Badge>
          <h3 className="font-semibold leading-snug line-clamp-2">{course.title}</h3>
          <p className="text-sm text-muted-foreground">{course.instructorName}</p>

          {course.avgRating !== undefined && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{course.avgRating.toFixed(1)}</span>
              <span className="text-muted-foreground">({course.reviewCount ?? 0})</span>
            </div>
          )}

          <div className="mt-auto flex items-center gap-2 pt-2">
            <span className="font-bold text-primary">
              {formatVND(course.discountPrice ?? course.price)}
            </span>
            {course.discountPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatVND(course.price)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
