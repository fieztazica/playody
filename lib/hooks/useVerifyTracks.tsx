import { Track, TrackWithProfile } from '@/typings'
import { Database } from '@/typings/supabase'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { ChangeEvent, useEffect, useState } from 'react'
import { TrackUpdate } from '../api/track'

export default function useVerifyTracks(inputTracks: TrackWithProfile[]) {
    const session = useSession()
    const supabaseClient = useSupabaseClient<Database>()
    const [tracks, setTracks] = useState<TrackWithProfile[] | null>(null)
    const [verifiedTrack, setVerifiedTrack] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [filter, setFilter] = useState('')

    async function toggleVerified({ id, is_verified }: Track) {
        try {
            const updateObj: TrackUpdate = { is_verified: !is_verified }
            const res = await fetch(`/api/track?trackId=${id}`, {
                method: 'PUT',
                body: JSON.stringify(updateObj),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((r) => r.json())

            if (res.error) throw res.error

            refresh()
        } catch (e: any) {
            if (e?.message) alert(e.message)
            console.error(e)
        }
    }

    function handleDelete(id: string) {
        ;(async () => {
            try {
                const res = await fetch(`/api/track?trackId=${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then((r) => r.json())

                if (res.error) throw res.error

                refresh()
            } catch (e: any) {
                if (e?.message) alert(e.message)
                console.error(e)
            }
        })()
    }

    async function refresh() {
        try {
            setRefreshing(true)
            const { data, error } = await supabaseClient
                .from('tracks')
                .select('*, profiles(*)')
                .order('created_at', { ascending: false })

            if (error || !data) {
                throw error
            }

            if (data) setTracks([...(data as any)])
        } catch (e: any) {
            if (e?.message) alert(e.message)
            console.error(e)
        } finally {
            setRefreshing(false)
        }
    }

    function onSearch(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault()
        setFilter(e.target.value.toLowerCase())
    }

    function onVerifiedChange(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault()
        setVerifiedTrack(e.target.checked)
    }

    useEffect(() => {
        if (inputTracks !== null) {
            setTracks([...inputTracks])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const filteredTracks =
        tracks &&
        tracks
            .filter((v) => v.is_verified === verifiedTrack)
            .filter((v) =>
                filter
                    ? v.name.toLowerCase().includes(filter) ||
                      v.genres?.join(',').toLowerCase().includes(filter) ||
                      v.artists.join(',').toLowerCase().includes(filter)
                    : true
            )

    return {
        session,
        onSearch,
        filter,
        verifiedTrack,
        onVerifiedChange,
        refresh,
        refreshing,
        tracks,
        handleDelete,
        toggleVerified,
        filteredTracks,
    }
}
