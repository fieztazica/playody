declare namespace SpotifyApi {
    declare interface AppTrack {
        name: string
        youtubeId: string
        cover?: string
        artists: ArtistObjectFull[]
        spotifyUri?: string
        album: string
    }
}
