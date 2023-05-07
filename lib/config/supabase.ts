// ...
// Use `useSession()` or `unstable_getServerSession()` to get the NextAuth session.
import { createClient } from '@supabase/supabase-js'

// const session = useSession()
//
// const { supabaseAccessToken } = session;

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    // {
    //     global: {
    //         headers: {
    //             Authorization: `Bearer ${supabaseAccessToken}`,
    //         },
    //     },
    // }
);