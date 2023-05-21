// @flow
import * as React from 'react'
import { Avatar, Box, Flex, Text } from '@chakra-ui/react'
import { Profile } from '@/typings'
import useProfile from '@/lib/hooks/useProfile'


export default function ChangeAvatarForm() {
    const profile = useProfile()
    if (!profile) return null
    return (
        <Flex align={"center"}>
            <Box textAlign='center' margin={1}>
                <Avatar src={profile.avatar_url || undefined} size={
                    {
                        base: 'md',
                        md: 'xl',
                    }
                } />
            </Box>
            <div className='tw-ml-3'>
                <Text color='whiteAlpha.800' fontSize='xl'>
                    {profile.full_name}
                </Text>
                <Text color='gray.500' fontSize='sm'>
                    {profile.id}
                </Text>
            </div>
        </Flex>
    )
}