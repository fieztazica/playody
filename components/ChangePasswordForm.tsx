// @flow
import * as React from 'react'
import { Box, Button, Flex, FormControl, FormLabel, Input, InputGroup, VStack } from '@chakra-ui/react'

type Props = {

};

export default function ChangePasswordForm(props: Props) {
    return (
        <Box maxWidth='xl'>
            <VStack spacing={10} alignItems='flex-start'>
                <FormControl>
                    <FormLabel color='gray.500'>Old Password</FormLabel>
                    <InputGroup size='md'>
                        <Input defaultValue={''} />
                    </InputGroup>
                </FormControl>
                <FormControl>
                    <FormLabel color='gray.500'>New Password</FormLabel>
                    <InputGroup size='md'>
                        <Input defaultValue={''} />
                    </InputGroup>
                </FormControl>
                <FormControl>
                    <FormLabel color='gray.500'>Confirm New Password</FormLabel>
                    <InputGroup size='md'>
                        <Input defaultValue={''} />
                    </InputGroup>
                </FormControl>
            </VStack>
            <Flex justifyContent='center' mt={10}>
                <Button colorScheme='blue'>
                    Submit
                </Button>
            </Flex>
        </Box>
    )
}