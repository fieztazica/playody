import { Children, ReactNode } from 'react'
import { Fragment } from 'react'

const Breadcrumb = ({ children }: { children?: ReactNode }) => {
    const childrenArray = Children.toArray(children)

    const childrenWtihSeperator = childrenArray.map((child, index) => {
        if (index !== childrenArray.length - 1) {
            return (
                <Fragment key={index}>
                    {child}
                    <span>/</span>
                </Fragment>
            )
        }
        return child
    })

    return (
        <nav className='tw-w-full' aria-label='breadcrumb'>
            <ol className='tw-flex tw-items-center tw-space-x-4 tw-w-full'>{childrenWtihSeperator}</ol>
        </nav>
    )
}

export default Breadcrumb
