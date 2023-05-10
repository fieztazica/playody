import React, { useState } from 'react'
import useSpotify from '@/lib/hooks/useSpotify'
import { Button, IconButton, Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import AudioWave from '@/components/rive/AudioWave'
import MainLayout from '@/components/layouts/MainLayout'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { RiSearchLine } from 'react-icons/ri'
import { useRouter } from 'next/router'
import { PlayodyTitle } from '@/components/PlayodyTitle'
import Head from 'next/head'
import { NavBar } from '@/components/NavBar'

const Search = () => {
    const spotifyApi = useSpotify()
    const [searchResults, setSearchResults] = useState<
        SpotifyApi.TrackObjectFull[]
    >([])
    const [query, setQuery] = useState<string>('')
    const router = useRouter()

    const findSong = () => {
        if (query) {
            spotifyApi.search(query, ['track']).then(r => {
                console.log(r.body.tracks?.items)
                setSearchResults(r.body.tracks?.items!)
            })
        } else setSearchResults([])
    }

    return (
        <>
            <Head>
                <title>
                    Search
                </title>
            </Head>
            <div className='tw-flex tw-flex-col tw-items-center'>
                <NavBar>
                    <InputGroup>
                        <InputLeftElement>
                            <RiSearchLine />
                        </InputLeftElement>
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onBlur={() => findSong()}
                            w={{ base: 'full', md: 300 }}
                            placeholder='Want to play anything?'
                        />
                    </InputGroup>
                </NavBar>
                <div className='p-5'>
                    {searchResults.map((v, i) => (
                        // eslint-disable-next-line react/jsx-key
                        <div className={'tw-p-5'}>
                            <a href={v.external_urls.spotify}>{v.name}</a>
                            <Button
                                ml={2}
                                size={'xs'}
                                onClick={() => console.log(v.id)}
                            >
                                Play
                            </Button>
                        </div>
                    ))}
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((v, i) => (
                        <div key={'i'} className={'tw-h-10 tw-w-full tw-my-4 tw-bg-black'}>{v}</div>))}
                </div>
            </div>
        </>
    )
}

Search.getLayout = (page: React.ReactElement) => {
    return <MainLayout>{page}</MainLayout>
}

export default Search
