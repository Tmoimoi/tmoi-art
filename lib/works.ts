import worksData from "@/data/works.json";
import { SERIES, type SeriesId, type Work } from "./types";

const works = worksData as Work[];

export function getAllWorks(): Work[] {
  return works;
}

export function getWorkBySlug(slug: string): Work | undefined {
  return works.find((w) => w.slug === slug);
}

export function getFeaturedWorks(limit = 3): Work[] {
  return works.slice(0, limit);
}

export function getRelatedWorks(work: Work, limit = 3): Work[] {
  if (!work.related || work.related.length === 0) {
    // 退化为同系列的其他作品
    const sameSeries = works.filter(
      (w) => w.slug !== work.slug && w.series.some((s) => work.series.includes(s))
    );
    return sameSeries.slice(0, limit);
  }
  const explicit = work.related
    .map((slug) => works.find((w) => w.slug === slug))
    .filter((w): w is Work => Boolean(w));
  return explicit.slice(0, limit);
}

// 按系列分组的作品（保留系列顺序；作品保留原数组顺序）
export function getWorksBySeries(): { id: SeriesId; name: string; nameEn: string; works: Work[] }[] {
  return SERIES.map((s) => ({
    id: s.id,
    name: s.name,
    nameEn: s.nameEn,
    works: works.filter((w) => w.series.includes(s.id)),
  })).filter((g) => g.works.length > 0);
}
