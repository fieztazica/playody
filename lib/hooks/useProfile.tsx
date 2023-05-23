import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Database } from '@/typings/supabase'
import { Profile } from '@/typings'
import { useEffect, useState } from 'react'

const useProfile = () => {
    const supabaseClient = useSupabaseClient<Database>()
    const user = useUser()
    const [profile, setProfile] = useState<Profile | null>(null)

    useEffect(() => {
        (async () => {
            try {
                if (!user) throw "[useProfile] Not Authenticated";

                const { data, error } = await supabaseClient
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .limit(1)
                    .single()

                if (error) {
                    throw error
                }

                if (data) {
                    setProfile(data)
                }
            } catch (e) {
                console.error(e)
            }
        })()
    }, [user, supabaseClient])

    if (!user || !supabaseClient) return null
    return profile
}

export default useProfile