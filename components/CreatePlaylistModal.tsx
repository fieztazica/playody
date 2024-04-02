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
import { useAppStates } from '@/lib/contexts/AppContext'

interface Props extends BoxProps {

}

export default function CreatePlaylistModal({ children, ...props }: Props) {
    const { onClose, onOpen, isOpen } = useDisclosure()
    const { fetchMyPlaylists } = useAppStates()
    const nameInput = useRef(null)
    const supabaseClient = useSupabaseClient<Database>()
    const user = useUser()
    const [creating, setCreating] = useState(false)
    const [playlistName, setPlaylistName] = useState('')

    async function create() {
        try {
            setCreating(true)

            if (!user)
                throw {
                    message: 'You need to sign in first',
                }

            const { data, error } = await supabaseClient
                .from('playlists')
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
            fetchMyPlaylists()

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
            <div className={'tw-w-full tw-h-full'} onClick={onOpen}>
                {children}
            </div>
            <Modal initialFocusRef={nameInput} isOpen={isOpen} onClose={onClose} onEsc={onClose} isCentered>
                <ModalOverlay />
                <form onSubmit={(e) => {
                    e.preventDefault()
                    create()
                }}>
                    <ModalContent bgGradient={'linear(to-b, blue.900, purple.900, pink.900)'}>
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
                            <Button type={'submit'} colorScheme={'purple'} isLoading={creating}>
                                Create
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>
        </>
    )
}
