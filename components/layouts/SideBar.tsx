import { Box, Divider, Link, Stack } from '@chakra-ui/react'
import DisplayUser from '../DisplayUser'

function SideBar() {
    return (
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
    )
}

export default SideBar
