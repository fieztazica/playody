import {
    Box,
    Button,
    Divider,
    Icon,
    IconButton,
    Link,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Stack,
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
import { IconType } from 'react-icons'
import React from 'react'
import { usePathname } from 'next/navigation'
import { MdQueueMusic, MdOutlineQueueMusic } from 'react-icons/md'
import { useUser } from '@supabase/auth-helpers-react'
import { FaPlus } from 'react-icons/fa'
import { PlusSquareIcon } from '@chakra-ui/icons'

type NavLinkType = {
    icon: IconType
    activeIcon: IconType
    href: string
    title: string
}

type NavLinkProps = {
    active: boolean
    icon?: IconType
    activeIcon?: IconType
    href: string
    title: string
    children?: React.ReactNode
}

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
    {
        title: 'Queue',
        href: '/queue',
        icon: MdQueueMusic,
        activeIcon: MdOutlineQueueMusic,
    },
]

const NavLink = ({
    active,
    icon,
    activeIcon,
    href,
    children,
    title,
    ...props
}: NavLinkProps) => {
    const leftIcon = active ? activeIcon : icon

    return (
        <NextLink href={href}>
            <div
                className={`tw-flex tw-space-x-2 tw-items-center tw-group tw-px-2 tw-py-1 hover:tw-bg-white/10 active:tw-bg-white/20 tw-rounded-md ${
                    active ? 'tw-font-bold tw-bg-white/5' : ''
                }`}
            >
                {icon && activeIcon && <Icon as={leftIcon} />}
                <span className={`${active ? 'tw-font-bold' : ''}`}>
                    {title}
                </span>
            </div>
        </NextLink>
    )
}

function SideBar() {
    const pathname = usePathname()
    const user = useUser()
    const isAdmin = user?.app_metadata.role === 'admin'

    return (
        <>
            <div className={'tw-p-2 tw-rounded-md tw-bg-black/20'}>
                <DisplayUser />
            </div>
            <div
                className={
                    'tw-p-2 tw-rounded-md tw-bg-black/20 tw-h-full tw-grow tw-flex tw-flex-col tw-space-y-1 tw-overflow-y-auto'
                }
            >
                {navLinks.map((v) => {
                    return (
                        <div
                            key={`${v.title} nav link`}
                            className={
                                v.title == 'Queue'
                                    ? 'tw-block md:tw-hidden'
                                    : undefined
                            }
                        >
                            <NavLink active={pathname == v.href} {...v} />
                        </div>
                    )
                })}
                {isAdmin && (
                    <div key={`verify-tracks_nav link`}>
                        <NavLink
                            active={pathname == '/verify-tracks'}
                            href={'verify-tracks'}
                            title={'Verify Tracks'}
                        />
                    </div>
                )}
                <Divider />
                <div
                    className={`tw-flex tw-space-x-2 tw-items-center tw-justify-between tw-group tw-px-2 tw-py-1 
                                         hover:tw-bg-white/10 active:tw-bg-white/20 tw-rounded-md tw-w-full `}> 
                    <div className='tw-py-4' >My Playlist</div>
                    <Popover>
                        <PopoverTrigger>
                            <IconButton
                                aria-label='Modify Playlist'
                                bg={'blend'}
                                icon={<PlusSquareIcon />}
                            />
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>Confirmation!</PopoverHeader>
                            <PopoverBody>
                                Are you sure you want to have that milkshake?
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>              
                </div>
                {new Array(50).fill(0).map((v, i) => (
                    <div key={`${i} nav link`}>
                        <NavLink
                            active={false}
                            title={`Playlist #${i}`}
                            href={`#`}
                        />
                    </div>
                ))}
            </div>

        </>
    )
}

export default SideBar
