import {
    Box,
    Divider,
    IconButton,
    Link,
} from '@chakra-ui/react'
import DisplayUser from './DisplayUser'
import NextLink from 'next/link'
import {
    RiHomeFill,
    RiHomeLine,
    RiSearchLine,
    RiSearchFill,
    RiUpload2Fill,
    RiUpload2Line,
} from 'react-icons/ri'
import React from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from '@supabase/auth-helpers-react'
import { HiPlus } from 'react-icons/hi'
import CreatePlaylistModal from '@/components/CreatePlaylistModal'
import NavLink, { NavLinkType } from '@/components/NavLink'
import { useAppStates } from '@/lib/contexts/AppContext'

const navLinks: NavLinkType[] = [
    {
        title: 'Home',
        href: '/',
        icon: RiHomeLine,
        activeIcon: RiHomeFill,
    },
    {
        title: 'Search',
        href: '/search',
        icon: RiSearchLine,
        activeIcon: RiSearchFill,
    },
    {
        title: 'Upload',
        href: '/upload',
        icon: RiUpload2Line,
        activeIcon: RiUpload2Fill,
    },
]

function SideBar() {
    const pathname = usePathname()
    const session = useSession()
    const isAdmin = session?.user.app_metadata.role == 'admin'
    const { myPlaylists } = useAppStates()

    return (
        <>
            <div className={'tw-p-2 tw-rounded-md tw-bg-black/20'}>
                <DisplayUser />
            </div>
            <div
                className={'tw-p-2 tw-rounded-md tw-bg-black/20 tw-h-full tw-grow tw-flex tw-flex-col tw-space-y-1 tw-overflow-y-auto'}>
                {
                    navLinks.map(v => {
                        return (
                            <div key={`${v.title} nav link`}>
                                <NavLink active={pathname == v.href} {...v} />
                            </div>
                        )
                    })
                }
                {isAdmin && <div key={`verify-tracks_nav link`}>
                    <NavLink active={pathname == '/verify-tracks'} href={'/verify-tracks'} title={'Verify Tracks'} />
                </div>}
                {session && <>
                    <Divider />
                    <div
                        className={`tw-flex tw-space-x-2 tw-items-center tw-justify-between tw-group tw-px-2 tw-py-1 
                                         hover:tw-bg-white/10 active:tw-bg-white/20 tw-rounded-md tw-w-full `}>
                        <Link as={NextLink} href={'/me/playlists'}>
                            <p className='tw-py-2 tw-text-lg tw-font-bold'>
                                My Playlists
                            </p>
                        </Link>
                        <Box>
                            <CreatePlaylistModal>
                                <IconButton
                                    aria-label='Modify Playlist'
                                    icon={<HiPlus />}
                                    variant={'ghost'}
                                    rounded={'full'}
                                    size={'lg'}
                                    fontSize={'2xl'}
                                />
                            </CreatePlaylistModal>
                        </Box>
                    </div>
                </>}
                {myPlaylists !== null && myPlaylists.map((v) => (
                    <div key={`${v.author}_${v.name}_playlist_nav_link`}>
                        <NavLink
                            active={false}
                            title={`${v.name}`}
                            href={`/me/playlists/${encodeURIComponent(v.name)}`}
                        />
                    </div>
                ))}
            </div>

        </>
    )
}

export default SideBar
