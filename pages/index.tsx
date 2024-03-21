import MainLayout from '@/components/MainLayout'
import { NavBar } from '@/components/NavBar'
import PostCard from '@/components/PostCard'
import SearchBar from '@/components/SearchBar'
import usePosts from '@/lib/hooks/usePosts'
import { Button } from '@chakra-ui/react'
import React, { useState } from 'react'

const Home = () => {
    const { posts, isEnded, loadBoxRef, loadMore, loading } = usePosts()
    const [filter, setFilter] = useState('')

    return (
        <>
            <NavBar>
                <SearchBar
                    query={filter}
                    placeholder={'Search for a post'}
                    onChange={(e) => {
                        e.preventDefault()
                        setFilter(e.target.value.toLowerCase())
                    }}
                />
            </NavBar>
            <div className={'tw-flex tw-flex-col tw-space-y-2'}>
                {posts.length > 0 &&
                    posts
                        .filter((v) =>
                            filter
                                ? v.name.toLowerCase().includes(filter) ||
                                  v.genres
                                      ?.join(',')
                                      .toLowerCase()
                                      .includes(filter) ||
                                  v.artists
                                      .join(',')
                                      .toLowerCase()
                                      .includes(filter) ||
                                  v.profiles?.full_name
                                      ?.toLowerCase()
                                      .includes(filter)
                                : true
                        )
                        .map((v, i) => (
                            <div key={`track_${i}_${v.id}`}>
                                <PostCard track={v} />
                            </div>
                        ))}
                <Button
                    ref={loadBoxRef}
                    isLoading={loading}
                    display={isEnded ? 'none' : 'flex'}
                    onClick={loadMore}
                >
                    Load more
                </Button>
            </div>
        </>
    )
}

Home.getLayout = (page: React.ReactElement) => {
    return <MainLayout navbar={false}>{page}</MainLayout>
}

Home.title = 'Home'

export default Home
