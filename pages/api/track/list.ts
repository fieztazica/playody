// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import TrackApi from '@/lib/api/track'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/typings/supabase'

async function ListTrack(
    req: NextApiRequest,
    res: NextApiResponse<ApiResError | ApiPagingResSuccess>,
) {
    let page = parseInt(req.query.page as string || '1')
    let pageSize = parseInt(req.query.per_page as string || '10')

    if (isNaN(page)) page = 1
    if (isNaN(pageSize)) pageSize = 10

    let fromIndex = (pageSize * page) - pageSize
    let toIndex = fromIndex + pageSize - 1

    const supabaseClient = createServerSupabaseClient<Database>({ req, res })
    const tracks = await supabaseClient
        .from('tracks')
        .select('*, profiles(*)')
        .eq('is_verified', true)
        .order('created_at', { ascending: false })
        .range(fromIndex, toIndex)


    return res.status(tracks.status).json({
        message: `[SUPABASE] ${tracks.statusText}`,
        data: tracks.data,
        error: tracks.error,
        pageSize: pageSize,
        page: page
    })
}

export default ListTrack
