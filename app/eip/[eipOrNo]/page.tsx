import { Markdown } from "@/components/Markdown";
import NLink from "next/link";
import {
  Container,
  Heading,
  Center,
  Text,
  Table,
  Tr,
  Td,
  Th,
  Link,
} from "@chakra-ui/react";

const extractMetadata = (text: string) => {
  const regex = /---\n([\s\S]*?)\n---\n([\s\S]*)/;
  const match = text.match(regex);

  if (match) {
    return {
      metadata: match[1],
      markdown: match[2],
    };
  } else {
    return {
      metadata: "",
      markdown: text,
    };
  }
};

type EipMetadataJson = {
  eip: number;
  title: string;
  description: string;
  author: string[];
  "discussions-to": string;
  status: string;
  type: string;
  category: string;
  created: string;
  requires: number;
};

const convertMetadataToJson = (text: string): EipMetadataJson => {
  const lines = text.split("\n");
  const jsonObject: any = {};

  lines.forEach((line) => {
    const [key, value] = line.split(/: (.+)/);
    if (key && value) {
      if (key.trim() === "eip" || key.trim() === "requires") {
        jsonObject[key.trim()] = parseInt(value.trim(), 10);
      } else if (key.trim() === "author") {
        jsonObject[key.trim()] = value
          .split(",")
          .map((author: string) => author.trim());
      } else {
        jsonObject[key.trim()] = value.trim();
      }
    }
  });

  return jsonObject as EipMetadataJson;
};

const extractEipNumber = (eipOrNo: string): string => {
  const match = eipOrNo.match(/^eip-(\d+)(?:\.md)?$|^(\d+)$/);
  if (match) {
    return match[1] || match[2];
  } else {
    throw new Error("Invalid EIP format");
  }
};

const EIP = async ({
  params: { eipOrNo },
}: {
  params: {
    eipOrNo: string; // can be of the form `1234`, `eip-1234` or `eip-1234.md` (standard followed by official EIP)
  };
}) => {
  const eipNo = extractEipNumber(eipOrNo);
  let isEIP = false;

  // fetched server-side (cache: "force-cache" [default])
  // most EIPs are ERCs
  let eipMarkdownRes: string = await fetch(
    `https://raw.githubusercontent.com/ethereum/ercs/master/ERCS/erc-${eipNo}.md`
  ).then((response) => response.text());

  // if not an ERC, then EIP
  if (eipMarkdownRes === "404: Not Found") {
    eipMarkdownRes = await fetch(
      `https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-${eipNo}.md`
    ).then((response) => response.text());
    isEIP = true;
  }

  const { metadata, markdown } = extractMetadata(eipMarkdownRes);
  let metadataJson = convertMetadataToJson(metadata);

  return (
    <Center w={"100%"}>
      <Container mt={8} mx={"10rem"} minW="60rem">
        <Heading>
          {isEIP ? "EIP" : "ERC"}-{eipNo}: {metadataJson.title}
        </Heading>
        <Text size="md">{metadataJson.description}</Text>
        <Table>
          {metadataJson.author && (
            <Tr>
              <Th>Authors</Th>
              <Td>{metadataJson.author.join(", ")}</Td>
            </Tr>
          )}
          {metadataJson.created && (
            <Tr>
              <Th>Created</Th>
              <Td>{metadataJson.created}</Td>
            </Tr>
          )}
          {metadataJson["discussions-to"] && (
            <Tr>
              <Th>Discussion Link</Th>
              <Td>
                <Link
                  href={metadataJson["discussions-to"]}
                  color={"blue.400"}
                  isExternal
                >
                  {metadataJson["discussions-to"]}
                </Link>
              </Td>
            </Tr>
          )}
          {metadataJson.requires > 0 && (
            <Tr>
              <Th>Requires</Th>
              <Td>
                <NLink href={`/eip/${metadataJson.requires}`}>
                  <Text color={"blue.400"} _hover={{ textDecor: "underline" }}>
                    EIP-{metadataJson.requires}
                  </Text>
                </NLink>
              </Td>
            </Tr>
          )}
        </Table>
        {markdown === "404: Not Found" ? (
          <Center mt={20}>{markdown}</Center>
        ) : (
          <Markdown md={markdown} />
        )}
      </Container>
    </Center>
  );
};

export default EIP;
