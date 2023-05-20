// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Database } from '@/typings/supabase'
import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

async function Me(
    req: NextApiRequest,
    res: NextApiResponse<ApiResError | ApiResSuccess>,
) {
    const supabaseClient = createServerSupabaseClient<Database>({req,res})
    const supabaseAdmin = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string)
    // const subabaseAdminRes = await supabaseAdmin.auth.admin.updateUserById(
    //     '087d5ea3-ea14-4f20-858c-0b340e83cfeb',
    //     { app_metadata: { role: 'admin' } }
    // )
    const supabaseClientRes = await supabaseClient.auth.getUser()

    return res.json({
        message: "",
        data: supabaseClientRes.data,
        error: supabaseClientRes.error
    })

}

export default Me
