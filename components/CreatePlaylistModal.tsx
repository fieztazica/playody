import * as React from 'react'
import {
    BoxProps,
    Button,
    Flex,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay, useDisclosure,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Database } from '@/typings/supabase'
import { Playlist } from '@/typings'

interface Props extends BoxProps {

}

export default function CreatePlaylistModal({ children }: Props) {
    const { onClose, onOpen, isOpen } = useDisclosure()
    const nameInput = useRef(null)
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
                    message: 'You already created that playlist!',
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
        <>
            <div onClick={onOpen}>
                {children}
            </div>
            <Modal initialFocusRef={nameInput} isOpen={isOpen} onClose={onClose} onEsc={onClose} isCentered >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create a playlist</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isRequired={true}>
                            <FormLabel fontWeight={'bold'}>Playlist Name</FormLabel>
                            <Input
                                ref={nameInput}
                                value={playlistName}
                                onChange={(e) => {
                                    e.preventDefault()
                                    setPlaylistName(e.target.value)
                                }}
                                placeholder={'Your playlist name'}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme={"purple"} isLoading={creating} onClick={() => create()}>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}