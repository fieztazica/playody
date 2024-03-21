import MainLayout from '@/components/MainLayout'
import useLyrics from '@/lib/hooks/useLyrics'
import { useRef } from 'react'

const LyricsPage = () => {
    const { playingTrack, lyrics, currentLineIndex, activeLine } = useLyrics()

    if (!playingTrack) {
        return (
            <>
                <div className="tw-flex tw-flex-col tw-items-center tw-h-full">
                    <div className="tw-text-md">No song currently playing</div>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="tw-flex tw-flex-col tw-items-center tw-h-full">
                <div
                    className={
                        'tw-flex tw-flex-col tw-w-full tw-space-y-2 tw-flex-1'
                    }
                >
                    {lyrics.length
                        ? lyrics.map((v, i) => (
                              <p
                                  key={`lyric_${i}`}
                                  ref={
                                      i == currentLineIndex
                                          ? activeLine
                                          : undefined
                                  }
                                  className={`tw-px-4 tw-text-xl lg:tw-text-2xl tw-font-bold ${
                                      i == currentLineIndex
                                          ? " tw-underline tw-decoration-2 tw-decoration-indigo-500 after:tw-content-['🎤'] tw-bg-black/20 tw-rounded-md"
                                          : ''
                                  }`}
                              >
                                  {v.text}
                              </p>
                          ))
                        : 'Lyrics not found'}
                </div>
                <div className="tw-text-xs">{`Provided by textyl.co, genius.com`}</div>
            </div>
        </>
    )
}

LyricsPage.getLayout = (page: React.ReactElement) => {
    return <MainLayout navbar={true}>{page}</MainLayout>
}

LyricsPage.title = 'Lyrics'

export default LyricsPage
