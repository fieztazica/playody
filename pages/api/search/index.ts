// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/typings/supabase'

async function SearchApi(
    req: NextApiRequest,
    res: NextApiResponse<ApiResError | ApiResSuccess>
) {
    const q = req.query['q']
    if (!q || !q.length) {
        res.status(400).json({
            message: "Query 'q' not provided",
            data: null,
            error: null,
        })
        return
    }
    const query = decodeURIComponent(q as string)
    const supabase = createServerSupabaseClient<Database>({ req, res })
    const searchRes = await supabase.rpc('search_tracks', {
        query_text: `${query}`,
    })

    return res.status(searchRes.status).json({
        message: searchRes.error?.message,
        data: searchRes.data,
        error: searchRes.error,
    })
}

export default SearchApi
