"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  categorySectionId,
  type CatalogItemWithSlug,
  type CategorySection,
} from "@/lib/catalog";
import styles from "./page.module.css";

type SortKey = "catalog" | "name-asc" | "name-desc";

function previewChips(itemprops: { label: string; value: string }[]) {
  return itemprops.slice(0, 2);
}

function itemMatchesQuery(item: CatalogItemWithSlug, raw: string): boolean {
  const q = raw.trim().toLowerCase();
  if (!q) return true;
  if (item.itemname.toLowerCase().includes(q)) return true;
  return item.itemprops.some(
    (p) =>
      p.label.toLowerCase().includes(q) || p.value.toLowerCase().includes(q)
  );
}

function sortItems(
  items: CatalogItemWithSlug[],
  sortKey: SortKey
): CatalogItemWithSlug[] {
  if (sortKey === "catalog") return items;
  const copy = [...items];
  copy.sort((a, b) =>
    sortKey === "name-asc"
      ? a.itemname.localeCompare(b.itemname)
      : b.itemname.localeCompare(a.itemname)
  );
  return copy;
}

type Props = {
  sections: CategorySection[];
  totalItems: number;
};

export default function CatalogHome({ sections, totalItems }: Props) {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("catalog");

  const visibleSections = useMemo(() => {
    let rows = sections
      .map((s) => ({
        ...s,
        items: s.items.filter((item) => itemMatchesQuery(item, query)),
      }))
      .filter((s) => s.items.length > 0);

    if (categoryFilter) {
      rows = rows.filter((s) => s.category === categoryFilter);
    }

    rows = rows.map((s) => ({
      ...s,
      items: sortItems(s.items, sortKey),
    }));
    return rows;
  }, [sections, query, categoryFilter, sortKey]);

  const visibleCount = useMemo(
    () => visibleSections.reduce((n, s) => n + s.items.length, 0),
    [visibleSections]
  );

  const showJumpNav = visibleSections.length > 1;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Product catalog</h1>
      <p className={styles.subtitle}>
        Browse {totalItems} items across {sections.length} categories. Select
        an item for full specifications.
      </p>

      <div className={styles.toolbar} role="search" aria-label="Catalog filters">
        <div className={styles.searchRow}>
          <label className={styles.searchLabel} htmlFor="catalog-search">
            Search
          </label>
          <div className={styles.searchInputWrap}>
            <input
              id="catalog-search"
              className={styles.searchInput}
              type="search"
              placeholder="Name or specification…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
            {query ? (
              <button
                type="button"
                className={styles.searchClear}
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>

        <div className={styles.toolbarRow}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLegend} id="cat-filter-label">
              Category
            </span>
            <div
              className={styles.pills}
              role="group"
              aria-labelledby="cat-filter-label"
            >
              <button
                type="button"
                className={styles.pill}
                data-active={categoryFilter === null}
                aria-pressed={categoryFilter === null}
                onClick={() => setCategoryFilter(null)}
              >
                All
              </button>
              {sections.map(({ category }) => (
                <button
                  key={category}
                  type="button"
                  className={styles.pill}
                  data-active={categoryFilter === category}
                  aria-pressed={categoryFilter === category}
                  onClick={() =>
                    setCategoryFilter((c) =>
                      c === category ? null : category
                    )
                  }
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sortGroup}>
            <label className={styles.sortLabel} htmlFor="catalog-sort">
              Sort
            </label>
            <select
              id="catalog-sort"
              className={styles.sortSelect}
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
            >
              <option value="catalog">Catalog order</option>
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
            </select>
          </div>
        </div>
      </div>

      <p className={styles.resultsMeta} aria-live="polite">
        {visibleCount === totalItems && !query && !categoryFilter ? (
          <>Showing all {totalItems} items.</>
        ) : (
          <>
            Showing {visibleCount} of {totalItems} item
            {totalItems === 1 ? "" : "s"}
            {visibleSections.length > 0
              ? ` in ${visibleSections.length} categor${visibleSections.length === 1 ? "y" : "ies"}`
              : ""}
            .
          </>
        )}
      </p>

      {showJumpNav ? (
        <nav className={styles.jumpNav} aria-label="Jump to category">
          <span className={styles.jumpLabel}>Jump to:</span>
          <ul className={styles.jumpList}>
            {visibleSections.map(({ category }) => (
              <li key={category}>
                <a className={styles.jumpLink} href={`#${categorySectionId(category)}`}>
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {visibleSections.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No matches</p>
          <p className={styles.emptyText}>
            Try a different search term or reset the category filter.
          </p>
          <button
            type="button"
            className={styles.emptyButton}
            onClick={() => {
              setQuery("");
              setCategoryFilter(null);
            }}
          >
            Reset filters
          </button>
        </div>
      ) : (
        visibleSections.map(({ category, items }) => (
          <section
            key={category}
            className={styles.categorySection}
            aria-labelledby={categorySectionId(category)}
          >
            <header className={styles.categoryHeader}>
              <h2 id={categorySectionId(category)} className={styles.categoryTitle}>
                {category}
              </h2>
              <span className={styles.categoryCount}>
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </header>

            <div className={styles.grid}>
              {items.map((item) => {
                const chips = previewChips(item.itemprops);
                return (
                  <Link
                    key={item.slug}
                    href={`/item/${item.slug}`}
                    className={styles.card}
                  >
                    <div className={styles.imageWrap}>
                      {/* eslint-disable-next-line @next/next/no-img-element -- external catalog URLs across many hosts */}
                      <img
                        className={styles.image}
                        src={item.image}
                        alt={item.itemname}
                        loading="lazy"
                      />
                    </div>
                    <div className={styles.cardBody}>
                      <span className={styles.cardTitle}>{item.itemname}</span>
                      {chips.length > 0 ? (
                        <div className={styles.chips}>
                          {chips.map((p) => (
                            <span
                              key={`${item.slug}-${p.label}`}
                              className={styles.chip}
                              title={`${p.label}: ${p.value}`}
                            >
                              {p.label}: {p.value}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <span className={styles.cta}>View details</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
