import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getItemBySlug } from "@/lib/catalog";
import styles from "./page.module.css";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getItemBySlug(slug);
  if (!item) return { title: "Not found" };
  return {
    title: `${item.itemname} · Catalog`,
    description: `${item.category} — ${item.itemname}`,
  };
}

export default async function ItemPage({ params }: Props) {
  const { slug } = await params;
  const item = getItemBySlug(slug);
  if (!item) notFound();

  return (
    <article className={styles.page}>
      <Link href="/" className={styles.back}>
        ← Back to catalog
      </Link>

      <div className={styles.hero}>
        {/* eslint-disable-next-line @next/next/no-img-element -- external catalog URLs across many hosts */}
        <img
          className={styles.heroImage}
          src={item.image}
          alt={item.itemname}
        />
      </div>

      <header className={styles.meta}>
        <p className={styles.badge}>{item.category}</p>
        <h1 className={styles.name}>{item.itemname}</h1>
      </header>

      <section aria-labelledby="specs-heading">
        <h2 id="specs-heading" className={styles.specsTitle}>
          Specifications
        </h2>
        <dl className={styles.dl}>
          {item.itemprops.map((prop, index) => (
            <div key={`${prop.label}-${index}`} className={styles.row}>
              <dt className={styles.dt}>{prop.label}</dt>
              <dd className={styles.dd}>{prop.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
