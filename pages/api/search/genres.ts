// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/typings/supabase'

async function getGenres(
    req: NextApiRequest,
    res: NextApiResponse<ApiResError | ApiResSuccess>,
) {

    const supabase = createServerSupabaseClient<Database>({ req, res })
    const searchRes = await supabase
        .rpc("list_genres")

    return res.status(searchRes.status).json({
        message: searchRes.error?.message,
        data: searchRes.data,
        error: searchRes.error,
    })

}

export default getGenres
