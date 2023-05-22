// @flow
import * as React from 'react'
import { IconType } from 'react-icons'
import NextLink from 'next/link'
import { Icon } from '@chakra-ui/react'

export type NavLinkType = {
    icon: IconType
    activeIcon: IconType
    href: string
    title: string
}

export type NavLinkProps  = {
    active: boolean
    icon?: IconType
    activeIcon?: IconType
    href: string
    title: string
    children?: React.ReactNode
    [key: string]: any
}
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
        <NextLink href={href} >
            <div
                className={`tw-flex tw-space-x-2 tw-items-center tw-group tw-px-2 tw-py-1 hover:tw-bg-white/10 active:tw-bg-white/20 tw-rounded-md ${
                    active ? 'tw-font-bold tw-bg-white/5' : ''
                }`}
                {...props}
            >
                {icon && activeIcon && <Icon as={leftIcon} />}
                <span className={`${active ? 'tw-font-bold' : ''}`}>
                    {title}
                </span>
            </div>
        </NextLink>
    )
}

export default NavLink