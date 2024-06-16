"use client";

import { useCallback, useEffect, useState } from "react";
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
  Box,
} from "@chakra-ui/react";
import {
  EIPStatus,
  convertMetadataToJson,
  extractEipNumber,
  extractMetadata,
} from "@/utils";
import { validEIPs } from "@/data/validEIPs";
import { EipMetadataJson } from "@/types";

const EIP = ({
  params: { eipOrNo },
}: {
  params: {
    eipOrNo: string; // can be of the form `1234`, `eip-1234` or `eip-1234.md` (standard followed by official EIP)
  };
}) => {
  const eipNo = extractEipNumber(eipOrNo);

  const [metadataJson, setMetadataJson] = useState<EipMetadataJson>();
  const [markdown, setMarkdown] = useState<string>("");
  const [isERC, setIsERC] = useState<boolean>(true);

  const fetchEIPData = useCallback(async () => {
    const validEIPData = validEIPs[parseInt(eipNo)];
    let _isERC = true;

    let eipMarkdownRes = "";

    if (validEIPData) {
      eipMarkdownRes = await fetch(validEIPData.markdownPath).then((response) =>
        response.text()
      );
      _isERC = validEIPData.isERC;
    } else {
      eipMarkdownRes = await fetch(
        `https://raw.githubusercontent.com/ethereum/ERCs/master/ERCS/erc-${eipNo}.md`
      ).then((response) => response.text());

      if (eipMarkdownRes === "404: Not Found") {
        eipMarkdownRes = await fetch(
          `https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-${eipNo}.md`
        ).then((response) => response.text());
        _isERC = false;
      }
    }

    const { metadata, markdown: _markdown } = extractMetadata(eipMarkdownRes);
    setMetadataJson(convertMetadataToJson(metadata));
    setMarkdown(_markdown);
    setIsERC(_isERC);

    // only add to trending if it's a valid EIP
    if (eipMarkdownRes !== "404: Not Found") {
      fetch("/api/logPageVisit", {
        method: "POST",
        body: JSON.stringify({ eipNo: parseInt(eipNo) }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }, [eipNo]);

  useEffect(() => {
    fetchEIPData();
  }, [eipNo, fetchEIPData]);

  return (
    <Center>
      {metadataJson && (
        <Container
          mt={8}
          mx={"10rem"}
          minW={{
            sm: "100%",
            md: "45rem",
            lg: "60rem",
          }}
        >
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
          <Box overflowX={"auto"}>
            <Table variant="simple">
              {metadataJson.author && (
                <Tr>
                  <Th>Authors</Th>
                  <Td>
                    <Box
                      maxH="10rem"
                      overflowY={"auto"}
                      p="2px"
                      sx={{
                        "::-webkit-scrollbar": {
                          w: "10px",
                        },
                        "::-webkit-scrollbar-track ": {
                          bg: "gray.400",
                          rounded: "md",
                        },
                        "::-webkit-scrollbar-thumb": {
                          bg: "gray.500",
                          rounded: "md",
                        },
                      }}
                    >
                      {metadataJson.author.join(", ")}
                    </Box>
                  </Td>
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
          </Box>
          {markdown === "404: Not Found" ? (
            <Center mt={20}>{markdown}</Center>
          ) : (
            <Markdown md={markdown} />
          )}
        </Container>
      )}
    </Center>
  );
};

export default EIP;
