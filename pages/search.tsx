import React, { useEffect, useState } from 'react'
import { Input, InputGroup, InputLeftElement, Stack } from '@chakra-ui/react'
import MainLayout from '@/components/MainLayout'
import { RiSearchLine } from 'react-icons/ri'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { NavBar } from '@/components/NavBar'
import { TrackCard } from '@/components/TrackCard'
import { useAudioCtx } from '@/lib/contexts/AudioContext'
import SearchBar from '@/components/SearchBar'
import { Track } from '@/typings'

const Search = () => {
    const { addToQueue } = useAudioCtx()
    const [searchResults, setSearchResults] = useState<
        Track[]
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
        }, 1500)

        return () => {
            clearTimeout(timer)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query])

    async function findSong(query: string) {
        if (query) {
            const res = await fetch(`/api/search?q=${query}`).then(r => r.json())

            if (res.data) {
                setSearchResults(res.data)
            }
        } else {
            setSearchResults([])
        }
    }

    function handleDoubleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>, track: Track) {
        if (event.detail == 2) {
            addToQueue(track)
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
            <NavBar>
                <SearchBar query={query} onChange={handleOnQuery} />
            </NavBar>
            <div className='tw-flex tw-flex-col tw-items-center'>
                <Stack key={'search_results'} direction={'column'} w={'full'}>
                    {searchResults.length <= 0 && <p>No result found.</p>}
                    {searchResults.map((v) => (
                        <div
                            key={`search_result_${v.id}`}
                            title={'Double click to add the song to queue'}
                            onClick={(e) => handleDoubleClick(e, v)}>
                            <TrackCard
                                track={v}
                                onClickCover={() => addToQueue(v)} />
                        </div>))
                    }
                </Stack>
            </div>
        </>
    )
}

Search.getLayout = (page: React.ReactElement) => {
    return <MainLayout navbar={false}>{page}</MainLayout>
}

export default Search
