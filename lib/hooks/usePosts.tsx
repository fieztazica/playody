import { Profile, Track } from '@/typings'
import { useEffect, useRef, useState } from 'react'
import { useInViewport } from 'react-in-viewport'
import { useAppStates } from '../contexts/AppContext'
import useIndicator from './useIndicator'

export default function usePosts() {
    const { indicator: appIndicator } = useAppStates()
    const [page, setPage] = useState(1)
    const [isEnded, setIsEnded] = useState(false)
    const [posts, setPosts] = useState<
        (Track & { profiles: Profile | null })[]
    >([])
    const [loading, setLoading] = useState(false)
    const loadBoxRef = useRef(null)
    const { inViewport } = useInViewport(
        loadBoxRef,
        undefined,
        { disconnectOnLeave: false },
        undefined
    )
    useIndicator(loading, { indicator: appIndicator })

    async function loadPosts() {
        try {
            setLoading(true)
            const res = await fetch(`/api/track/list?page=${page}`).then((r) =>
                r.json()
            )

            if (res.error) {
                throw res.error
            }

            if (res.data.length) {
                setPosts((a) => [...a, ...res.data])
            } else {
                throw 'List empty'
            }
        } catch (e: any) {
            console.error(e)
            setIsEnded(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!isEnded) loadPosts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    useEffect(() => {
        if (!isEnded && inViewport) loadMore()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inViewport])

    const loadMore = () => {
        setPage((p) => p + 1)
    }

    return {
        posts,
        isEnded,
        loading,
        loadBoxRef,
        loadMore
    }
}
