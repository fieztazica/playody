// @flow
import * as React from 'react'
import { IconButton, Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { RiSearchLine } from 'react-icons/ri'
import { PlayodyTitle } from '@/components/PlayodyTitle'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import NextLink from 'next/link'

type Props = {
    mobile?: boolean;
    children?: ReactNode
};

export function NavBar({ mobile = false, children, ...props }: Props) {
    const router = useRouter()
// tw-sticky tw-top-0 tw-backdrop-blur-sm tw-z-10 tw-h-fit tw-mb-2
    // tw-hidden md:tw-flex
    return (
        <nav
            className={`tw-w-full tw-sticky tw-top-0 tw-backdrop-blur-sm tw-z-10 tw-mb-2 ${mobile ? `tw-hidden md:tw-flex` : 'tw-flex'}`}>
            <div
                className='tw-w-full tw-p-2 tw-bg-black/20 tw-flex tw-justify-between tw-gap-2 tw-rounded-md'>
                <div className={'tw-flex tw-gap-2 tw-w-full md:tw-w-fit'}>
                    <IconButton
                        display={{ base: 'none', md: 'flex' }}
                        icon={<FiChevronLeft />}
                        title={'Back'} aria-label={'back button'}
                        onClick={() => router.back()}
                    />
                    <IconButton
                        display={{ base: 'none', md: 'flex' }}
                        icon={<FiChevronRight />}
                        title={'Forward'} aria-label={'back button'}
                        onClick={() => router.forward()}
                        isDisabled
                    />
                    {children}
                </div>
                <div className={'tw-hidden md:tw-flex tw-justify-center tw-items-center tw-px-2'}>
                    <NextLink href={'/'}>
                        <PlayodyTitle />
                    </NextLink>
                </div>
            </div>
        </nav>
    )
}