import React, { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import { CopyIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

type CodeBlockProps = {
  children: string;
  language: string;
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ children, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <Box position="relative" overflow="auto" rounded="xl">
      <CopyToClipboard text={children} onCopy={handleCopy}>
        <Button
          size="sm"
          position="absolute"
          top="6px"
          right="4px"
          zIndex="1"
          backgroundColor={"gray.700"}
          color={copied ? "green.300" : "white"}
          _hover={{ backgroundColor: "gray.600" }}
          opacity={0.4}
        >
          {copied ? <CheckCircleIcon /> : <CopyIcon />}
        </Button>
      </CopyToClipboard>
      <SyntaxHighlighter
        language={language}
        style={tomorrow}
        lineProps={{
          style: {
            wordBreak: "break-all",
            whiteSpace: "pre-wrap",
          },
        }}
        wrapLines={true}
      >
        {children}
      </SyntaxHighlighter>
    </Box>
  );
};
