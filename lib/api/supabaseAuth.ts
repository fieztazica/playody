import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

const getProviderToken = async (req: NextApiRequest,
                                res: NextApiResponse) => {
    // Create authenticated Supabase Client
    const supabase = createServerSupabaseClient({ req, res })

    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session)
        throw res.status(403).json({
            message: 'session is not defined',
        })
}

export { getProviderToken }
