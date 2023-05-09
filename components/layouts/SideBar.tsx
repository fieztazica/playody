import { Box, Divider, Link, Stack } from '@chakra-ui/react'
import DisplayUser from '../DisplayUser'

function SideBar() {
    return (
        <>
            <DisplayUser />
            <Stack>
                <Divider />
                <Link href='/'>Home</Link>
                <Link href='/'>Trending</Link>
                <Link href='/'>For You</Link>
                <Link href='/'>My Playlists</Link>
                <Divider />
                {new Array(10).fill(0).map((v, i) => (
                    <Link key={i} href='#' w={'fit-content'}>
                        Playlist #{i}
                    </Link>
                ))}
            </Stack>
        </>
    )
}

export default SideBar
