import { NextApiRequest, NextApiResponse } from 'next'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/typings/supabase'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export type TrackInsert = Database['public']['Tables']['tracks']['Insert']

class TrackApi {
    req: NextApiRequest
    res: NextApiResponse
    supabase: SupabaseClient<Database>

    constructor(req: NextApiRequest, res: NextApiResponse) {
        this.req = req
        this.res = res
        this.supabase = createServerSupabaseClient({ req, res })
    }

    async post(body: TrackInsert) {
        const audio = new Audio(body.src || undefined)
        return (await this.supabase.from('tracks').insert({
            duration_s: audio.duration,
            ...body,
        }).select())
    }

    async get(trackId: string) {
        return (await this.supabase.from('tracks').select().eq('id', trackId))
    }
}

export default TrackApi