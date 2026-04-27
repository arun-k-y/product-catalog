import catalogJson from "@/data/catalog.json";

export type ItemProp = {
  label: string;
  value: string;
};

export type CatalogItem = {
  itemname: string;
  category: string;
  image: string;
  itemprops: ItemProp[];
};

export type CatalogItemWithSlug = CatalogItem & { slug: string };

function slugify(name: string): string {
  const s = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || "item";
}

function assignSlugs(items: CatalogItem[]): CatalogItemWithSlug[] {
  const used = new Set<string>();
  const uniqueSlug = (base: string) => {
    let slug = base || "item";
    let n = 2;
    while (used.has(slug)) {
      slug = `${base || "item"}-${n}`;
      n += 1;
    }
    used.add(slug);
    return slug;
  };

  return items.map((item) => ({
    ...item,
    slug: uniqueSlug(slugify(item.itemname)),
  }));
}

const rawItems = catalogJson as CatalogItem[];

export const catalogItems: CatalogItemWithSlug[] = assignSlugs(rawItems);

const slugToItem = new Map<string, CatalogItemWithSlug>(
  catalogItems.map((item) => [item.slug, item])
);

export function getItemBySlug(slug: string): CatalogItemWithSlug | undefined {
  return slugToItem.get(slug);
}

export type CategorySection = {
  category: string;
  items: CatalogItemWithSlug[];
};

/** Stable DOM id for category section headings (anchors / aria). */
export function categorySectionId(category: string): string {
  return `cat-${category.replace(/\s+/g, "-")}`;
}

export function groupByCategory(
  items: CatalogItemWithSlug[]
): CategorySection[] {
  const map = new Map<string, CatalogItemWithSlug[]>();
  for (const item of items) {
    const list = map.get(item.category);
    if (list) list.push(item);
    else map.set(item.category, [item]);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, sectionItems]) => ({ category, items: sectionItems }));
}
