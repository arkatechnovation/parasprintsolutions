/**
 * Content repository for Paras Prints Solutions.
 *
 * Every value in this module is extracted verbatim from the live source website
 * (https://parasprints-nu.vercel.app/). See `audit.json` for the extraction
 * report, route inventory, asset inventory and discrepancy log.
 */
import aboutJson from "./about.json";
import assetsJson from "./assets.json";
import auditJson from "./audit.json";
import calculatorJson from "./calculator.json";
import clientsJson from "./clients.json";
import companyJson from "./company.json";
import contactJson from "./contact.json";
import faqsJson from "./faqs.json";
import footerJson from "./footer.json";
import industriesJson from "./industries.json";
import manufacturingJson from "./manufacturing.json";
import navigationJson from "./navigation.json";
import productsJson from "./products.json";
import qualityJson from "./quality.json";
import seoJson from "./seo.json";
import testimonialsJson from "./testimonials.json";

export const company = companyJson;
export const about = aboutJson;
export const contact = contactJson;
export const navigation = navigationJson;
export const footer = footerJson;
export const faqs = faqsJson;
export const audit = auditJson;
export const assetInventory = assetsJson;

export type ProductItem = (typeof productsJson.items)[number];
export type ProductCategory = (typeof productsJson.categories)[number];
export type IndustryItem = (typeof industriesJson.items)[number];
export type ClientItem = (typeof clientsJson.items)[number];
export type Testimonial = (typeof testimonialsJson.items)[number];
export type NavItem = (typeof navigationJson.primary)[number];
export type NavLink = { label: string; href: string };

export const products = {
  ...productsJson,
  items: productsJson.items as ProductItem[],
  categories: productsJson.categories as ProductCategory[],
  bySlug(slug: string): ProductItem | undefined {
    return productsJson.items.find((item) => item.slug === slug);
  },
  byCategory(categoryId: string): ProductItem[] {
    return productsJson.items.filter((item) => item.categoryId === categoryId);
  },
  /** Flat product index used by the header search (mirrors the source site's search). */
  searchIndex: productsJson.items.map((item) => ({
    name: item.name,
    category: item.category,
    href: `/products/${item.slug}`,
    tags: item.searchTags,
  })),
};

export const industries = {
  ...industriesJson,
  items: industriesJson.items as IndustryItem[],
};

export const clients = {
  ...clientsJson,
  items: clientsJson.items as ClientItem[],
};

export const testimonials = {
  ...testimonialsJson,
  items: testimonialsJson.items as Testimonial[],
};

export const manufacturing = manufacturingJson;
export const quality = qualityJson;
export const seo = seoJson;

export const calculator = {
  ...calculatorJson,
  boardTypes: calculatorJson.boardTypes,
  boxStyles: calculatorJson.boxStyles,
  dimensions: calculatorJson.dimensions,
  paperQualities: calculatorJson.paperQualities,
  finishes: calculatorJson.finishes,
  volumeTiers: calculatorJson.volumeTiers,
};

export const gallery = [
  { src: "/assets/hero-product-showcase.jpg", caption: "Printed packaging showcase - offset and corrugation output", group: "Products" },
  { src: "/assets/precision-flute-stacks.jpg", caption: "Precision flute stacks - virgin kraft and duplex finish", group: "Manufacturing" },
  { src: "/assets/paras-plant-facility.jpg", caption: "Integrated manufacturing facility, Ghaziabad", group: "Facility" },
  { src: "/assets/paras-products-collage.jpg", caption: "Product range - packaging and commercial print", group: "Products" },
  { src: "/assets/corrugated-boxes-enterprise.jpg", caption: "Heavy-duty corrugated boxes (3, 5 and 7-ply)", group: "Products" },
  { src: "/assets/duplex-boxes-enterprise.jpg", caption: "Duplex monocartons, foil and UV finishes", group: "Products" },
  { src: "/assets/paper-bags-showcase.jpg", caption: "Kraft and duplex paper bags", group: "Products" },
  { src: "/assets/brochures-enterprise.jpg", caption: "Multi-fold brochures on 6-colour UV offset", group: "Commercial print" },
  { src: "/assets/catalogues-enterprise.jpg", caption: "Multi-page catalogues, perfect bound and section sewn", group: "Commercial print" },
  { src: "/assets/leaflets-print-showcase.jpg", caption: "Pharma inserts and promotional leaflets", group: "Commercial print" },
  { src: "/assets/hero-showcase.jpg", caption: "Custom kraft and white packaging boxes", group: "Products" },
].map((item) => {
  const asset = assetInventory.items.find((asset) => asset.path === item.src);
  return { ...item, width: asset?.width, height: asset?.height };
});

/** Absolute WhatsApp deep link, preserving the source site's prefilled message. */
export function whatsappLink(message?: string): string {
  const text = encodeURIComponent(message ?? contact.whatsappPrefill);
  return `https://wa.me/${contact.whatsappNumber}?text=${text}`;
}

export const primaryNav = navigationJson.primary as NavItem[];
export const quickLinks = footerJson.quickLinks as NavLink[];
export const productLinks = footerJson.productLinks as NavLink[];
