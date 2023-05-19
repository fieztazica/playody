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
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Database } from '@/typings/supabase'
import { TrackInsert } from '@/lib/api/track'

type Props = {}

const UploadBox = ({ children, loading, onClick, ...props }: {
    loading: boolean,
    onClick?: () => void,
    children?: ReactNode
}) => {

    return <div onClick={loading ? undefined : onClick}
                className={`tw-overflow-hidden tw-h-32 tw-w-32 tw-border tw-rounded-md tw-group tw-flex tw-items-center tw-justify-center ${loading ? 'tw-cursor-not-allowed' : 'tw-cursor-pointer'}`}>
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
    const [imageUploading, setImageUploading] = useState(false)
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

    function onGenresChange(value: string, id: number) {
        setGenres((a) => {
            const newArray = [...a]
            newArray[id] = value
            return newArray
        })
    }

    function onArtistsChange(value: string, id: number) {
        setArtists((a) => {
            const newArray = [...a]
            newArray[id] = value
            return newArray
        })
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
                genres: genres.filter(v => v.length > 0),
                artists: artists.filter(v => v.length > 0),
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

            setArtists([''])
            setGenres([''])
            setSongName('')
            setImageUrl('')
            setSrcUrl('')
            alert("Uploaded! Please wait for verification process")
        } catch (e: any) {
            console.error(e)
            setError((e as ApiResError).error.message)
        } finally {
            setSubmitting(false)
            setError(null)
            // @ts-ignore
            imageUploadRef.current.value = null
            // @ts-ignore
            srcUploadRef.current.value = null
        }
    }

    const uploadImage: ChangeEventHandler<HTMLInputElement> = async (event) => {
        try {
            setImageUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileNameArray = file.name.split('.')
            const fileExt = fileNameArray.pop()
            const fileName = fileNameArray.join("").replace(/[^A-Z0-9]+/ig, "_")
            const filePath = `${user.id}/${encodeURI(fileName)}.${fileExt}`

            let { error: uploadError, data: uploadData } = await supabase.storage
                .from('images')
                .upload(filePath, file, { upsert: false })

            if (uploadError) {
                throw uploadError
            }

            if (uploadData) {
                const { data: publicImageData } = supabase
                    .storage
                    .from('images')
                    .getPublicUrl(uploadData.path)

                setImageUrl(publicImageData.publicUrl)
            }
        } catch (error) {
            alert('Error uploading image!')
            console.log(error)
        } finally {
            setImageUploading(false)
            // @ts-ignore
            imageUploadRef.current.value = null
            // @ts-ignore
            srcUploadRef.current.value = null
        }
    }

    const uploadSrc: ChangeEventHandler<HTMLInputElement> = async (event) => {
        try {
            setSrcUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an audio to upload.')
            }

            const file = event.target.files[0]
            const fileNameArray = file.name.split('.')
            const fileExt = fileNameArray.pop()
            const fileName = fileNameArray.join("").replace(/[^A-Z0-9]+/ig, "_")
            const filePath = `${user.id}/${encodeURI(fileName)}.${fileExt}`

            let { error: uploadError, data: uploadData } = await supabase.storage
                .from('audio')
                .upload(filePath, file, { upsert: false })

            if (uploadError) {
                throw uploadError
            }

            if (uploadData) {
                const { data: publicData } = supabase
                    .storage
                    .from('audio')
                    .getPublicUrl(uploadData.path)

                setSrcUrl(publicData.publicUrl)
            }
        } catch (error) {
            alert('Error uploading audio!')
            console.log(error)
        } finally {
            setSrcUploading(false)
            // @ts-ignore
            imageUploadRef.current.value = null
            // @ts-ignore
            srcUploadRef.current.value = null
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
                                        value={genres[i]}
                                        onChange={(e) => {
                                            e.preventDefault()
                                            onGenresChange(e.target.value, i)
                                        }}
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
                                        value={artists[i]}
                                        onChange={(e) => {
                                            e.preventDefault()
                                            onArtistsChange(e.target.value, i)
                                        }}
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
                                {imageUrl && <Image alt={'track\'s image'} src={imageUrl} />}
                            </UploadBox>
                            <input
                                ref={imageUploadRef}
                                hidden
                                type={'file'}
                                accept={'image/png, image/jpeg'}
                                onChange={uploadImage}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Source</FormLabel>
                            <UploadBox loading={srcUploading} onClick={() => srcUploadRef.current?.click()}>
                                {srcUrl && <p title={srcUrl} className={'tw-truncate tw-w-120px'}>
                                    {srcUrl}
                                </p>}
                            </UploadBox>
                            <input
                                ref={srcUploadRef}
                                hidden
                                type={'file'}
                                accept={'audio/mpeg, audio/x-wav'}
                                onChange={uploadSrc}
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
