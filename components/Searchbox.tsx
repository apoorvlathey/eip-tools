"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { InputGroup, Input, InputRightElement, Button } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

export const Searchbox = () => {
  const router = useRouter();

  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (input = userInput) => {
    if (input.length > 0) {
      setIsLoading(true);
      router.push(`/eip/${input}`);
    }
  };

  return (
    <InputGroup w="30rem">
      <Input
        autoFocus
        placeholder="EIP or ERC #"
        value={userInput}
        onChange={(e) => {
          setUserInput(e.target.value);
        }}
        onPaste={(e) => {
          e.preventDefault();
          setIsLoading(true);
          const pastedData = e.clipboardData.getData("Text");
          setUserInput(pastedData);
          handleSearch(pastedData);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <InputRightElement w="4rem">
        <Button
          mr="0.5rem"
          w="100%"
          size="sm"
          onClick={() => handleSearch()}
          isLoading={isLoading}
        >
          <SearchIcon />
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};
