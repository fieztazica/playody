// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/typings/supabase'

async function SearchApi(
    req: NextApiRequest,
    res: NextApiResponse<ApiResError | ApiResSuccess>,
) {

    const query = decodeURIComponent(req.query['q'] as string)
    const supabase = createServerSupabaseClient<Database>({ req, res })
    const searchRes = await supabase
        .rpc('search_tracks', {
            query_text: `${query}`,
        })

    return res.status(searchRes.status).json({
        message: searchRes.error?.message,
        data: searchRes.data,
        error: searchRes.error,
    })

}

export default SearchApi
