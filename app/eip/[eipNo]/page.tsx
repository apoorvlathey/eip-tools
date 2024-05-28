import { Container, Heading } from "@chakra-ui/react";

const EIP = ({
  params: { eipNo },
}: {
  params: {
    eipNo: string;
  };
}) => {
  return (
    <Container mt={8} mx={"10rem"}>
      <Heading>EIP-{eipNo}</Heading>
    </Container>
  );
};

export default EIP;
