// @flow
import * as React from 'react'
import {
    BoxProps,
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure, useToast, VStack,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Database } from '@/typings/supabase'
import CreatePlaylistModal from '@/components/CreatePlaylistModal'
import { HiPlus } from 'react-icons/hi'
import { useAppStates } from '@/lib/contexts/AppContext'
import { Playlist } from '@/typings'
import { useAudioCtx } from '@/lib/contexts/AudioContext'

interface Props extends BoxProps {
}

export default function AddToPlaylistModal({ children }: Props) {
    const { onClose, onOpen, isOpen } = useDisclosure()
    const nameInput = useRef(null)
    const {  addTrackToPlaylist, queue, playingIndex } = useAudioCtx()
    const { myPlaylists } = useAppStates()

    return (
        <>
            <div onClick={onOpen}>
                {children}
            </div>
            <Modal
                scrollBehavior={'inside'}
                initialFocusRef={nameInput}
                isOpen={isOpen}
                onClose={onClose}
                onEsc={onClose}
                isCentered
            >
                <ModalOverlay />
                <ModalContent
                    bgGradient={'linear(to-b, blue.900, purple.900, pink.900)'}
                >
                    <ModalHeader>Add to playlist</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack w={'full'}>
                            <CreatePlaylistModal>
                                <Button
                                    leftIcon={<HiPlus />}
                                    w={'full'}
                                    colorScheme={'purple'}
                                >
                                    Create new playlist
                                </Button>
                            </CreatePlaylistModal>
                            {myPlaylists !== null && myPlaylists.map((v) =>
                                <Button
                                    w={'full'}
                                    key={`${v.name}_${v.author}_playlist_add_list`}
                                    onClick={() => {
                                        if (playingIndex === null) return;
                                        addTrackToPlaylist(v, queue[playingIndex]).then(() => {
                                            onClose()
                                        })
                                    }}
                                >
                                    {v.name}
                                </Button>,
                            )}
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}