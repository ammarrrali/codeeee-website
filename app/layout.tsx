import "./globals.css";

export const metadata = {
  title: "CODEEEE",
  description: "Websites & Software for Small Businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}