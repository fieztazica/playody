import * as React from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import {
    Button,
    ButtonGroup, FormControl, FormLabel,
    IconButton, Input, Popover,
    PopoverArrow, PopoverBody,
    PopoverCloseButton,
    PopoverContent, PopoverFooter, PopoverHeader,
    PopoverTrigger, Stack,
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import { Database } from '@/typings/supabase'
import { useRouter } from 'next/router'
import { AiOutlineEdit } from 'react-icons/ai'
import { FormEvent, useEffect, useRef } from 'react'

type Props = {
    name: string
}

const ChangePlaylistNamePopover = ({ name }: Props) => {
    const user = useUser()
    const toast = useToast()
    const supabaseClient = useSupabaseClient<Database>()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const router = useRouter()
    const playlistNameRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (playlistNameRef.current) playlistNameRef.current.value = name
    }, [router])

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        (async () => {
            try {
                if (!user || !supabaseClient || !playlistNameRef.current)
                    throw 'Unauthenticated'

                if (playlistNameRef.current.value == name) {
                    return
                }

                toast({
                    status: 'loading',
                    title: `Changing`,
                })

                const { error, data } = await supabaseClient
                    .from('playlists')
                    .update({
                        name: playlistNameRef.current.value,
                    })
                    .eq('author', user.id)
                    .eq('name', name)
                    .select()
                    .single()

                if (error || !data) throw error || 'No data returned'

                toast({ status: 'success', title: `Changed to ${data.name}!` })
                router.replace(`/me/playlists/${data.name}`)
            } catch (e: any) {
                if (e?.message)
                    alert(e.message)
                console.error(e)
            } finally {
                onClose()
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
                    icon={<AiOutlineEdit color={'yellow'} />}
                    aria-label={'Edit this playlist name button'}
                    title={'Edit this playlist name'}
                />
            </PopoverTrigger>
            <PopoverContent bgGradient={'linear(to-b, blue.900, purple.900, pink.900)'} p={5}>
                <PopoverArrow />
                <PopoverCloseButton />
                <form onSubmit={onSubmit}>
                    <Stack spacing={4}>
                        <FormControl>
                            <FormLabel>New Playlist Name</FormLabel>
                            <Input type={'text'} ref={playlistNameRef} placeholder={name} />
                        </FormControl>
                        <ButtonGroup display='flex' justifyContent='flex-end'>
                            <Button type={'submit'}>
                                Save
                            </Button>
                        </ButtonGroup>
                    </Stack>
                </form>
            </PopoverContent>
        </Popover>
    )
}

export default ChangePlaylistNamePopover
