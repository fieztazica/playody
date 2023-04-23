import { ExtendedToken, TokenError } from "@/typings";
import { spotifyApi, scopes } from "@/lib/config/spotify";
import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

const spotifyScopes = encodeURIComponent(scopes)

const refreshAccessToken = async (
    token: ExtendedToken
): Promise<ExtendedToken> => {
    try {
        spotifyApi.setAccessToken(token.accessToken)
        spotifyApi.setRefreshToken(token.refreshToken)

        // Refresh access token
        const { body: refreshedTokens } = await spotifyApi.refreshAccessToken()

        console.log('REFRESHED TOKENS ARE: ', refreshedTokens)

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            refreshToken: refreshedTokens.refresh_token || token.refreshToken,
            accessTokenExpiresAt: Date.now() + refreshedTokens.expires_in * 1000
        }
    } catch (error) {
        console.error(error)

        return {
            ...token,
            error: TokenError.RefreshAccessTokenError
        }
    }
}

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID as string,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
            authorization: `https://accounts.spotify.com/authorize?scope=${spotifyScopes}`
        })
    ],
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async session({ session, token, user }: any) {
            session.accessToken = (token as ExtendedToken).accessToken
            session.error = (token as ExtendedToken).error
            return session;
        },
        async jwt({ token, user, account, profile, isNewUser }: any) {
            let extendedToken: ExtendedToken

            // User logs in for the first time
            if (account && user) {
                extendedToken = {
                    ...token,
                    user,
                    accessToken: account.access_token as string,
                    refreshToken: account.refresh_token as string,
                    accessTokenExpiresAt: (account.expires_at as number) * 1000 // converted to ms
                }

                // console.log('FIRST TIME LOGIN, EXTENDED TOKEN: ', extendedToken)
                return extendedToken
            }

            // Subsequent requests to check auth sessions
            if (Date.now() + 5000 < (token as ExtendedToken).accessTokenExpiresAt) {
                // console.log('ACCESS TOKEN STILL VALID, RETURNING EXTENDED TOKEN: ', token)
                return token
            }

            // Access token has expired, refresh it
            // console.log('ACCESS TOKEN EXPIRED, REFRESHING...')
            return await refreshAccessToken(token as ExtendedToken)
        },
    },
})
