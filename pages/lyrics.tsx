import MainLayout from '@/components/MainLayout';
import { useAudioCtx } from '@/lib/contexts/AudioContext';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Text } from "@chakra-ui/react"
import { Lyrics } from '@/typings';
import Genius from "genius-lyrics";
// import { Lyrics } from '../../components/Lyrics';
// import { getLyrics } from '../../lib/api';

const LyricsPage = () => {
    const [lyrics, setLyrics] = useState<Lyrics>([]);
    const { currentTime, playingTrack } = useAudioCtx()

    useEffect(() => {
        if (!playingTrack) return;

    }, [playingTrack]);

    if (!playingTrack) {
        return (
            <>
                <div className='tw-flex tw-flex-col tw-items-center tw-h-full'>
                    <div className='tw-text-md'>No song currently playing</div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className='tw-flex tw-flex-col tw-items-center tw-h-full'>
                <div className={'tw-flex tw-flex-col tw-w-full tw-space-y-2 tw-flex-1'}>
                    {currentTime.toFixed(1)}
                    {playingTrack?.name}
                </div>
                <div className='tw-text-xs'>Provided by Genius</div>
            </div>
        </>
    );
}

LyricsPage.getLayout = (page: React.ReactElement) => {
    return <MainLayout navbar={true}>{page}</MainLayout>
}

LyricsPage.title = 'Lyrics'

export default LyricsPage