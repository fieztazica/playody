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
} from '@chakra-ui/react'
import Link from 'next/link'
import AudioPlayer from '../AudioPlayer'
import Head from 'next/head'

function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Head>
                <title>Playody</title>
            </Head>
            <Grid className=" tw-h-screen" templateRows="repeat(40, 1fr)">
                <GridItem
                    rowSpan={35}
                    boxShadow={'0 0 25px -15px #FF0080, 0 0 20px -10px #7928CA'}
                >
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
                    >
                        <Flex>
                            <Avatar mr={5} />
                            <Stack direction={'column'}>
                                <Link href="/">Ten tao</Link>
                                <Link href="/">Logout</Link>
                            </Stack>
                        </Flex>
                        <Stack>
                            <Divider />
                            <Link href="/">Home</Link>
                            <Link href="/">Trending</Link>
                            <Link href="/">For You</Link>
                            <Link href="/">My Playlists</Link>
                            <Divider />
                            {new Array(10).fill(0).map((v, i) => (
                                <Link key={i} href="#">
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
                        bgGradient="linear(to-b, blue.900, purple.900, pink.900)"
                    >
                        <Box bgColor={"rgba(0,0,0, 0.15)"}>
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
                <GridItem rowSpan={5} display={'block'} overflow={'hidden'}>
                    <AudioPlayer />
                </GridItem>
            </Grid>
        </>
    )
}

export default MainLayout
