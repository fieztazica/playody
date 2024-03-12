import React from 'react'
import { Avatar, Icon } from '@chakra-ui/react'
import NextLink from 'next/link'
import LogoSvg from '@/components/LogoSvg'
import {
    RiLoginCircleLine,
    RiSearchFill,
    RiSearchLine,
    RiUpload2Fill,
    RiUpload2Line,
    RiPlayListFill,
    RiPlayListLine,
} from 'react-icons/ri'
import { usePathname } from 'next/navigation'
import { useAppStates } from '@/lib/contexts/AppContext'

type Props = {}

const MobileNavBar = (props: Props) => {
    const pathname = usePathname()
    const { profile } = useAppStates()
    return (
        <header className={'tw-block lg:tw-hidden'}>
            <div className={'tw-flex tw-flex-row tw-justify-between tw-items-center tw-bg-black/50 tw-px-2'}>
                {profile === null
                    ? <div key={`login_nav_link_logo`} className={'tw-flex-1'}>
                        <NextLink href={'/login'}>
                            <div className={'tw-flex tw-flex-col tw-justify-center tw-items-center tw-p-2'}>
                                <Icon as={RiLoginCircleLine} />
                                <span className={`tw-text-sm`}>
                                Login
                            </span>
                            </div>
                        </NextLink>
                    </div>
                    : <div key={`playlist_nav_link_logo`} className={'tw-flex-1'}>
                        <NextLink href={'/me/playlists'}>
                            <div className={'tw-flex tw-flex-col tw-justify-center tw-items-center tw-p-2'}>
                                {pathname == '/me/playlists' ? <Icon as={RiPlayListFill} /> :
                                    <Icon as={RiPlayListLine} />}
                                <span className={`tw-text-sm ${pathname == '/me/playlists' ? 'tw-font-bold' : ''}`}>
                                Playlist
                            </span>
                            </div>
                        </NextLink>
                    </div>}
                <div key={`search_nav_link_logo`} className={'tw-flex-1'}>
                    <NextLink href={'/search'}>
                        <div className={'tw-flex tw-flex-col tw-justify-center tw-items-center tw-p-2'}>
                            {pathname == '/search' ? <Icon as={RiSearchFill} /> : <Icon as={RiSearchLine} />}
                            <span className={`tw-text-sm ${pathname == '/search' ? 'tw-font-bold' : ''}`}>
                                Search
                            </span>
                        </div>
                    </NextLink>
                </div>
                <div key={`home_nav_link_logo`} className={'tw-flex-1 tw-flex tw-justify-center tw-p-2'}>
                    <NextLink href={'/'}>
                        <LogoSvg w={12} h={12}
                                 filter={pathname == '/'
                                     ? 'drop-shadow(0 0 5px rgb(255 255 255 / 0.4))'
                                     : undefined}
                        />

                    </NextLink>
                </div>
                <div key={`upload_nav_link_logo`} className={'tw-flex-1 '}>
                    <NextLink href={'/upload'}>
                        <div className={'tw-flex tw-flex-col tw-justify-center tw-items-center tw-p-2'}>
                            {pathname == '/upload' ? <Icon as={RiUpload2Fill} /> : <Icon as={RiUpload2Line} />}
                            <span className={`tw-text-sm ${pathname == '/upload' ? 'tw-font-bold' : ''}`}>
                                Upload
                            </span>
                        </div>
                    </NextLink>
                </div>
                <div key={`profile_nav_link_logo`} className={'tw-flex-1 tw-flex tw-justify-center'}>
                    <NextLink href={profile == null ? '/login' : '/me'}>
                        <div className={'tw-p-1'}>
                            <Avatar
                                size={'sm'}
                                src={profile?.avatar_url || undefined}
                                filter={pathname == '/me'
                                    ? 'drop-shadow(0 0 5px rgb(255 255 255 / 0.4))'
                                    : undefined} />
                        </div>
                    </NextLink>
                </div>
            </div>
        </header>
    )

}

export default MobileNavBar