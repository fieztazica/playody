import Rive, { useRive } from '@rive-app/react-canvas'

const AudioWave = () => {
    const {
        rive,
        RiveComponent: RiveComponentPlayback,
    } = useRive({
        src: 'https://public.rive.app/community/runtime-files/1990-3941-audio-visualizer.riv',
        autoplay: true,
    })
    return (
        <RiveComponentPlayback />


    )
}

export default AudioWave