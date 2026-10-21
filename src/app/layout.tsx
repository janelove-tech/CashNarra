import localFont from "next/font/local";
import "./tokens.css";
import "./globals.css";
const inter = localFont({
  src: "../../public/brand/fonts/InterVariable.woff2",
  variable: "--font-inter",
  display: "swap",
});
const manrope = localFont({
  src: "../../public/brand/fonts/ManropeVariable.ttf",
  variable: "--font-manrope",
  display: "swap",
});
export const metadata = {
  title: "CashNarra — Tell your money story",
  description:
    "Describe what happened with your money, review the records, then save them. CashNarra does not move money or connect to a bank.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable}`}>
        {children}
      </body>
    </html>
  );
}
