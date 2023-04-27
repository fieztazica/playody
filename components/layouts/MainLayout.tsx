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

function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Head>
                <title>Playody</title>
            </Head>
            <Grid h="full" templateRows="repeat(40, 1fr)">
                <GridItem rowSpan={35}>
                    <Box
                        maxW={'sm'}
                        display={{ base: 'none', md: 'block' }}
                        as={Stack}
                        width={'3xs'}
                        resize={'horizontal'}
                        overflow={'auto'}
                        p={5}
                        h="full"
                        float={'left'}
                        textOverflow={'ellipsis'}
                        bgColor={'rgba(0,0,0, 0.08)'}
                        borderRight={'1px'}
                        borderRightColor={'gray.600'}
                        borderRightStyle={'solid'}
                    >
                        <DisplayUser />
                        <Stack>
                            <Divider />
                            <Link href="/">Home</Link>
                            <Link href="/">Trending</Link>
                            <Link href="/">For You</Link>
                            <Link href="/">My Playlists</Link>
                            <Divider />
                            {new Array(10).fill(0).map((v, i) => (
                                <Link key={i} href="#" w={'fit-content'}>
                                    Playlist #{i}
                                </Link>
                            ))}
                        </Stack>
                    </Box>
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
                        <Box flexGrow={1} display={'block'} overflow={'auto'}>
                            {children}
                        </Box>
                    </Box>
                </GridItem>
                <GridItem
                    rowSpan={{ base: 'auto', md: 5 }}
                    display={{ base: 'none', md: 'block' }}
                    overflow={'hidden'}
                    bgColor={'rgba(0,0,0,1)'}
                    boxShadow={
                        'inset 0 10px 25px -25px #FF0080, inset 0 10px 20px -20px #7928CA'
                    }
                >
                    <AudioPlayer />
                </GridItem>
            </Grid>
        </>
    )
}

export default MainLayout
