// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { spotifyApi } from '@/lib/config/spotify'
import { getProviderToken } from '@/lib/api/supabaseAuth'
import { ApiResError, ApiResSuccess } from '@/typings/apiRes'

async function SearchApi(
    req: NextApiRequest,
    res: NextApiResponse<ApiResError | ApiResSuccess>,
) {


}

export default SearchApi
