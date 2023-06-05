import React from 'react'
import {
    IconButton,
    Popover,
    PopoverArrow, PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger, PopoverFooter, Button, ButtonGroup, useDisclosure, useToast,
} from '@chakra-ui/react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Database } from '@/typings/supabase'
import { useRouter } from 'next/router'
import { RxTrash } from 'react-icons/rx'

type Props = {
    name: string
}

const DeletePlaylistPopover = ({ name }: Props) => {
    const user = useUser()
    const toast = useToast()
    const supabaseClient = useSupabaseClient<Database>()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const router = useRouter()

    const handleClickYes = () => {
        (async () => {
            try {
                if (!user || !supabaseClient)
                    throw "Unauthenticated"

                toast({
                    status: 'loading',
                    title: `Deleting ${name}`,
                })

                const { error } = await supabaseClient
                    .from('playlists')
                    .delete()
                    .eq('author', user.id)
                    .eq('name', name)

                if (error) throw error

                router.replace("/me/playlists")
                toast({ status: 'success', title: 'Removed!' })
            } catch (e: any) {
                if (e?.message)
                    alert(e.message)
                console.error(e)
            }
        })()
    }

    return (
        <Popover
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}>
            <PopoverTrigger>
                <IconButton
                    variant={'ghost'}
                    size={'sm'}
                    fontSize={'xl'}
                    icon={<RxTrash color={'red'} />}
                    aria-label={'Delete this playlist button'}
                    title={'Delete this playlist'}
                />
            </PopoverTrigger>
            <PopoverContent bgGradient={'linear(to-b, blue.900, purple.900, pink.900)'}>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Confirmation!</PopoverHeader>
                <PopoverBody>Are you sure that you want to delete this playlist?</PopoverBody>
                <PopoverFooter>
                    <ButtonGroup>
                        <Button onClick={onClose}>
                            No
                        </Button>
                        <Button colorScheme={'red'} onClick={() => handleClickYes()}>
                            Yes
                        </Button>
                    </ButtonGroup>
                </PopoverFooter>
            </PopoverContent>
        </Popover>
    )
}

export default DeletePlaylistPopover
