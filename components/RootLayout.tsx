import React from 'react'
import ProcessIndicator from './ProcessIndicator'

function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ProcessIndicator />
            {children}
        </>
    )
}

export default RootLayout
