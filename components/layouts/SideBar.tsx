import { Box, Divider, Link, Stack } from '@chakra-ui/react'
import DisplayUser from '../DisplayUser'
import NextLink from 'next/link';

function SideBar() {
    return (
        <>
            <DisplayUser />
            <Stack>
                <Divider />
                <Link as={NextLink} href='/'>Home</Link>
                <Link as={NextLink} href='/search'>Search</Link>
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
