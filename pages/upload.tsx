// @flow
import { ChangeEventHandler, FormEvent, ReactNode, useRef, useState } from 'react'
import MainLayout from '@/components/MainLayout'
import {
    Button,
    Container,
    FormControl, FormErrorMessage,
    FormLabel,
    IconButton, Image,
    Input,
    SimpleGrid, Spinner,
    Stack,
} from '@chakra-ui/react'
import { RiAddFill } from 'react-icons/ri'
import Head from 'next/head'
import { BiUpload } from 'react-icons/bi'
import FileUpload from '@/components/FileUpload'
import { useAppStates } from '@/lib/contexts/AppContext'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Database } from '@/typings/supabase'
import { Track } from '@/typings'
import { TrackInsert } from '@/lib/api/track'

type Props = {}

const UploadBox = ({ children, loading, onClick, ...props }: {
    loading: boolean,
    onClick?: () => void,
    children?: ReactNode
}) => {

    return <div onClick={loading ? undefined : onClick}
                className={`tw-p-4 tw-h-32 tw-w-32 tw-border tw-rounded-md tw-group tw-flex tw-items-center tw-justify-center ${loading ? 'tw-cursor-not-allowed' : 'tw-cursor-pointer'}`}>
        <div className={'tw-flex tw-flex-col tw-justify-center tw-items-center'}>

            {
                loading ? <Spinner /> :
                    children ? children : <>
                        <BiUpload
                            className={'tw-text-2xl tw-text-white/50 group-hover:tw-text-white/80'} />
                        <span className={'tw-text-sm tw-text-white/50 group-hover:tw-text-white/80'}>Upload</span>
                    </>
            }
        </div>
    </div>
}

const Upload = (props: Props) => {
    const user = useUser()
    const supabase = useSupabaseClient<Database>()
    const [songName, setSongName] = useState('')
    const [genres, setGenres] = useState<string[]>([''])
    const [artists, setArtists] = useState<string[]>([''])
    const [srcUrl, setSrcUrl] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [imageUploading, setImageUploading] = useState(true)
    const [srcUploading, setSrcUploading] = useState(false)
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const imageUploadRef = useRef<HTMLInputElement | null>(null)
    const srcUploadRef = useRef<HTMLInputElement | null>(null)

    if (!user) return 'Sign in to start uploading your melody!'

    function addGenre() {
        setGenres((a) => [...a, ''])
    }

    function addArtist() {
        setArtists((a) => [...a, ''])
    }

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!user) return
        try {
            setSubmitting(true)

            const trackToUpload: TrackInsert = {
                src: srcUrl,
                image_url: imageUrl,
                name: songName,
                genres: genres.filter(v => v.length <= 0).length <= 0 ? null : genres.filter(v => v.length <= 0),
                artists: artists.filter(v => v.length <= 0).length <= 0 ? null : artists.filter(v => v.length <= 0),
                author: user.id,
            }

            const res = await fetch('/api/track', {
                method: 'POST',
                body: JSON.stringify(trackToUpload),
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const jsonData = res.json()

            if (!res.ok) {
                throw jsonData
            }

            console.log((jsonData as ApiResSuccess).data)

        } catch (e: any) {
            console.error(e)
            setError((e as ApiResError).error.message)
        } finally {
            setSubmitting(false)
            setError(null)
        }
    }

    const uploadImage: ChangeEventHandler<HTMLInputElement> = async (event) => {
        try {
            setImageUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}.${fileExt}`
            const filePath = `${user.id}/${fileName}`

            let { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file, { upsert: true })

            if (uploadError) {
                throw uploadError
            }

            // onUpload(filePath)
        } catch (error) {
            alert('Error uploading avatar!')
            console.log(error)
        } finally {
            setImageUploading(false)
        }
    }

    return (
        <>
            <Head>
                <title>Upload</title>
            </Head>
            <Container className={'tw-py-4 tw-rounded-md tw-bg-black/20'}>
                <form onSubmit={onSubmit}>
                    <Stack>
                        <FormControl isRequired>
                            <FormLabel>Song name</FormLabel>
                            <Input placeholder='Song name' />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Genres</FormLabel>
                            <SimpleGrid minChildWidth='100px' spacing={2}>
                                {genres.map((v, i) => (
                                    <Input
                                        key={`genre-${i}`}
                                        placeholder={`genre #${i + 1}`}
                                    />
                                ))}
                                {genres.length < 2 && (
                                    <div>
                                        <IconButton
                                            aria-label='Add genre button'
                                            icon={<RiAddFill />}
                                            onClick={() => addGenre()}
                                        />
                                    </div>
                                )}
                            </SimpleGrid>
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Artists</FormLabel>
                            <SimpleGrid minChildWidth='100px' spacing={2}>
                                {artists.map((v, i) => (
                                    <Input
                                        key={`artist-${i}`}
                                        placeholder={`artist #${i + 1}`}
                                    />
                                ))}
                                {artists.length < 4 && (
                                    <div>
                                        <IconButton
                                            aria-label='Add artist button'
                                            icon={<RiAddFill />}
                                            onClick={() => addArtist()}
                                        />
                                    </div>
                                )}
                            </SimpleGrid>
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Image</FormLabel>
                            <UploadBox loading={imageUploading} onClick={() => imageUploadRef.current?.click()}>
                                {imageUrl && <Image src={imageUrl} />}
                            </UploadBox>
                            <input
                                ref={imageUploadRef}
                                hidden
                                type={'file'}
                                accept={'image/png, image/jpeg'}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Source</FormLabel>
                            <UploadBox loading={srcUploading} onClick={() => srcUploadRef.current?.click()}>
                                {srcUrl && `${srcUrl}`}
                            </UploadBox>
                            <input
                                ref={srcUploadRef}
                                hidden
                                type={'file'}
                                accept={'audio/mpeg, audio/x-wav'}

                            />
                        </FormControl>
                        {
                            error && <p className={'tw-text-red-500'}>
                                {error}
                            </p>
                        }
                        <FormControl>
                            <Button type={'submit'} colorScheme={'teal'} isLoading={submitting}>Submit</Button>
                        </FormControl>
                    </Stack>
                </form>
            </Container>
        </>
    )
}

Upload.getLayout = (page: ReactNode) => {
    return <MainLayout>{page}</MainLayout>
}

export default Upload
