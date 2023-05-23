// @flow
import * as React from 'react'
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    InputGroup, InputRightElement,
    VStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Database } from '@/typings/supabase'

export default function ChangePasswordForm() {
    const supabase = useSupabaseClient<Database>()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async () => {
        try {
            setSubmitting(true)
            if (!newPassword || !currentPassword || !repeatPassword) {
                throw {
                    message: 'One or more fields are missing',
                }
            }

            if (newPassword != repeatPassword) {
                throw {
                    message: 'Passwords dont match',
                }
            }

            if (currentPassword == newPassword) {
                throw {
                    message: 'Its your current password!',
                }
            }

            const { data, error } = await supabase.rpc('change_user_password', {
                current_plain_password: `${currentPassword}`,
                new_plain_password: `${newPassword}`,
            })

            if (error) {
                throw error
            }

            if (data) {
                alert('Your password has been changed!')
                setRepeatPassword('')
                setCurrentPassword('')
                setNewPassword('')
            }
        } catch (e: any) {
            if (e.message) {
                alert(e.message)
            }
            console.error(e)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Box maxWidth='xl'>
            <form onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
            }}>
                <VStack spacing={10} alignItems='flex-start'>
                    <FormControl isRequired={true}>
                        <FormLabel color='gray.500'>Current Password</FormLabel>
                        <InputGroup size='md'>
                            <Input type={showPassword ? 'text' : 'password'} value={currentPassword} onChange={(e) => {
                                e.preventDefault()
                                setCurrentPassword(e.target.value)
                            }} />
                            <InputRightElement w={'4.5rem'}>
                                <Button onClick={() => setShowPassword(!showPassword)}
                                        size={'xs'}>{showPassword ? 'Hide' : 'Show'}</Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <FormControl isRequired={true} isInvalid={newPassword != repeatPassword}>
                        <FormLabel color='gray.500'>New Password</FormLabel>
                        <InputGroup size='md'>
                            <Input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => {
                                e.preventDefault()
                                setNewPassword(e.target.value)
                            }} />
                            <InputRightElement w={'4.5rem'}>
                                <Button onClick={() => setShowPassword(!showPassword)}
                                        size={'xs'}>{showPassword ? 'Hide' : 'Show'}</Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <FormControl isRequired={true} isInvalid={newPassword != repeatPassword}>
                        <FormLabel color='gray.500'>Confirm New Password</FormLabel>
                        <InputGroup size='md'>
                            <Input type={showPassword ? 'text' : 'password'} value={repeatPassword} onChange={(e) => {
                                e.preventDefault()
                                setRepeatPassword(e.target.value)
                            }} />
                            <InputRightElement w={'4.5rem'}>
                                <Button onClick={() => setShowPassword(!showPassword)}
                                        size={'xs'}>{showPassword ? 'Hide' : 'Show'}</Button>
                            </InputRightElement>
                        </InputGroup>
                        {newPassword != repeatPassword && (
                            <FormErrorMessage>Passwords dont match</FormErrorMessage>
                        )}
                    </FormControl>
                </VStack>
                <Flex justifyContent='center' mt={10}>
                    <Button colorScheme='blue' type={'submit'} isLoading={submitting}>
                        Submit
                    </Button>
                </Flex>
            </form>
        </Box>
    )
}