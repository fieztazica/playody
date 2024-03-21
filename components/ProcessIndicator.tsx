import { useAppStates } from '@/lib/contexts/AppContext'
import { Progress } from '@chakra-ui/react'
import React from 'react'

function ProcessIndicator() {
    const { indicator } = useAppStates()
    return (
        <Progress
            display={indicator.isOpen ? 'flex' : 'none'}
            bgColor={'transparent'}
            height="2px"
            flex={1}
            position="fixed"
            zIndex={'99'}
            isIndeterminate
            w="100%"
        />
    )
}

export default ProcessIndicator
