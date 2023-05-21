import { Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import { ReactNode } from 'react'

type Props = {
    text: string
    children?: ReactNode
    [key: string]: any
};

export default function SearchLink({ text, children, ...props }: Props) {
    const query = encodeURIComponent(`${text.toLowerCase()}`)
    return (
        <Link as={NextLink} href={`/search?q=${query}`} {...props}>
            { children || text}
        </Link>
    )
}