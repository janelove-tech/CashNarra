import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CashNarra",
    short_name: "CashNarra",
    description: "Tell your money story. See the numbers.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F7FA",
    theme_color: "#5B49C7",
    icons: [
      {
        src: "/brand/cashnarra-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/brand/cashnarra-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
