import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'
import type { StyleFunctionProps } from '@chakra-ui/styled-system'

const theme = extendTheme({
    styles: {
        global: (props: StyleFunctionProps) => ({
            body: {
                fontFamily: 'body',
                color: mode('gray.800', 'whiteAlpha.900')(props),
                bg: mode('white', 'black')(props),
                bgGradient: 'linear(to-b, blue.900, purple.900, pink.900)',
                height: 'full',
                lineHeight: 'base',
            },
        }),
    },
})

export { theme }
