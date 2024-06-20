// add this to prevent the build command from static generating this page
export const dynamic = "force-dynamic";

import { validEIPs } from "@/data/validEIPs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { untrustedData } = await req.json();

  if (untrustedData.inputText && untrustedData.inputText.length > 0) {
    try {
      const eipNo = parseInt(untrustedData.inputText as string);
      const validEIP = validEIPs[eipNo];

      const imageUrl = `${process.env["HOST"]}/api/og?eipNo=${eipNo}`;
      const postUrl = `${process.env["HOST"]}/api/frame/home`;

      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>EIP.tools</title>
            <meta property="og:title" content="EIP.tools" />
            <meta property="og:image" content="${imageUrl}" />

            <meta name="fc:frame" content="vNext" />
            <meta name="fc:frame:image" content="${imageUrl}" />
            <meta name="fc:frame:post_url" content="${postUrl}" />
            
            <meta name="fc:frame:input:text" content="Enter EIP/ERC No" />
            <meta name="fc:frame:button:1" content="Search 🔎" />

            <meta name="fc:frame:button:2" content="📙 ${
              validEIP.isERC ? "ERC" : "EIP"
            }-${eipNo}" />
          <meta name="fc:frame:button:2:action" content="link" />
          <meta name="fc:frame:button:2:target" content="${
            process.env["HOST"]
          }/eip/${eipNo}" />


          <meta name="of:version" content="vNext" />
          <meta name="of:accepts:anonymous" content=true" />
          <meta name="of:image" content="${imageUrl}" />
          <meta name="of:post_url" content="${postUrl}" />
            
          <meta name="of:input:text" content="Enter EIP/ERC No" />
          <meta name="of:button:1" content="Search 🔎" />

          <meta name="of:button:2" content="📙 ${
            validEIP.isERC ? "ERC" : "EIP"
          }-${eipNo}" />
          <meta name="of:button:2:action" content="link" />
          <meta name="of:button:2:target" content="${
            process.env["HOST"]
          }/eip/${eipNo}" />
          </head>
          <body/>
        </html>`,
        {
          status: 200,
          headers: {
            "Content-Type": "text/html",
          },
        }
      );
    } catch {}
  }

  // return back the same frame if no / invalid input received
  const imageUrl = `${process.env["HOST"]}/og/index.png?date=${Date.now()}`;
  const postUrl = `${process.env["HOST"]}/api/frame/home`;

  return new NextResponse(
    `<!DOCTYPE html>
      <html>
        <head>
          <title>EIP.tools</title>
          <meta property="og:title" content="EIP.tools" />
          <meta property="og:image" content="${imageUrl}" />

          <meta name="fc:frame" content="vNext" />
          <meta name="fc:frame:image" content="${imageUrl}" />
          <meta name="fc:frame:post_url" content="${postUrl}" />
          
          <meta name="fc:frame:input:text" content="Enter EIP/ERC No" />
          <meta name="fc:frame:button:1" content="Search ⚡" />

          <meta name="of:version" content="vNext" />
          <meta name="of:accepts:anonymous" content=true" />
          <meta name="of:image" content="${imageUrl}" />
          <meta name="of:post_url" content="${postUrl}" />
          <meta name="of:input:text" content="Enter EIP/ERC No" />
          <meta name="of:button:1" content="Search ⚡" />
        </head>
        <body/>
      </html>`,
    {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
}
