import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Providers } from "./providers";
import { getMetadata } from "@/utils";
import { Analytics } from "@/components/Analytics";

const poppins = Poppins({ weight: ["200", "400", "700"], subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const imageUrl = `${process.env["HOST"]}/og/index.png?date=${Date.now()}`;
  const postUrl = `${process.env["HOST"]}/api/frame/home`;

  const metadata = getMetadata({
    title: "EIP.tools",
    description: "Explore all EIPs & ERCs easily!",
    images: imageUrl,
  });

  return {
    ...metadata,
    other: {
      "fc:frame": "vNext",
      "fc:frame:image": imageUrl,
      "fc:frame:post_url": postUrl,
      "fc:frame:input:text": "Enter EIP/ERC No",
      "fc:frame:button:1": "Search 🔎",
    },
  };
}

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
