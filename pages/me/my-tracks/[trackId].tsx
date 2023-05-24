// @flow
import * as React from 'react'
import {
    ChangeEventHandler,
    FormEvent,
    ReactNode,
    useRef,
    useState,
} from 'react'
import MainLayout from '@/components/MainLayout'
import {
    Button,
    Container,
    FormControl, FormLabel,
    IconButton, Image,
    Input,
    SimpleGrid, Spinner,
    Stack,
} from '@chakra-ui/react'
import { RiAddFill, RiSubtractFill } from 'react-icons/ri'
import { GetServerSideProps } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/typings/supabase'
import { useUser } from '@supabase/auth-helpers-react'
import { Track } from '@/typings'
import { TrackUpdate } from '@/lib/api/track'
import { useRouter } from 'next/router'

type Props = {
    track: Track | null
};

const TrackId = ({ track }: Props) => {
    const user = useUser()
    const [songName, setSongName] = useState(track?.name)
    const [genres, setGenres] = useState<string[]>(track?.genres || [])
    const [artists, setArtists] = useState<string[]>(track?.artists || [])
    const [srcUrl, setSrcUrl] = useState(track?.src)
    const [duration, setDuration] = useState<number>(0)
    const [imageUrl, setImageUrl] = useState(track?.image_url)
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const trackIdQuery = router.query.trackId as string

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!user) return
        try {
            setSubmitting(true)
            setError(null)

            if (!srcUrl || !duration) {
                setError('No audio file provided!')
                return
            }

            const trackToUpdate: TrackUpdate = {
                src: srcUrl,
                image_url: imageUrl,
                name: songName,
                genres: genres.filter(v => v.length > 0),
                artists: artists.filter(v => v.length > 0),
                author: user.id,
                duration_s: parseInt(`${duration}`) || 0,
            }

            const res = await fetch('/api/track', {
                method: 'PUT',
                body: JSON.stringify(trackToUpdate),
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const jsonData = await res.json()

            if (!res.ok) {
                throw jsonData
            }
            // console.log((jsonData as ApiResSuccess).data)
            setArtists([''])
            setGenres([''])
            setSongName('')
            setImageUrl('')
            setSrcUrl('')
            setDuration(0)
            alert('Uploaded! Please wait for verification process')
        } catch (e: any) {
            console.error(e)
            if (e.error)
                setError(e.error.message)
        } finally {
            setSubmitting(false)
            // @ts-ignore
            imageUploadRef.current.value = null
            // @ts-ignore
            srcUploadRef.current.value = null
        }
    }

    function onGenresChange(value: string, id: number) {
        setGenres((a) => {
            const newArray = [...a]
            newArray[id] = value
            return newArray
        })
    }

    function removeLastGenre() {
        setGenres((a) => {
            const newArray = [...a]
            newArray.pop()
            return newArray
        })
    }

    function addGenre() {
        setGenres((a) => [...a, ''])
    }

    function onArtistsChange(value: string, id: number) {
        setArtists((a) => {
            const newArray = [...a]
            newArray[id] = value
            return newArray
        })
    }

    function addArtist() {
        setArtists((a) => [...a, ''])
    }

    function removeLastArtist() {
        setArtists((a) => {
            const newArray = [...a]
            newArray.pop()
            return newArray
        })
    }
    return (
        <div className={'tw-w-full tw-rounded-md tw-bg-black/20'}>
        <Container className={'tw-py-4 '}>
        <form onSubmit={onSubmit}>
            <Stack>
            <FormControl isRequired>
                <FormLabel>Song name</FormLabel>
                    <Input value={songName} placeholder='Song name' onChange={(e) => {
                        e.preventDefault()
                        setSongName(e.target.value)
                    }} />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Genres</FormLabel>
                    <SimpleGrid minChildWidth='100px' spacing={2}>
                        {genres.map((v, i) => (
                        <Input
                            key={`genre-${i}`}
                            placeholder={`genre #${i + 1}`}
                            value={v}
                            onChange={(e) => {
                            e.preventDefault()
                            onGenresChange(e.target.value, i)
                            }}
                            />
                            ))}
                                <div>
                                    {genres.length > 1 && (
                                        <div>
                                            <IconButton
                                                aria-label='Remove genre button'
                                                icon={<RiSubtractFill />}
                                                onClick={() => removeLastGenre()}
                                            />
                                        </div>
                                        )}
                                        {genres.length < 2 && (
                                            <div>
                                                <IconButton
                                                    aria-label='Add genre button'
                                                    icon={<RiAddFill />}
                                                    onClick={() => addGenre()}
                                                />
                                            </div>
                                        )}
                                </div>
                        </SimpleGrid>
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Artists</FormLabel>
                        <SimpleGrid minChildWidth='100px' spacing={2}>
                            {artists.map((v, i) => (
                            <Input
                                key={`artist-${i}`}
                                placeholder={`artist #${i + 1}`}
                                value={artists[i]}
                                onChange={(e) => {
                                    e.preventDefault()
                                     onArtistsChange(e.target.value, i)
                                    }}
                                    />
                                    ))}
                                <div className={'tw-flex tw-space-x-2'}>
                                {artists.length > 1 && (
                                        <IconButton
                                            aria-label='Remove artist button'
                                            icon={<RiSubtractFill />}
                                            onClick={() => removeLastArtist()}
                                            />
                                        )}
                                        {artists.length < 4 && (
                                            <IconButton
                                                aria-label='Add artist button'
                                                icon={<RiAddFill />}
                                                onClick={() => addArtist()}
                                            />
                                        )}
                                </div>
                        </SimpleGrid>
                    </FormControl>
                    {track?.image_url && <div className={'tw-p-2 tw-aspect-square tw-max-w-xs'}>
                                        <Image alt={`${track.name}'s image`} src={track?.image_url} />
                                    </div>}
                        <audio className={'tw-w-full'} controls src={track?.src || undefined} />
                    <FormControl>
                        <Button type={'submit'} colorScheme={'teal'} isLoading={submitting}>Submit</Button>
                    </FormControl>
            </Stack>
        </form>
        </Container>
        </div>
    )
}

TrackId.getLayout = (page: React.ReactElement) => {
    return <MainLayout>{page}</MainLayout>
}

export default TrackId

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const supabaseClient = createServerSupabaseClient<Database>(ctx)
    const user = await supabaseClient.auth.getUser()

    if (user.error)
        return {
            notFound: true,
        }

    const track = await supabaseClient
        .from('tracks')
        .select('*')
        .eq('id', ctx.query.trackId)
        .eq('author', user.data.user.id)
        .limit(1)
        .single()

    if (track.error) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            track: track.data || null,
        },
    }
}