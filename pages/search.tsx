import React, { useEffect, useState } from 'react'
import { Stack } from '@chakra-ui/react'
import MainLayout from '@/components/MainLayout'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { NavBar } from '@/components/NavBar'
import { TrackCard } from '@/components/TrackCard'
import { useAudioCtx } from '@/lib/contexts/AudioContext'
import SearchBar from '@/components/SearchBar'
import { Track } from '@/typings'
import { GetServerSideProps } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/typings/supabase'
import SearchLink from '@/components/SearchLink'
import NextLink from 'next/link'
import UnderlineTypo from '@/components/UnderlineTypo'

type Props = {
    genres: string[] | null
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
}

const tailwindColors = [
    'tw-bg-gray-500',
    'tw-bg-red-500',
    'tw-bg-yellow-500',
    'tw-bg-green-500',
    'tw-bg-blue-500',
    'tw-bg-indigo-500',
    'tw-bg-purple-500',
    'tw-bg-pink-500',
    'tw-bg-teal-500',
    'tw-bg-lime-500',
    'tw-bg-sky-500',
    'tw-bg-cyan-500',
    'tw-bg-violet-500',
    'tw-bg-fuchsia-500',
    'tw-bg-rose-500',
    'tw-bg-emerald-500',
    'tw-bg-amber-500',
]

const Search = ({ genres }: Props) => {
    const { addToQueue } = useAudioCtx()
    const [searching, setSearching] = useState(false)
    const [searchResults, setSearchResults] = useState<
        Track[]
    >([])
    const router = useRouter()
    const [query, setQuery] = useState<string>('')


    function getRandomInt(max: number) {
        return Math.floor(Math.random() * max)
    }

    function randomColor() {
        return `tw-bg-${tailwindColors[getRandomInt(tailwindColors.length)]}-500`
    }

    useEffect(() => {
        setQuery(decodeURIComponent((router.query.q || '') as string))
    }, [router.query.q])

    useEffect(() => {
        query ?
            router.replace({
                pathname: '/search',
                query: {
                    q: encodeURIComponent(query),
                },
            }, undefined, { shallow: true })
            :
            router.replace({
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
        try {
            setSearching(true)
            if (query) {
                const res = await fetch(`/api/search?q=${query}`).then(r => r.json())

                if (res.data) {
                    setSearchResults(res.data)
                }
            } else {
                setSearchResults([])
            }
        } catch (e: any) {
            console.error(e)
        } finally {
            setSearching(false)
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
                    {searchResults.length <= 0 &&
                        <p className={'tw-text-center tw-w-full tw-my-4 tw-text-xl'}>
                            {searching ? 'Searching...' : 'No result found'}
                        </p>}
                    {searchResults.map((v) => (
                        <TrackCard
                            key={`search_result_${v.id}`}
                            title={'Double click to add the song to queue'}
                            track={v}
                            onClickCover={() => addToQueue(v)}
                            onClick={(e) => handleDoubleClick(e, v)}
                        />
                    ))
                    }
                </Stack>
                {
                    genres !== null && <UnderlineTypo>
                        Genres
                    </UnderlineTypo>
                }
                <div className={'tw-flex tw-flex-wrap tw-gap-2 tw-w-full'}>
                    {genres !== null && genres.map((v, i) => (
                        <NextLink
                            className={'tw-flex-1'}
                            key={`genre_${i}_${v}`} href={`/search?q=${encodeURIComponent(v)}`}
                        >
                            <div
                                className={`${tailwindColors[i >= tailwindColors.length ? (getRandomInt(tailwindColors.length)) : i]} hover:tw-shadow-md hover:tw-shadow-white/20 hover:tw-brightness-150 tw-cursor-pointer active:tw-brightness-50 tw-font-bold tw-p-2 tw-rounded-md tw-min-w-[128px] md:tw-min-w-[256px] lg:tw-min-w-[360px] tw-min-h-[64px]`}
                            >
                                {v}
                            </div>
                        </NextLink>

                    ))}
                </div>
            </div>
        </>
    )
}

Search.getLayout = (page: React.ReactElement) => {
    return <MainLayout navbar={false}>{page}</MainLayout>
}

export default Search

export const getServerSideProps: GetServerSideProps<{
    genres: string[] | null
}> = async (ctx) => {
    const supabaseClient = createServerSupabaseClient<Database>(ctx)

    const genres = await supabaseClient
        .rpc('list_genres')

    const typicalGenres = ['rock', 'r&b', 'metal', 'heavy', 'country']

    let returnData = [...typicalGenres]

    if (genres.data) returnData = [...returnData, ...genres.data]

    return {
        props: {
            genres: returnData,
        },
    }
}
