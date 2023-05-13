import ytsr from 'ytsr'

interface ApiResError{
    message: string,
    error?: any
}

interface ApiResSuccess {
    message?: string,
    data?: any
}

interface ApiResConvertData {
    spotify: SpotifyApi.SingleTrackResponse,
    youtube: ytsr.Result,
    videos: ytsr.Video[]
}

interface ApiResConvertSuccess extends ApiResSuccess {
    data: ApiResConvertData
}