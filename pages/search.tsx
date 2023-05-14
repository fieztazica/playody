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
import SearchBar from '@/components/SearchBar'

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    function handleOnQuery(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        setQuery(event.target.value)
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
                    <SearchBar query={query} onChange={handleOnQuery} />
                </NavBar>
                <Stack key={'seach_results'} direction={'column'} w={'full'}>
                    {searchResults.map((v) => (
                        <div key={`search_result_${v.id}`} onClick={(e) => handleDoubleClick(e, v.id)}>
                            <TrackCard track={v}
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
