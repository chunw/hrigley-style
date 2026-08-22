import { SHOP_URL } from "@/lib/constants";

/** JSON-LD for an original artwork (watercolor / remains / spirit / photography piece). */
export function buildArtworkJsonLd(work: {
  title: string;
  medium?: string;
  year?: string;
  image?: string;
  description?: string;
  price?: number;
  soldOut?: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: work.title,
    artMedium: work.medium,
    dateCreated: work.year,
    image: work.image ? `${SHOP_URL.replace(/\/$/, "")}${work.image}` : undefined,
    creator: { "@type": "Person", name: "Chun Wang" },
    description: work.description ? work.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : undefined,
    offers: work.price
      ? {
          "@type": "Offer",
          price: work.price,
          priceCurrency: "USD",
          availability: work.soldOut ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
        }
      : undefined,
  };
}
