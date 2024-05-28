import {
  VStack,
  Flex,
  Spacer,
  Center,
  Heading,
  Link,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";

export const Navbar = () => {
  return (
    <VStack w="100%">
      <Flex w="100%">
        <Spacer flex="1" />
        <Center pt={"10"}>
          <Heading color="custom.pale" pl="1rem">
            <Link href={"/"}>
              <HStack spacing={"4"}>
                <Image w="3rem" alt="icon" src="/favicon.ico" rounded={"lg"} />
                <Text>EIP.tools</Text>
              </HStack>
            </Link>
          </Heading>
        </Center>
        <Spacer flex="1" />
      </Flex>
    </VStack>
  );
};
