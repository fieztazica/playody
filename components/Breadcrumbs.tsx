import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Breadcrumb from '@/components/Breadcrumb'
import BreadcrumbItem from '@/components/BreadcrumbItem'
import { MdHome } from 'react-icons/md'
import { Icon } from '@chakra-ui/react'
import LogoSvg from '@/components/LogoSvg'

type BreadcrumbItemProps = {
    href: string,
    label: string,
    isCurrent: boolean
}

const Breadcrumbs = () => {
    const router = useRouter()
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItemProps[]>([])

    useEffect(() => {
        const pathWithoutQuery = router.asPath.split('?')[0]
        let pathArray = pathWithoutQuery.split('/')
        pathArray.shift()

        pathArray = pathArray.filter((path) => path !== '')

        const breadcrumbs = pathArray.map((path, index) => {
            const href = '/' + pathArray.slice(0, index + 1).join('/')
            return {
                href,
                label: path,
                isCurrent: index === pathArray.length - 1,
            }
        })

        setBreadcrumbs(breadcrumbs)
    }, [router.asPath])

    return (
        <Breadcrumb>
            <BreadcrumbItem isCurrent={router.pathname === '/'} href={'/'}>
                <Icon as={LogoSvg} boxSize={6}/>
            </BreadcrumbItem>
            {breadcrumbs &&
                breadcrumbs.map((breadcrumb) => (
                    <BreadcrumbItem
                        key={breadcrumb.href}
                        isCurrent={breadcrumb.isCurrent}
                        href={breadcrumb.href || '/'}
                    >
                        {breadcrumb.label}
                    </BreadcrumbItem>
                ))}
        </Breadcrumb>
    )
}

export default Breadcrumbs
