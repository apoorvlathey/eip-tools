import { Layout } from "@/components/Layout";
import {
  convertMetadataToJson,
  extractEipNumber,
  extractMetadata,
  getMetadata,
} from "@/utils";
import { validEIPs } from "@/data/validEIPs";

export async function generateMetadata({
  params: { eipOrNo },
}: {
  params: { eipOrNo: string };
}) {
  const eipNo = extractEipNumber(eipOrNo);
  const validEIPData = validEIPs[parseInt(eipNo)];

  const eipMarkdownRes = await fetch(validEIPData.markdownPath).then(
    (response) => response.text()
  );
  const { metadata } = extractMetadata(eipMarkdownRes);
  const metadataJson = convertMetadataToJson(metadata);

  return getMetadata({
    title: `${validEIPData.isERC ? "ERC" : "EIP"}-${eipNo}: ${
      validEIPData.title
    } | EIP.tools`,
    description: metadataJson.description,
    images: `https://eip.tools/api/og?eipNo=${eipNo}`,
  });
}

export default function EIPLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}
