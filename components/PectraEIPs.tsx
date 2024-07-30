"use client";

import { Box, Heading, Text, Flex } from "@chakra-ui/react";
import { EIPGridItem } from "./TrendingEIPs";

export const PectraEIPs = () => {
  const pectraEIPsArray = [
    7600, 2537, 2935, 6110, 7002, 7251, 7549, 7594, 7685, 7702, 7692,
  ];

  return (
    <Box mt={10} px={10}>
      <Box>
        <Heading>🍴 Pectra Hardfork</Heading>
        <Text fontSize={"md"} fontWeight={200}>
          (EIPs scheduled for inclusion in the Prague-Electra Hardfork)
        </Text>
      </Box>
      <Box
        mt={4}
        overflowX="auto"
        sx={{
          "::-webkit-scrollbar": {
            h: "12px",
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
        <Flex direction="row" minW="max-content" pb="2">
          {pectraEIPsArray.map((eipNo) => (
            <EIPGridItem key={eipNo} eipNo={eipNo} />
          ))}
        </Flex>
      </Box>
    </Box>
  );
};
