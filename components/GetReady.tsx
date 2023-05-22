// @flow
import * as React from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import useProfile from '@/lib/hooks/useProfile'
import { useAppStates } from '@/lib/contexts/AppContext'
import LogoSvg from '@/components/LogoSvg'

type Props = {
    children: React.ReactNode
};

export default function GetReady(props: Props) {
    const user = useUser()
    const profile = useProfile()
    const {myPlaylists} = useAppStates()

    if (!user || !profile || myPlaylists === null)
        return <div className={"tw-h-screen tw-w-full tw-flex tw-justify-center tw-items-center"}>
            <LogoSvg w={128} h={128} />
        </div>

    return <>
        {props.children}
    </>
}