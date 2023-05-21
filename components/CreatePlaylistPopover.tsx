// @flow
import * as React from 'react'
import {
    Button, Flex,
    FormControl,
    FormLabel,
    IconButton, Input, Popover,
    PopoverArrow, PopoverBody,
    PopoverCloseButton,
    PopoverContent, PopoverHeader,
    PopoverProps,
    PopoverTrigger, useDisclosure,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Database } from '@/typings/supabase'
import { Playlist } from '@/typings'

interface Props extends PopoverProps {
    children: React.ReactNode
}

export default function CreatePlaylistPopover({ children }: Props) {
    const { onClose, onOpen, isOpen } = useDisclosure()
    const supabaseClient = useSupabaseClient<Database>()
    const user = useUser()
    const [creating, setCreating] = useState(false)
    const [playlistName, setPlaylistName] = useState('')

    async function create() {
        try {
            setCreating(true)

            if (!user)
                throw 'Unauthenticated'

            const { data, error } = await supabaseClient
                .from('playlist')
                .select()
                .eq('author', user.id)
                .eq('name', playlistName)

            if (data) {
               throw {
                   message: "You already created that playlist!"
               }
            }

            const createRes = await supabaseClient.from('playlists').insert({
                author: user.id,
                name: `${playlistName}`,
            })

            if (createRes.error) {
                throw createRes.error
            }

            onClose()


        } catch (e: any) {
            if (e.message)
                alert(`Error: ${e.message}`)
            console.error(e)
        } finally {
            setCreating(false)
        }
    }

    return (
        <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} isLazy={true}>
            <PopoverTrigger>
                {children}
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Create playlist</PopoverHeader>
                <PopoverBody>
                    <FormControl isRequired={true}>
                        <FormLabel fontWeight={'bold'}>Playlist Name</FormLabel>
                        <Input
                            value={playlistName}
                            onChange={(e) => {
                                e.preventDefault()
                                setPlaylistName(e.target.value)
                            }}
                            placeholder={'Your playlist name'}
                        />
                    </FormControl>
                    <Flex justify={'end'}>
                        <Button onClick={() => create()} mt={2}>
                            Create
                        </Button>
                    </Flex>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}