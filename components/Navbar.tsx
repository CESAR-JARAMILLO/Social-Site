import React from 'react';
import { Box, IconButton, Flex, Link } from "@chakra-ui/react";
import { FiHome, FiUser } from "react-icons/fi";

const Navbar = () => {
  return (
    <Flex justifyContent="space-around" alignItems="center" py={4} bg="blue.500">
      <Link href="/" as="a">
        <IconButton
          aria-label="Home"
          icon={<FiHome size={24} />}
          color="white"
          variant="ghost"
        />
      </Link>

      <Link href="/account" as="a">
        <IconButton
          aria-label="Account"
          icon={<FiUser size={24} />}
          color="white"
          variant="ghost"
        />
      </Link>
    </Flex>
  );
};

export default Navbar;
