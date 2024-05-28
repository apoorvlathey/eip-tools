import {
  Box,
  Container,
  Stack,
  VStack,
  Center,
  Heading,
  Link,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export const Footer = () => {
  return (
    <Box
      flexShrink={0}
      mt="6rem"
      bg={"blackAlpha.500"}
      color={"gray.200"}
      borderTop={"solid"}
      borderTopWidth={1}
      borderColor={"custom.greenDarker"}
    >
      <Container as={Stack} maxW={"8xl"} py={10}>
        <VStack spacing={5}>
          <Center flexDir={"column"}>
            <Heading size="md">
              <Link
                color={"white"}
                href="https://github.com/apoorvlathey/eip-tools"
                isExternal
              >
                <FontAwesomeIcon icon={faGithub} size="lg" />
              </Link>
            </Heading>
          </Center>
        </VStack>
      </Container>
    </Box>
  );
};
