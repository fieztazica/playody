import {
    Box,
    Stack,
    useDisclosure,
    IconButton,
} from '@chakra-ui/react'
import AudioPlayer from './AudioPlayer'
import SideBar from './SideBar'
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi'
import LogoSvg from '@/components/LogoSvg'
import { PlayodyTitle } from '@/components/PlayodyTitle'
import React from 'react'
import { NavBar } from '@/components/NavBar'
import NextLink from 'next/link'
import GetReady from '@/components/GetReady'
import MobileNavBar from '@/components/MobileNavBar'

function MainLayout({ children, navbar = true }: { children: React.ReactNode, navbar?: boolean }) {
    return (
        <GetReady>
            <div className={'tw-h-dvh tw-flex tw-flex-col'}>
                <div className={'tw-flex-1 tw-overflow-y-auto'}>
                    <div
                        className={'tw-h-full tw-w-full tw-max-w-xs tw-hidden lg:tw-flex tw-float-left tw-flex-col tw-space-y-2 tw-resize-x tw-pt-2 tw-pl-2'}>
                        <SideBar />
                    </div>
                    <div className={'tw-overflow-y-auto tw-h-full tw-p-2'}>
                        <div className={'tw-h-full tw-rounded-md tw-flex tw-flex-col'}>
                            {navbar && <NavBar/>}
                            <main className={"tw-h-full"}>
                                    {children}
                            </main>
                        </div>
                    </div>
                </div>
                <div className={'tw-flex-none tw-mt-2'}>
                    <AudioPlayer />
                </div>
                <MobileNavBar/>
            </div>
        </GetReady>
    )
}

export default MainLayout
