import useSpotify from '@/lib/hooks/useSpotify'
import { Box, Container, Input } from '@chakra-ui/react'
import { Suspense, useEffect, useState } from 'react'

function SearchBar() {
    const spotifyApi = useSpotify()
    const [searchResults, setSearchResults] = useState<
        SpotifyApi.TrackObjectFull[]
    >([])
    const [query, setQuery] = useState<string>('')

    const findSong = () => {
        if (query)
            spotifyApi.search(query, ['track']).then((r) => {
                console.log(r.body.tracks?.items)
                setSearchResults(r.body.tracks?.items!)
            })
    }

    return (
        <Box bgColor={'rgba(0,0,0, 0.1)'}>
            <Container p={5}>
                <Input
                    focusBorderColor="pink.400"
                    placeholder="Search a song..."
                    _placeholder={{ color: 'inherit' }}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onBlur={() => findSong()}
                />
            </Container>
        </Box>
    )
}

export default SearchBar
