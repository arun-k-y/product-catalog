import Link from "next/link";
import styles from "./not-found.module.css";

export default function ItemNotFound() {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Item not found</h1>
      <p className={styles.text}>
        That product link is invalid or the item is no longer in the catalog.
      </p>
      <Link href="/" className={styles.link}>
        Return home
      </Link>
    </div>
  );
}
