import worksData from "@/data/works.json";
import type { Work } from "./types";

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
