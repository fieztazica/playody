// @flow
import * as React from 'react'
import { Box, Button, Flex, FormControl, FormLabel, Input, InputGroup, VStack } from '@chakra-ui/react'
import { useUser } from '@supabase/auth-helpers-react'
import { Profile } from '@/typings'
import useProfile from '@/lib/hooks/useProfile'
import { useState } from 'react'


export default function ChangeInfoForm() {
    const user = useUser()
    const profile = useProfile()
    const [updating, setUpdating] = useState(false)

    if (!profile) return null

    return (
        <Box maxWidth='xl'>
            <form>
                <VStack spacing={10} alignItems='flex-start'>
                    <FormControl>
                        <FormLabel color='gray.500'>Fullname</FormLabel>
                        <InputGroup size='md'>
                            <Input defaultValue={profile.full_name || ''} />
                        </InputGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel color='gray.500'>Email</FormLabel>
                        <InputGroup size='md'>
                            <Input defaultValue={user?.email || ''} />
                        </InputGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel color='gray.500'>Password</FormLabel>
                        <InputGroup size='md'>
                            <Input defaultValue={''} />
                        </InputGroup>
                    </FormControl>
                </VStack>
                <Flex justifyContent='center' mt={10}>
                    <Button colorScheme='blue'>
                        Update
                    </Button>
                </Flex>
            </form>
        </Box>
    )
}