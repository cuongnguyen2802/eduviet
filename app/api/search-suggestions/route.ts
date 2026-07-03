import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ courses: [], categories: [] });

  const [courses, categories] = await Promise.all([
    prisma.course.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { instructor: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      select: {
        slug: true,
        title: true,
        coverImageUrl: true,
        price: true,
        discountPrice: true,
        instructor: { select: { name: true } },
      },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      select: { slug: true, name: true },
      take: 4,
    }),
  ]);

  return NextResponse.json({
    courses: courses.map((c) => ({
      slug: c.slug,
      title: c.title,
      coverImageUrl: c.coverImageUrl,
      price: Number(c.price),
      discountPrice: c.discountPrice ? Number(c.discountPrice) : null,
      instructorName: c.instructor.name,
    })),
    categories,
  });
}
