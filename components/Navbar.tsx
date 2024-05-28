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
import { Searchbox } from "@/components/Searchbox";

export const Navbar = () => {
  return (
    <VStack w="100%">
      <Flex w="100%">
        <Spacer flex="1" />
        <Center pt={"10"}>
          <Heading color="custom.pale" pl="1rem">
            <Link href={"/"}>
              <HStack spacing={"4"}>
                <Image w="1.5rem" alt="icon" src="/eth.png" rounded={"lg"} />
                <Text>EIP.tools</Text>
              </HStack>
            </Link>
          </Heading>
        </Center>
        <Spacer flex="1" />
      </Flex>
      <Center mt={2}>
        <Searchbox />
      </Center>
    </VStack>
  );
};
