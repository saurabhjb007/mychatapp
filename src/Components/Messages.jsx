import React from "react";
import { Text, Avatar, HStack } from "@chakra-ui/react";

const Messages = ({ text, uri, user = "other" }) => {
  return (
    <HStack
      alignSelf={user === "me" ? "flex-end" : "flex-start"}
      paddingY="1"
      paddingX="2"
      bg="gray.200"
      borderRadius="base"
    >
      {user === "other" && <Avatar size="sm" src={uri} />}
      <Text padding="2">{text}</Text>
      {user === "me" && <Avatar size="sm" src={uri} />}
    </HStack>
  );
};

export default Messages;
