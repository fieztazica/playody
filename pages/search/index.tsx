import React, { useEffect, useState } from 'react'
import useSpotify from '@/lib/hooks/useSpotify'
import { Input, InputGroup, InputLeftElement, Stack } from '@chakra-ui/react'
import MainLayout from '@/components/layouts/MainLayout'
import { RiSearchLine } from 'react-icons/ri'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { NavBar } from '@/components/NavBar'
import { TrackCard } from '@/components/TrackCard'

const Search = () => {
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
                            value={query || ''}
                            onChange={(e) => setQuery(e.target.value)}
                            w={{ base: 'full', md: 300 }}
                            placeholder='Want to play anything?'
                        />
                    </InputGroup>
                </NavBar>
                <Stack direction={'column'} p={2} w={'full'}>
                    {searchResults.map((v, i) => (<TrackCard key={v.id} track={v} />))}
                </Stack>
            </div>
        </>
    )
}

Search.getLayout = (page: React.ReactElement) => {
    return <MainLayout>{page}</MainLayout>
}

export default Search
