import {
  Container,
  Flex,
  Box,
  Heading,
  Text,
  IconButton,
  Button,
  VStack,
  HStack,
  Wrap,
  WrapItem,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  Avatar,
  Editable,
  EditableInput,
  EditablePreview
} from '@chakra-ui/react';
import {
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdFacebook,
  MdOutlineEmail,
} from 'react-icons/md';
import { BsGithub, BsDiscord, BsPerson } from 'react-icons/bs';
import { NavBar } from '@/components/NavBar';
import MainLayout from '@/components/MainLayout'
import { Profiler } from 'react';

const user = {
  avatar_url:"#",
  full_name: "Pham Huynh Nhat Truong",
  username: "Tyui",
  upload_at:"00:00",
  email: "TyuiPahm@gmail.com",
  location : "vietnam"
}
const handleSubmit = () => {
  // Perform your submit action here, e.g., update user data in the database
  console.log("Submitting edited user:");
}

 const Profile = () => {
  return (
    <Box bg="#02054B" color="white" borderRadius="lg" p={16} maxWidth="100%" marginTop={-16} overflow="hidden" position="relative">
  <Flex justifyContent="center">
    <Box maxWidth="xl">
      <Flex justifyContent="center">
        <Box textAlign="center">
          <Avatar src={user.avatar_url} size="xl" />
          <Text mt={5} color="gray.500" fontSize="xl">
            Full name: {user.full_name}
          </Text>
        </Box>
      </Flex>
      <VStack spacing={10} alignItems="flex-start" pt={10}>
        <FormControl>
          <FormLabel color="gray.500">Username</FormLabel>
          <InputGroup size="md">
            <Input defaultValue={user.username} />
          </InputGroup>
        </FormControl>
        <FormControl>
          <FormLabel color="gray.500">Email</FormLabel>
          <InputGroup size="md">
            <Input defaultValue={user.email} />
          </InputGroup>
        </FormControl>
        <FormControl>
          <FormLabel color="gray.500">Update at</FormLabel>
          <InputGroup size="md">
            <Input defaultValue={user.upload_at} isReadOnly/>
          </InputGroup>
        </FormControl>
      </VStack>
      <Flex justifyContent="center" mt={10}>
        <Button colorScheme="blue" onClick={handleSubmit}>
          Submit
        </Button>
        <Button colorScheme="blue" marginLeft={1}>
          My tracks
        </Button>
      </Flex>
    </Box>
  </Flex>
</Box>
  );
}
Profile.getLayout = (page: React.ReactElement) => {
  return <MainLayout>
    {page}
    </MainLayout>
}
export default Profile