import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "ONE8 System",
  description: "ONE8 ERP Platform",
  icons: {
    icon: "/one8logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>

        <main>{children}</main>
      </body>
    </html>
  );
}
