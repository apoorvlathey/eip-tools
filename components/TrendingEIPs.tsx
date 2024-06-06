import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  GridItem,
  Heading,
  SimpleGrid,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { validEIPs } from "@/data/validEIPs";
import { EIPStatus } from "@/utils";

interface TrendingEIP {
  _id: number;
  count: number;
}

const EIPGridItem = ({ eipNo }: { eipNo: number }) => {
  const router = useRouter();

  const { isERC, title, status } = validEIPs[eipNo];

  return (
    <GridItem
      minH="5rem"
      p="4"
      border="2px solid"
      borderColor={"gray.500"}
      bg={"white"}
      color={"black"}
      cursor={"pointer"}
      transition="all 0.1s ease-in-out"
      _hover={{
        bgColor: "gray.600",
        color: "white",
        borderColor: "blue.300",
      }}
      onClick={() => {
        router.push(`/eip/${eipNo}`);
      }}
      rounded="lg"
    >
      {status && (
        <Badge
          p={1}
          bg={EIPStatus[status]?.bg ?? "cyan.500"}
          fontWeight={700}
          rounded="md"
        >
          {EIPStatus[status]?.prefix} {status}
        </Badge>
      )}
      <Heading mt={2} fontSize={"30"}>
        {isERC ? "ERC" : "EIP"}-{eipNo}
      </Heading>
      <Text>{title}</Text>
    </GridItem>
  );
};

export const TrendingEIPs = () => {
  const [trendingEIPs, setTrendingEIPs] = useState<TrendingEIP[]>([]);

  useEffect(() => {
    const fetchTrendingPages = async () => {
      const response = await fetch("/api/getTrendingEIPs");
      const data = await response.json();
      setTrendingEIPs(data);
    };

    fetchTrendingPages();
  }, []);

  return (
    <Box mt={10} px={10}>
      <Box>
        <Heading>Trending EIPs 💹</Heading>
        <Text fontSize={"md"} fontWeight={200}>
          (Most viewed: Last 7 days)
        </Text>
      </Box>
      <Box mt={4}>
        <SimpleGrid columns={3} spacing={4}>
          {trendingEIPs.length > 0
            ? trendingEIPs.map(({ _id: eipNo }) => (
                <EIPGridItem key={eipNo} eipNo={eipNo} />
              ))
            : [1, 2, 3].map((i) => <Skeleton key={i} h="10rem" rounded="lg" />)}
        </SimpleGrid>
      </Box>
    </Box>
  );
};
