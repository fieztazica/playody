import { Icon, IconProps } from '@chakra-ui/react'

const LogoSvg = ({ ...props }: IconProps) => {
    return (<Icon viewBox='0 0 48 48' {...props}>
        <path fill='#ed3675' d='M20,24c-5.523,0-10,4.477-10,10s4.477,10,10,10s10-4.477,10-10S25.523,24,20,24z'></path>
        <linearGradient id='thMIbMD7~VnYoyixFJ5D6a_p6vT9rfwUGw6_gr1' x1='30' x2='41' y1='8' y2='8'
                        gradientUnits='userSpaceOnUse'>
            <stop offset='0' stopColor='#bd1949'></stop>
            <stop offset='.108' stopColor='#c31a4b'></stop>
            <stop offset='.38' stopColor='#ca1b4d'></stop>
            <stop
                offset='1' stopColor='#cc1b4e'></stop>
        </linearGradient>
        <path fill='url(#thMIbMD7~VnYoyixFJ5D6a_p6vT9rfwUGw6_gr1)'
              d='M39,12h-9V4h9c1.105,0,2,0.895,2,2v4C41,11.105,40.105,12,39,12z'></path>
        <path fill='#ed3675' d='M30,4h-2c-2.209,0-4,1.791-4,4v26h6V4z'></path>
    </Icon>)
}

export default LogoSvg