import { Track } from "@/typings";
import MainLayout from "./MainLayout";
import Head from 'next/head'
import { TrackCard } from "./TrackCard";
import { Box } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";

function PostCard() {
    // TODO: a card for feed page posts
    const expTrack : Track = {
        name: "Thoi Em DUng DI",
        src: "http",
        duration_s: 320,
        id: "321",
        artists: null,
        author: "tao",
        created_at: new Date(Date.now()).toLocaleString(),
        is_verified: false,
        genres: null,
        image_url: ""
    }
    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <Box p={4}>
                {new Array<Track>(5).fill(expTrack).map((v, i) => (
                   <Box key={`search ${i}`} borderRadius="md" boxShadow="md" p={4} mb={4} width={{ base: "100%", sm: "80%" }}>
                   <Box>
                       <Text fontWeight="bold">
                           @{v.author} has just uploaded a track
                       </Text>
                       <Text fontSize="sm" color="gray.500">
                           at {v.created_at}
                       </Text>
                   </Box>
                   <Box mt={4}>
                       <TrackCard track={expTrack}/>
                   </Box>
               </Box>
                ))}
            </Box>
        </>
    )
}

PostCard.getLayout = (page: React.ReactElement) => {
    return <MainLayout>{page}</MainLayout>
}

export default PostCard




