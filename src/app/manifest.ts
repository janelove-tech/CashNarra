import type { MetadataRoute } from "next";

/**
 * Installable app identity. The icons are the approved brand files; the
 * maskable entries reuse the same files because the approved app icon keeps
 * the symbol inside the central safe zone. Nothing is redrawn here.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/app",
    name: "CashNarra",
    short_name: "CashNarra",
    description:
      "Say what happened with your money. Check the records. Know where you stand.",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui", "browser"],
    orientation: "any",
    background_color: "#F7F7FA",
    theme_color: "#5B49C7",
    categories: ["finance", "productivity"],
    lang: "en",
    icons: [
      {
        src: "/brand/cashnarra-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/cashnarra-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/cashnarra-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/brand/cashnarra-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Tell what happened",
        short_name: "Tell",
        description: "Open the story box",
        url: "/app?compose=1",
        icons: [{ src: "/brand/cashnarra-icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Records",
        description: "Find a record, a person or an account",
        url: "/app?view=records",
        icons: [{ src: "/brand/cashnarra-icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
