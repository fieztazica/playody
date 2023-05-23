// @flow
import * as React from 'react'
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
} from '@chakra-ui/react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { Database } from '@/typings/supabase'
import { useAppStates } from '@/lib/contexts/AppContext'


export default function ChangeInfoForm() {
    const user = useUser()
    const { profile, fetchProfile } = useAppStates()
    const supabase = useSupabaseClient<Database>()
    const [changeEmail, setChangeEmail] = useState(user?.email || '')
    const [changeFullName, setChangeFullName] = useState(profile?.full_name || '')
    const [password, setPassword] = useState('')
    const [updating, setUpdating] = useState(false)
    const [show, setShow] = useState(false)

    async function handleSubmit() {
        try {
            setUpdating(true)
            const checkPass = await supabase.rpc('verify_user_password', {
                password: `${password}`,
            })

            if (!checkPass.data || checkPass.error) {
                throw {
                    message: 'Password incorrect',
                }
            }

            if (!user) {
                throw {
                    message: 'You are not logged in yet!',
                }
            }

            const user_metadata = await supabase.auth
                .updateUser({
                    email: `${changeEmail}`,
                })

            if (user_metadata.error) {
                throw user_metadata.error
            }

            const profileRes = await supabase
                .from('profiles').update({
                    full_name: `${changeFullName}`,
                })
                .eq('id', user.id)

            if (profileRes.error) {
                throw profileRes.error
            }

            fetchProfile()
        } catch (e: any) {
            if (e.message) {
                alert(e.message)
            }
        } finally {
            setUpdating(false)
        }
    }

    useEffect(() => {
        if (user?.email && !changeEmail) {
            setChangeEmail(user.email)
        }

        if (profile?.full_name && !changeFullName) {
            setChangeFullName(profile.full_name)
        }
    }, [user, profile])


    return (
        <Box maxWidth='xl'>
            <form onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
            }}>
                <VStack spacing={10} alignItems='flex-start'>
                    <FormControl>
                        <FormLabel color='gray.500'>Full Name</FormLabel>
                        <InputGroup size='md'>
                            <Input value={changeFullName} onChange={(e) => {
                                e.preventDefault()
                                setChangeFullName(e.target.value)
                            }} />
                        </InputGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel color='gray.500'>Email</FormLabel>
                        <InputGroup size='md'>
                            <Input value={changeEmail} onChange={(e) => {
                                e.preventDefault()
                                setChangeEmail(e.target.value)
                            }} />
                        </InputGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel color='gray.500'>Password</FormLabel>
                        <InputGroup size='md'>
                            <Input type={show ? 'text' : 'password'} value={password} onChange={(e) => {
                                e.preventDefault()
                                setPassword(e.target.value)
                            }} />
                            <InputRightElement w={'4.5rem'}>
                                <Button onClick={() => setShow(!show)}
                                        size={'xs'}>
                                    {show ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                </VStack>
                <Flex justifyContent='center' mt={10}>
                    <Button type={'submit'} isLoading={updating} colorScheme='blue'>
                        Update
                    </Button>
                </Flex>
            </form>
        </Box>
    )
}