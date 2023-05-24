import { NextApiRequest, NextApiResponse } from 'next'
import { AuthError, createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/typings/supabase'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export type TrackInsert = Database['public']['Tables']['tracks']['Insert']
export type TrackUpdate = Database['public']['Tables']['tracks']['Update']

class TrackApi {
    req: NextApiRequest
    res: NextApiResponse
    supabaseClient: SupabaseClient<Database>
    supabaseAdmin: SupabaseClient<Database>

    constructor(req: NextApiRequest, res: NextApiResponse) {
        this.req = req
        this.res = res
        this.supabaseClient = createServerSupabaseClient({ req, res })
        this.supabaseAdmin = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string)
    }

    async post(body: TrackInsert) {
        return (await this.supabaseClient.from('tracks').insert({
            ...body,
        }).select())
    }

    async get(trackId: string) {
        return (await this.supabaseClient
            .from('tracks')
            .select()
            .eq('id', trackId))
    }

    async getTracks(playlistName: string) {
        const sessionRes = await this
            .supabaseClient
            .auth
            .getSession()

        if (sessionRes.error) {
            return sessionRes
        }

        const fetchedPlaylist = await this
            .supabaseAdmin
            .from('playlists')
            .select('*')
            .eq('name', playlistName)
            .eq("author", sessionRes.data.session?.user.id)
            .limit(1)
            .single()

        if (fetchedPlaylist.error)
            return fetchedPlaylist

        return (await this.supabaseClient
            .from('tracks')
            .select()
            .in('id', fetchedPlaylist.data.trackIds || []))
    }

    async delete(trackId: string) {
        const sessionRes = await this
            .supabaseClient
            .auth
            .getSession()

        if (sessionRes.error) {
            return sessionRes
        }

        const fetchTrack = await this
            .supabaseAdmin
            .from('tracks')
            .select('*')
            .eq('id', trackId).limit(1)
            .single()

        if (fetchTrack.error || !fetchTrack.data) {
            return fetchTrack
        }

        if (sessionRes.data.session?.user.app_metadata.role != 'admin' && fetchTrack.data.author != sessionRes.data.session?.user.id) {
            return {
                data: null,
                error: new AuthError('This track is not your!', 400),
            }
        }

        return (await this.supabaseAdmin
            .from('tracks').delete()
            .eq('id', trackId))

    }

    async update(trackId: string, body: TrackUpdate) {
        const sessionRes = await this
            .supabaseClient
            .auth
            .getSession()

        if (sessionRes.error) {
            return sessionRes
        }

        if (sessionRes.data.session?.user.app_metadata.role != 'admin') {
            if ('is_verified' in body) {
                const notAdminError = new AuthError('You are not an admin!', 400)
                return {
                    data: null,
                    error: notAdminError,
                }
            }

            if (body.author != sessionRes.data.session?.user.id) {
                return {
                    data: null,
                    error: new AuthError('This is not your track!', 400),
                }
            }

            return (await this.supabaseAdmin
                .from('tracks')
                .update({
                    ...body,
                    is_verified: false
                })
                .eq('author', sessionRes.data.session?.user.id)
                .eq('id', trackId)
                .select())
        }

        return (await this.supabaseAdmin
            .from('tracks')
            .update({
                ...body,
            })
            .eq('id', trackId)
            .select())
    }
}

export default TrackApi