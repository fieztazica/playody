import { UseDisclosureReturn, useDisclosure } from '@chakra-ui/react'
import { useCallback, useEffect } from 'react'

type UseIndicatorOption = {
    indicator: UseDisclosureReturn
}

function useIndicator(state?: boolean, option?: UseIndicatorOption) {
    const ready = useDisclosure()
    const indicator = option?.indicator || ready
    const startIndicator = useCallback(() => {
        indicator.onOpen()
    }, [indicator])

    const stopIndicator = useCallback(() => {
        indicator.onClose()
    }, [indicator])

    useEffect(() => {
        if (state === undefined) return
        !state ? stopIndicator() : startIndicator()
    }, [startIndicator, state, stopIndicator])

    return { indicator, startIndicator, stopIndicator }
}

export default useIndicator
