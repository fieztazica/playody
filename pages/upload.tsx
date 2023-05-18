// @flow
import { useState } from 'react'
import MainLayout from '@/components/layouts/MainLayout'
import {
    Button,
    Container,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    SimpleGrid,
    Stack,
} from '@chakra-ui/react'
import { RiAddFill } from 'react-icons/ri'

type Props = {}

const Upload = (props: Props) => {
    const [songName, setSongName] = useState('')
    const [genres, setGenres] = useState<string[]>([''])
    const [artists, setArtists] = useState<string[]>([''])
    const [srcUrl, setSrcUrl] = useState('')

    function addGenre() {
        setGenres((a) => [...a, ''])
    }

    function addArtist() {
        setArtists((a) => [...a, ''])
    }

    return (
        <Container>
            <form>
                <Stack>
                    <FormControl isRequired>
                        <FormLabel>Song name</FormLabel>
                        <Input placeholder="Song name" />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Genres</FormLabel>
                        <SimpleGrid minChildWidth="100px" spacing={2}>
                            {genres.map((v, i) => (
                                <Input
                                    key={`genre-${i}`}
                                    placeholder={`genre #${i + 1}`}
                                />
                            ))}
                            {genres.length < 2 && (
                                <div>
                                    <IconButton
                                        aria-label="Add genre button"
                                        icon={<RiAddFill />}
                                        onClick={() => addGenre()}
                                    />
                                </div>
                            )}
                        </SimpleGrid>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Artists</FormLabel>
                        <SimpleGrid minChildWidth="100px" spacing={2}>
                            {artists.map((v, i) => (
                                <Input
                                    key={`artist-${i}`}
                                    placeholder={`artist #${i + 1}`}
                                />
                            ))}
                            {artists.length < 4 && (
                                <div>
                                    <IconButton
                                        aria-label="Add artist button"
                                        icon={<RiAddFill />}
                                        onClick={() => addArtist()}
                                    />
                                </div>
                            )}
                        </SimpleGrid>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Source</FormLabel>
                        <IconButton aria-label="Upload Button"/>
                        <Input display="none" placeholder="source url" />
                    </FormControl>
                    <FormControl>
                        <Button>Submit</Button>
                    </FormControl>
                </Stack>
            </form>
        </Container>
    )
}

Upload.getLayout = (page: React.ReactNode) => {
    return <MainLayout>{page}</MainLayout>
}

export default Upload
