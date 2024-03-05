// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Database } from '@/typings/supabase'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

async function Me(
    req: NextApiRequest,
    res: NextApiResponse<ApiResError | ApiResSuccess>,
) {
    const supabaseClient = createServerSupabaseClient<Database>({req,res})
    const supabaseClientRes = await supabaseClient.auth.getUser()

    return res.json({
        message: "",
        data: supabaseClientRes.data,
        error: supabaseClientRes.error
    })

}

export default Me
