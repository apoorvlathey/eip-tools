import {
  Heading,
  Link,
  Text,
  Code,
  Divider,
  Image,
  UnorderedList,
  OrderedList,
  Checkbox,
  ListItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  chakra,
  Box,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// import ChakraUIRenderer from "chakra-ui-markdown-renderer"; // throwing error for <chakra.pre> and chakra factory not working, so borrowing its logic here
import { CodeBlock } from "./CodeBlock";

type GetCoreProps = {
  children?: React.ReactNode;
  "data-sourcepos"?: any;
};

function getCoreProps(props: GetCoreProps): any {
  return props["data-sourcepos"]
    ? { "data-sourcepos": props["data-sourcepos"] }
    : {};
}

export const Markdown = ({ md }: { md: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: (props) => {
          const { children } = props;
          return <Text mb={2}>{children}</Text>;
        },
        em: (props) => {
          const { children } = props;
          return <Text as="em">{children}</Text>;
        },
        blockquote: (props) => {
          const { children } = props;
          return (
            <Code as="blockquote" p={2} rounded={"lg"}>
              {children}
            </Code>
          );
        },
        code: (props) => {
          const { children, className } = props;
          // className is of the form `language-{languageName}`
          const match = /language-(\w+)/.exec(className || "");

          if (!match) {
            return (
              <Code mt={1} p={1} rounded={"lg"}>
                {children}
              </Code>
            );
          }

          const language = match[1] ?? "javascript";
          return (
            <CodeBlock language={language}>{children as string}</CodeBlock>
          );
        },
        del: (props) => {
          const { children } = props;
          return <Text as="del">{children}</Text>;
        },
        hr: (props) => {
          return <Divider />;
        },
        a: (props) => {
          return <Link {...props} color="blue.500" />;
        },
        img: Image,
        text: (props) => {
          const { children } = props;
          return <Text as="span">{children}</Text>;
        },
        ul: (props) => {
          const { ordered, children, depth } = props;
          const attrs = getCoreProps(props);
          let Element = UnorderedList;
          let styleType = "disc";
          if (ordered) {
            Element = OrderedList;
            styleType = "decimal";
          }
          if (depth === 1) styleType = "circle";
          return (
            <Element
              spacing={2}
              as={ordered ? "ol" : "ul"}
              styleType={styleType}
              pl={4}
              {...attrs}
            >
              {children}
            </Element>
          );
        },
        ol: (props) => {
          const { ordered, children, depth } = props;
          const attrs = getCoreProps(props);
          let Element = UnorderedList;
          let styleType = "disc";
          if (ordered) {
            Element = OrderedList;
            styleType = "decimal";
          }
          if (depth === 1) styleType = "circle";
          return (
            <Element
              spacing={2}
              as={ordered ? "ol" : "ul"}
              styleType={styleType}
              pl={4}
              {...attrs}
            >
              {children}
            </Element>
          );
        },
        li: (props) => {
          const { children, checked } = props;
          let checkbox = null;
          if (checked !== null && checked !== undefined) {
            checkbox = (
              <Checkbox isChecked={checked} isReadOnly>
                {children}
              </Checkbox>
            );
          }
          return (
            <ListItem
              {...getCoreProps(props)}
              listStyleType={checked !== null ? "none" : "inherit"}
            >
              {checkbox || children}
            </ListItem>
          );
        },
        h1: (props) => {
          return (
            <Heading my={4} as={`h1`} size={"2xl"} {...getCoreProps(props)}>
              {props.children}
            </Heading>
          );
        },
        h2: (props) => {
          return (
            <Heading my={4} as={`h2`} size={"xl"} {...getCoreProps(props)}>
              {props.children}
            </Heading>
          );
        },
        h3: (props) => {
          return (
            <Heading my={4} as={`h3`} size={"lg"} {...getCoreProps(props)}>
              {props.children}
            </Heading>
          );
        },
        h4: (props) => {
          return (
            <Heading my={4} as={`h4`} size={"md"} {...getCoreProps(props)}>
              {props.children}
            </Heading>
          );
        },
        h5: (props) => {
          return (
            <Heading my={4} as={`h5`} size={"sm"} {...getCoreProps(props)}>
              {props.children}
            </Heading>
          );
        },
        h6: (props) => {
          return (
            <Heading my={4} as={`h6`} size={"xs"} {...getCoreProps(props)}>
              {props.children}
            </Heading>
          );
        },
        pre: (props) => {
          const { children } = props;
          return <Code {...getCoreProps(props)}>{children}</Code>;
        },
        table: (props) => (
          <Box overflowX={"auto"}>
            <Table variant="simple">{props.children}</Table>
          </Box>
        ),
        thead: Thead,
        tbody: Tbody,
        tr: (props) => <Tr>{props.children}</Tr>,
        td: (props) => (
          <Td borderRight="1px solid" borderColor="gray.500">
            {props.children}
          </Td>
        ),
        th: (props) => (
          <Th borderRight="1px solid" borderColor="gray.500">
            {props.children}
          </Th>
        ),
      }}
    >
      {md}
    </ReactMarkdown>
  );
};
