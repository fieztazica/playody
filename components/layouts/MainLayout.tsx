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
    Link,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import AudioPlayer from '../AudioPlayer'
import Head from 'next/head'
import DisplayUser from '../DisplayUser'
import SideBar from './SideBar'

function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Head>
                <title>Playody</title>
            </Head>
            <Grid h="full" templateRows="auto 1fr auto">
                <GridItem rowSpan={35}>
                    <SideBar />
                    <Box
                        as={Flex}
                        direction={'column'}
                        float={'none'}
                        overflow={'hidden'}
                        h="full"
                    >
                        <Box bgColor={'rgba(0,0,0, 0.1)'}>
                            <Container p={5}>
                                <Input
                                    focusBorderColor="pink.400"
                                    placeholder="Search a song..."
                                    _placeholder={{ color: 'inherit' }}
                                />
                            </Container>
                        </Box>
                        <Box display={'block'} overflowY={'auto'}>
                            {children}
                        </Box>
                    </Box>
                </GridItem>
                <GridItem
                    rowSpan={{ base: 'auto', md: 5 }}
                    display={{ base: 'none', md: 'block' }}
                    overflow={'hidden'}
                >
                    <AudioPlayer />
                </GridItem>
            </Grid>
        </>
    )
}

export default MainLayout
