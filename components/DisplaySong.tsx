import { AspectRatio, Box, Image, Square, Stack, Text } from '@chakra-ui/react'

function DisplaySong() {
    return (
        <Stack
            h="full"
            direction={'row'}
            w="fit-content"
            // bg="red"
            align={'center'}
            maxW={'300px'}
        >
            {/* <Box bgColor={'black'} w="128px" h="128px"> */}
            <Image
                src="https://cdn.discordapp.com/attachments/1085226397255094324/1100046203644821504/image.png"
                alt="song image"
                objectFit={'cover'}
                boxSize="90px"
                boxShadow={'0 0 20px -15px white'}
            />
            {/* </Box> */}

            <Stack spacing={1} align={'left'} justifyItems={'center'}>
                <Text noOfLines={2} fontSize={18} fontWeight={'bold'}>
                    Never Gonna Give You Up
                </Text>
                <Text noOfLines={1} fontSize={16} fontWeight={"light"}>Rick Astley</Text>
            </Stack>
        </Stack>
    )
}

export default DisplaySong
