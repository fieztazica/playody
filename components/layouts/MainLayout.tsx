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

function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <Grid className="tw-h-full" templateRows="repeat(20, 1fr)">
            <GridItem rowSpan={18}>
                <Box
                    maxW={'sm'}
                    display={{ base: 'none', md: 'flex' }}
                    as={Stack}
                    bgColor={'purple'}
                    width={'3xs'}
                    resize={'horizontal'}
                    overflow={'hidden'}
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
                    <Divider />
                    <Link href="/">Home</Link>
                    <Link href="/">Trending</Link>
                    <Link href="/">For You</Link>
                    <Link href="/">My Playlists</Link>
                    <Divider />
                </Box>
                <Box
                    as={Flex}
                    direction={'column'}
                    float={'none'}
                    overflow={'hidden'}
                    h="full"
                >
                    <Box bgColor={'red'}>
                        <Container p={5}>
                            <Input
                                focusBorderColor="pink.400"
                                color={'cyan'}
                                placeholder="Search a song..."
                                _placeholder={{ color: 'inherit' }}
                            />
                        </Container>
                    </Box>
                    <Box bgColor={'green'} flexGrow={1}>
                        {children}
                    </Box>
                </Box>
            </GridItem>
            <GridItem rowSpan={2} bgColor={'yellow'}>
                <Box>audio</Box>
            </GridItem>
        </Grid>
    )
}

export default MainLayout
