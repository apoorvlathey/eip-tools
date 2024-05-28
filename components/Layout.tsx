import { ReactNode } from "react";
import { Box } from "@chakra-ui/react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Box display={"flex"} flexDir={"column"} minHeight="100vh">
      <Box flexGrow={1}>
        <Navbar />
        {children}
      </Box>
      <Footer />
    </Box>
  );
};
