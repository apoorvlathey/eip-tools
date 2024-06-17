import { Poppins } from "next/font/google";
import { Providers } from "./providers";
import { Analytics } from "@/components/Analytics";

const poppins = Poppins({ weight: ["200", "400", "700"], subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Analytics />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
