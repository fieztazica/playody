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
    useDisclosure,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Database } from '@/typings/supabase'

interface Props extends BoxProps {
};

export default function AddToPlaylistModal({ children }: Props) {
    const { onClose, onOpen, isOpen } = useDisclosure()
    const nameInput = useRef(null)
    const supabaseClient = useSupabaseClient<Database>()
    const user = useUser()
    const [creating, setCreating] = useState(false)
    const [playlistName, setPlaylistName] = useState('')

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
                       <Button colorScheme={"purple"} isLoading={creating}>
                           Create
                       </Button>
                   </ModalFooter>
               </ModalContent>
           </Modal>
       </>
    )
}