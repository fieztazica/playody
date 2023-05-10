import {
    Avatar,
    Box,
    Container,
    Divider,
    Flex,
    Grid,
    GridItem,
    Input,
    Stack,
    Link, useDisclosure, IconButton,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import AudioPlayer from '../AudioPlayer'
import DisplayUser from '../DisplayUser'
import SideBar from './SideBar'
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi'
import LogoSvg from '@/components/LogoSvg'
import { PlayodyTitle } from '@/components/PlayodyTitle'

function MainLayout({ children }: { children: React.ReactNode }) {

    const { isOpen, onClose, onOpen, onToggle } = useDisclosure()

    return (
        <div className={'tw-h-screen tw-flex tw-flex-col'}>
            <header className={'tw-block md:tw-hidden tw-p-2 tw-bg-[rgba(0,0,0,0.1)]'}>
                <div className={'tw-flex tw-justify-between'}>
                    <div className={'tw-flex-none'}>
                        <IconButton
                            aria-label='burger button'
                            onClick={onToggle}
                            icon={isOpen ? <BiLeftArrow /> : <BiRightArrow />}
                        />
                    </div>
                    <div className={'tw-grow tw-flex tw-justify-center tw-items-center tw-overflow-x-hidden'}>
                        <PlayodyTitle />
                    </div>
                    <div
                        className={'tw-flex-none tw-rounded-md tw-p-1 tw-bg-white/10 hover:tw-bg-white/20 tw-cursor-pointer'}>
                        <LogoSvg w={8} h={8} />
                    </div>
                </div>
            </header>
            <div className={'tw-grow tw-overflow-auto'}>
                <Box
                    maxW={'sm'}
                    display={{ base: 'none', md: 'block' }}
                    as={Stack}
                    width={'3xs'}
                    resize={'horizontal'}
                    overflow={'auto'}
                    h='full'
                    p={2}
                    float={'left'}
                    textOverflow={'ellipsis'}
                    bgColor={'rgba(0,0,0, 0.08)'}
                    borderRight={'1px'}
                    borderRightColor={'gray.600'}
                    borderRightStyle={'solid'}
                >
                    <SideBar />
                </Box>
                <div className={'tw-overflow-y-auto tw-grow tw-h-full tw-flex-col'}>
                    {isOpen && <div onClick={onClose} className={'tw-p-2 tw-bg-[rgba(0,0,0,0.1)]'}>
                        <hr className={'tw-mb-2'} />
                        <SideBar />
                        <hr className={'tw-mt-2'} />
                    </div>}
                    <main className={'tw-grow tw-h-full'}>
                        {children}
                    </main>
                </div>
            </div>
            <div className={'tw-bottom-0'}>
                <AudioPlayer />
            </div>
        </div>
    )
}

export default MainLayout
