// @flow
import * as React from 'react'

type Props = {
    children: React.ReactNode
    [key: string]: any
};

export default function UnderlineTypo(props: Props) {
    return (
        <p className={"tw-text-lg tw-w-full tw-font-bold after:tw-block after:tw-h-2 after:tw-w-full after:tw-bg-white/40 after:tw-rounded-full tw-my-2"}>
            {props.children}
        </p>
    )
}