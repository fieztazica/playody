// @flow
import * as React from 'react'
import { IconButton, Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { RiSearchLine } from 'react-icons/ri'
import { PlayodyTitle } from '@/components/PlayodyTitle'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

type Props = {
    children?: ReactNode
};

export function NavBar(props: Props) {
    const router = useRouter()

    return (
        <nav
            className='tw-w-full tw-p-2 tw-sticky tw-top-0 tw-bg-black/20 tw-flex tw-justify-between tw-gap-2 tw-backdrop-blur-sm tw-z-10'>
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
                />
                {props.children}
            </div>
            <div className={'tw-hidden md:tw-flex tw-justify-center tw-items-center'}>
                <PlayodyTitle />
            </div>
        </nav>
    )
}