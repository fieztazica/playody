import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

const spotifyScopes = encodeURIComponent([
    "streaming",
    "user-read-email",
    "user-read-private",
    "user-library-read",
    "user-library-modify",
    "user-read-playback-state",
    "user-modify-playback-state",
    "playlist-read-private",
    "playlist-read-collaborative",

].join(" "))

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID as string,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
            authorization: `https://accounts.spotify.com/authorize?scope=${spotifyScopes}`
        })
    ],
    callbacks: {
        async session({ session, token, user }: any) {
            session.user.id = token.id;
            session.accessToken = token.accessToken;
            return session;
        },
        async jwt({ token, user, account, profile, isNewUser }: any) {
            if (user) {
                token.id = user.id;
            }
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
    },
}

export default NextAuth(authOptions)
