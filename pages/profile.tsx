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
import { User, createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/typings/supabase'
import Head from 'next/head'
import { useUser } from '@supabase/auth-helpers-react'

type Props = {
    profile: Profile | null
}

let useUser : User | null
const MyProfile = ({profile}: Props) => {
    const user = useUser()
    const handleSubmit = () => {
        // Perform your submit action here, e.g., update user data in the database
        console.log('Submitting edited user:')
    }

    const handleUpdate = () => {
        // Perform your submit action here, e.g., update user data in the database
        console.log('Submitting edited user:')
    }

    if (profile === null) return "Sign in"
    return (
       <div>
           <Head>
               <title>Profile</title>
           </Head>
           <div className="tw-bg-black/30 tw-p-5 tw-m-1 tw-rounded-md">
                <Flex>
                <Box textAlign='center' margin={1}>
                    <Avatar src={profile.avatar_url || undefined} size='xl' />
                </Box>
                <div className='tw-ml-3'>
                <Text color='gray.500' fontSize='xl'>
                    User name: {profile.username}
                </Text>
                <Button className='tw-mt-6' colorScheme='blue' onClick={handleSubmit}>
                    My tracks
                </Button>
                </div>
                </Flex>
           </div>
           <Flex>
           <Box
               bg='blackAlpha.300'
               borderRadius='md'
               p={16}
               maxWidth='100%'
               className='tw-m-1 tw-w-1/2'
           >
               <Flex justifyContent='center'>
                   <Box maxWidth='xl'>
                       
                       <VStack spacing={10} alignItems='flex-start' pt={10}>
                           <FormControl>
                               <FormLabel color='gray.500'>Fullname</FormLabel>
                               <InputGroup size='md'>
                                   <Input defaultValue={profile.full_name|| ""} />
                               </InputGroup>
                           </FormControl>
                           <FormControl>
                               <FormLabel color='gray.500'>Email</FormLabel>
                               <InputGroup size='md'>
                                   <Input defaultValue={useUser?.email || ""} />
                               </InputGroup>
                           </FormControl>
                           <FormControl>
                               <FormLabel color='gray.500'>Password</FormLabel>
                               <InputGroup size='md'>
                                   <Input defaultValue={""} />
                               </InputGroup>
                           </FormControl>
                       </VStack>
                       <Flex justifyContent='center' mt={10}>
                           <Button colorScheme='blue' onClick={handleUpdate}>
                               Update
                           </Button>
                       </Flex>
                   </Box>
               </Flex>
           </Box>
           <Box
               bg='blackAlpha.300'
               borderRadius='md'
               p={16}
               maxWidth='100%'
               className='tw-m-1 tw-w-1/2'
           >
               <Flex justifyContent='center'>
                   <Box maxWidth='xl'>
                       <VStack spacing={10} alignItems='flex-start' pt={10}>
                           <FormControl>
                               <FormLabel color='gray.500'>Old Password</FormLabel>
                               <InputGroup size='md'>
                                   <Input defaultValue={""} />
                               </InputGroup>
                           </FormControl>
                           <FormControl>
                               <FormLabel color='gray.500'>New Password</FormLabel>
                               <InputGroup size='md'>
                                   <Input defaultValue={""} />
                               </InputGroup>
                           </FormControl>
                           <FormControl>
                               <FormLabel color='gray.500'>Confirm New Password</FormLabel>
                               <InputGroup size='md'>
                                   <Input defaultValue={""} />
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
           </Flex>
       </div>
    )
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

    if (error)
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