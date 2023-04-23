import { NextPage } from 'next'
import { Session, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'

export enum TokenError {
    RefreshAccessTokenError = 'RefreshAccessTokenError'
}

export interface ExtendedToken extends JWT {
    accessToken: string
    refreshToken: string
    accessTokenExpiresAt: number
    user: User
    error?: TokenError
}

export interface ExtendedSession extends Session {
    accessToken: ExtendedToken['accessToken']
    error: ExtendedToken['error']
}

export interface UserProfile {
    country: string;
    display_name: string;
    email: string;
    explicit_content: {
        filter_enabled: boolean,
        filter_locked: boolean
    },
    external_urls: { spotify: string; };
    followers: { href: string; total: number; };
    href: string;
    id: string;
    images: Image[];
    product: string;
    type: string;
    uri: string;
}

interface Image {
    url: string;
    height: number;
    width: number;
}

export type AppCtxType = {
    theme: "dark" | "light"
}

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

export type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}
