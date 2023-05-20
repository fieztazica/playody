import {
    Flex,
    Box,
    Text,
    Button,
    VStack,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    Avatar,
} from '@chakra-ui/react'
import MainLayout from '@/components/MainLayout'
import * as React from 'react'
import { GetServerSideProps } from 'next'
import { Profile } from '@/typings'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/typings/supabase'
import Head from 'next/head'

<<<<<<< HEAD
const user = {
  avatar_url:"#",
  full_name: "Pham Huynh Nhat Truong",
  username: "Tyui",
  upload_at:"00:00",
  email: "TyuiPahm@gmail.com",
  location : "vietnam"
}


 const Profile = () => {

  const handleSubmit = () => {
    // Perform your submit action here, e.g., update user data in the database
    console.log("Submitting edited user:");
  }
  return (
    <Box className='tw-h-full tw-bg-black/20' color="white" borderRadius="lg" p={16} maxWidth="100%" marginTop={0} overflow="hidden">
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
=======
type Props = {
    profile: Profile | null
}

const MyProfile = ({profile}: Props) => {
    const handleSubmit = () => {
        // Perform your submit action here, e.g., update user data in the database
        console.log('Submitting edited user:')
    }

    if (profile === null) return "Sign in"

    return (
       <>
           <Head>
               <title>Profile</title>
           </Head>
           <Box
               bg='blackAlpha.300'
               borderRadius='md'
               p={16}
               maxWidth='100%'
           >
               <Flex justifyContent='center'>
                   <Box maxWidth='xl'>
                       <Flex justifyContent='center'>
                           <Box textAlign='center'>
                               <Avatar src={profile.avatar_url || undefined} size='xl' />
                               <Text mt={5} color='gray.500' fontSize='xl'>
                                   Full name: {profile.full_name}
                               </Text>
                           </Box>
                       </Flex>
                       <VStack spacing={10} alignItems='flex-start' pt={10}>
                           <FormControl>
                               <FormLabel color='gray.500'>Username</FormLabel>
                               <InputGroup size='md'>
                                   <Input defaultValue={profile.username || ""} />
                               </InputGroup>
                           </FormControl>
                           <FormControl>
                               <FormLabel color='gray.500'>Email</FormLabel>
                               <InputGroup size='md'>
                                   <Input defaultValue={profile.username || ""} />
                               </InputGroup>
                           </FormControl>
                       </VStack>
                       <Flex justifyContent='center' mt={10}>
                           <Button colorScheme='blue' onClick={handleSubmit}>
                               Submit
                           </Button>
                       </Flex>
                   </Box>
               </Flex>
           </Box>
       </>
    )
>>>>>>> main
}

MyProfile.getLayout = (page: React.ReactNode) => {
    return <MainLayout>
        {page}
    </MainLayout>
}
export default MyProfile
export const getServerSideProps: GetServerSideProps<{
    profile: Profile | null
}> = async (ctx) => {
    const supabaseClient = createServerSupabaseClient<Database>(ctx)
    const { data, error } = await supabaseClient.auth.getUser()

    if (error || data.user?.app_metadata.role !== 'admin')
        return {
            notFound: true,
        }

    const profile = await supabaseClient
        .from('profiles')
        .select('*')
        .eq("id", `${data.user.id}`)
        .limit(1)

    if (profile.error || !profile.data) {
        return {
            notFound: true,
        }
    }

    console.log(profile.data)
    return {
        props: {
            profile: profile.data.shift() || null,
        },
    }
}