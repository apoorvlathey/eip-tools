"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  InputGroup,
  Input,
  InputRightElement,
  Button,
  List,
  ListItem,
  Box,
  HStack,
  Text,
  Badge,
  Spacer,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { EIPStatus, extractEipNumber } from "@/utils";
import { validEIPs } from "@/data/validEIPs";

const validEIPsArray = Object.keys(validEIPs).map((key) => parseInt(key));

export const Searchbox = () => {
  const router = useRouter();

  const [userInput, setUserInput] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [hideSuggestions, setHideSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleSearch = (input = userInput) => {
    if (input.length > 0) {
      setIsLoading(true);
      try {
        extractEipNumber(input);
        router.push(`/eip/${input}`);
      } catch {
        setIsInvalid(true);
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex(
        (prevIndex) => (prevIndex + 1) % searchSuggestions.length
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prevIndex) =>
        prevIndex === 0 ? searchSuggestions.length - 1 : prevIndex - 1
      );
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < searchSuggestions.length) {
        handleSearch(
          searchSuggestions[selectedIndex]
            .toString()
            .split("-")[1]
            .split(":")[0]
        );
      } else {
        handleSearch();
      }
    }
  };

  useEffect(() => {
    setSelectedIndex(-1); // Reset selected index when search suggestions change
  }, [searchSuggestions]);

  return (
    <Box position="relative">
      <InputGroup
        w={{
          base: userInput.length ? "22rem" : "20rem",
          sm: userInput.length ? "40rem" : "30rem",
          md: userInput.length ? "40rem" : "30rem",
          lg: userInput.length ? "50rem" : "30rem",
        }}
        transition="width 0.2s ease-in-out"
      >
        <Input
          autoFocus
          placeholder="EIP / ERC No. or title"
          value={userInput}
          onChange={(e) => {
            if (isInvalid) {
              // reset on new input
              setIsInvalid(false);
            }

            setUserInput(e.target.value);
            // Filter the valid search queries based on the user input
            let suggestions = validEIPsArray.filter(
              (validEIP) =>
                // match with EIP number or title
                validEIP
                  .toString()
                  .toLowerCase()
                  .includes(e.target.value.toLowerCase()) ||
                validEIPs[validEIP].title
                  .toLowerCase()
                  .includes(e.target.value.toLowerCase())
            );
            if (e.target.value.length === 0) {
              suggestions = [];
            }

            setSearchSuggestions(
              suggestions.map(
                (suggestion) =>
                  `${
                    validEIPs[suggestion].isERC ? "ERC-" : "EIP-"
                  }${suggestion}: ${validEIPs[suggestion].title}`
              )
            );
          }}
          onPaste={(e) => {
            e.preventDefault();
            setIsLoading(true);
            const pastedData = e.clipboardData.getData("Text");
            setUserInput(pastedData);
            handleSearch(pastedData);
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            setTimeout(() => {
              setHideSuggestions(true);
            }, 100); // Delay of 100ms (so click on suggestion item is registered)
          }}
          onFocus={() => {
            setHideSuggestions(false);
          }}
          isInvalid={isInvalid}
        />
        <InputRightElement w="4rem">
          <Button
            mr="0.5rem"
            w="100%"
            size="sm"
            colorScheme={isInvalid ? "red" : "blue"}
            onClick={() => handleSearch()}
            isLoading={isLoading}
          >
            <SearchIcon />
          </Button>
        </InputRightElement>
      </InputGroup>
      {searchSuggestions.length > 0 && (
        <List
          mt={2}
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
          bg="white"
          zIndex={9999}
          position="absolute"
          width="100%"
          maxHeight="20rem"
          overflowY="auto"
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
          display={hideSuggestions ? "none" : "block"}
        >
          {searchSuggestions.map((suggestion, index) => {
            // suggestion = "ERC-1234: description"
            const eip = suggestion.split("-")[1].split(":")[0];
            const eipNo = parseInt(eip);
            const status = validEIPs[eipNo].status;

            return (
              <ListItem
                key={index}
                color={"black"}
                px={4}
                py={2}
                _hover={{ bg: "gray.100" }}
                bg={selectedIndex === index ? "gray.200" : "white"}
                cursor={"pointer"}
                rounded="lg"
                onClick={() => {
                  setIsLoading(true);
                  handleSearch(eip);
                }}
              >
                <HStack>
                  <Text>{suggestion}</Text>
                  <Spacer />
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
                </HStack>
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
};
