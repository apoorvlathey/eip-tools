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
  HStack,
  Badge,
  Tooltip,
} from "@chakra-ui/react";
import {
  EIPStatus,
  convertMetadataToJson,
  extractEipNumber,
  extractMetadata,
} from "@/utils";
import { validEIPs } from "@/data/validEIPs";

const EIP = async ({
  params: { eipOrNo },
}: {
  params: {
    eipOrNo: string; // can be of the form `1234`, `eip-1234` or `eip-1234.md` (standard followed by official EIP)
  };
}) => {
  const eipNo = extractEipNumber(eipOrNo);
  const validEIPData = validEIPs[parseInt(eipNo)];
  let isERC = true;

  // fetched server-side (cache: "force-cache" [default])
  let eipMarkdownRes = "";

  // if we have data in validEIPs
  if (validEIPData) {
    eipMarkdownRes = await fetch(validEIPData.markdownPath).then((response) =>
      response.text()
    );
    isERC = validEIPData.isERC;
  } else {
    // if no data in validEIPs (new EIP/ERC created after we generated the validEIPs list)
    // most EIPs are ERCs, so fetching them first
    eipMarkdownRes = await fetch(
      `https://raw.githubusercontent.com/ethereum/ERCs/master/ERCS/erc-${eipNo}.md`
    ).then((response) => response.text());

    // if not an ERC, then EIP
    if (eipMarkdownRes === "404: Not Found") {
      eipMarkdownRes = await fetch(
        `https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-${eipNo}.md`
      ).then((response) => response.text());
      isERC = false;
    }
  }

  const { metadata, markdown } = extractMetadata(eipMarkdownRes);
  const metadataJson = convertMetadataToJson(metadata);

  return (
    <Center w={"100%"}>
      <Container mt={8} mx={"10rem"} minW="60rem">
        <HStack>
          <Tooltip label={EIPStatus[metadataJson.status]?.description}>
            <Badge
              p={1}
              bg={EIPStatus[metadataJson.status]?.bg ?? "cyan.500"}
              fontWeight={700}
              rounded="md"
            >
              {EIPStatus[metadataJson.status]?.prefix} {metadataJson.status}
            </Badge>
          </Tooltip>
          <Badge p={1} bg={"blue.500"} fontWeight={"bold"} rounded="md">
            {metadataJson.type}: {metadataJson.category}
          </Badge>
        </HStack>
        <Heading>
          {isERC ? "ERC" : "EIP"}-{eipNo}: {metadataJson.title}
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
          {metadataJson.requires && metadataJson.requires.length > 0 && (
            <Tr>
              <Th>Requires</Th>
              <Td>
                <HStack>
                  {metadataJson.requires.map((req, i) => (
                    <NLink key={i} href={`/eip/${req}`}>
                      <Text
                        color={"blue.400"}
                        _hover={{ textDecor: "underline" }}
                      >
                        {validEIPs[req].isERC ? "ERC" : "EIP"}-{req}
                      </Text>
                    </NLink>
                  ))}
                </HStack>
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
