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
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import _validEIPs from "@/data/valid-eips.json";
import { extractEipNumber } from "@/app/eip/[eipOrNo]/page";

type ValidEIPs = {
  [key: number]: {
    title: string;
  };
};

const validEIPs: ValidEIPs = _validEIPs;

const validEIPsArray = Object.keys(validEIPs).map((key) => parseInt(key));

export const Searchbox = () => {
  const router = useRouter();

  const [userInput, setUserInput] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleSearch = (input = userInput) => {
    if (input.length > 0) {
      setIsLoading(true);
      try {
        extractEipNumber(input);
        router.push(`/eip/${input}`);
      } catch {
        setIsInvalid(true);
      } finally {
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
        handleSearch(searchSuggestions[selectedIndex].toString().split(":")[0]);
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
      <InputGroup w="30rem">
        <Input
          autoFocus
          placeholder="EIP or ERC #"
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
                (suggestion) => `${suggestion}: ${validEIPs[suggestion].title}`
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
        >
          {searchSuggestions.map((suggestion, index) => (
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
                handleSearch(suggestion.split(":")[0]);
              }}
            >
              {suggestion}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};
