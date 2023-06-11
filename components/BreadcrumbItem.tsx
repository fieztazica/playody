import { Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import { ReactNode } from 'react'

const BreadcrumbItem = ({ children, href, isCurrent = false, ...props }: {
    children?: ReactNode,
    href: string,
    isCurrent?: boolean,
    [key: string]: any
}) => {
    return (
        <li {...props}>
            {isCurrent ? <span className={"tw-bg-purple-400/40 tw-rounded-full tw-px-2 tw-py-1"} aria-current={"page"}>{children}</span> :
                <Link
                    href={href}
                    as={NextLink}
                    aria-current={'false'}
                >
                    {children}
                </Link>}

        </li>
    )
}

export default BreadcrumbItem
