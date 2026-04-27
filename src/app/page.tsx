import { catalogItems, groupByCategory } from "@/lib/catalog";
import CatalogHome from "./catalog-home";

export default function Home() {
  const sections = groupByCategory(catalogItems);

  return (
    <CatalogHome sections={sections} totalItems={catalogItems.length} />
  );
}
