import React from 'react';
import { Box, IconButton, Flex, Link } from "@chakra-ui/react";
import { FiHome, FiUser, FiLogOut, FiLogIn } from "react-icons/fi";
import { signOut } from '@/pages/api/auth';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';

const Navbar = () => {
  const router = useRouter()
  const user = useUser()

  const handleLogout = async () => {
    await signOut();
    router.push('/login')
  };

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
      
      <>
        {user ? (
          <Link as="a" onClick={handleLogout}>
          <IconButton
            aria-label="Account"
            icon={<FiLogOut size={24} />}
            color="white"
            variant="ghost"
          />
        </Link>
        ) : (
          <Link as="a" href='/'>
            <IconButton
              aria-label="Account"
              icon={<FiLogIn size={24} />}
              color="white"
              variant="ghost"
            />
          </Link>
        )}
      </>
    </Flex>
  );
};

export default Navbar;
