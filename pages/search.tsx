import React, { useEffect, useState } from 'react'
import useSpotify from '@/lib/hooks/useSpotify'
import { Input, InputGroup, InputLeftElement, Stack } from '@chakra-ui/react'
import MainLayout from '@/components/layouts/MainLayout'
import { RiSearchLine } from 'react-icons/ri'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { NavBar } from '@/components/NavBar'
import { TrackCard } from '@/components/TrackCard'
import { useAudioCtx } from '@/lib/contexts/AudioContext'

const Search = () => {
    const { addToQueue } = useAudioCtx()
    const spotifyApi = useSpotify()
    const [searchResults, setSearchResults] = useState<
        SpotifyApi.TrackObjectFull[]
    >([])
    const router = useRouter()
    const [query, setQuery] = useState<string>('')

    useEffect(() => {
        setQuery(decodeURIComponent(router.query.q as string || ''))
    }, [router])

    useEffect(() => {
        query ?
            router.push({
                pathname: '/search',
                query: {
                    q: encodeURIComponent(query),
                },
            }, undefined, { shallow: true })
            :
            router.push({
                pathname: '/search',
            }, undefined, { shallow: true })

        const timer = setTimeout(() => {
            findSong(query)
        }, 2000)

        return () => {
            clearTimeout(timer)
        }
    }, [query])

    function findSong(query: string) {
        if (query) {
            spotifyApi.search(query, ['track']).then(r => {
                console.log(r.body.tracks?.items)
                setSearchResults(r.body.tracks?.items!)
            })
        } else {
            setSearchResults([])
        }
    }

    function handleDoubleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>, trackId: string) {
        if (event.detail == 2) {
            addToQueue(trackId)
        }
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
                    <InputGroup key={"Search Group"}>
                        <InputLeftElement>
                            <RiSearchLine />
                        </InputLeftElement>
                        <Input
                            type={"text"}
                            name={"search"}
                            value={query || ''}
                            onChange={(e) => setQuery(e.target.value)}
                            w={{ base: 'full', md: 300 }}
                            placeholder='Play a melody'
                        />
                    </InputGroup>
                </NavBar>
                <Stack direction={'column'} p={2} w={'full'}>
                    {searchResults.map((v) => (
                        <div key={v.id} onClick={(e) => handleDoubleClick(e, v.id)}><TrackCard track={v}
                                                                                               onClickCover={() => addToQueue(v.id)} />
                        </div>))}
                </Stack>
            </div>
        </>
    )
}

Search.getLayout = (page: React.ReactElement) => {
    return <MainLayout>{page}</MainLayout>
}

export default Search
