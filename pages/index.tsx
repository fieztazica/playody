import React, { useState } from 'react'
import { Button, Input } from '@chakra-ui/react'
import useSpotify from '@/lib/hooks/useSpotify'
import MainLayout from '@/components/layouts/MainLayout'
import AudioWave from '@/components/rive/AudioWave'

const Home = () => {
    const spotifyApi = useSpotify()
    const [searchResults, setSearchResults] = useState<
        SpotifyApi.TrackObjectFull[]
    >([])
    const [query, setQuery] = useState<string>('')

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
            <main className='tw-flex tw-flex-col tw-items-center'>
                <div className='tw-w-full tw-p-2 tw-sticky tw-top-0 tw-bg-[rgba(0,0,0,0.1)]'>
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onBlur={() => findSong()}
                        placeholder='Search spotify'
                    />
                </div>
                <AudioWave />
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
            </main>
        </>
    )
}

Home.getLayout = (page: React.ReactElement) => {
    return <MainLayout>{page}</MainLayout>
}

export default Home

// export async function getServerSideProps({
//     req,
//                                          }: GetServerSidePropsContext) {
//     const secret = process.env.NEXTAUTH_SECRET
//     const tokenJWT = await getToken({ req, secret })
//     // console.log('JSON Web Token', tokenJWT)
//     return {
//         props: {
//             tokenJWT,
//         }, // will be passed to the page component as props
//     }
// }
