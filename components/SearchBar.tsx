import { Box, Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import React from 'react'
import { RiSearchLine } from 'react-icons/ri'

type Props = {
    query: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string
    [key: string]: any
}

function SearchBar({ query, onChange, placeholder = 'Play a melody', ...props }: Props) {
    return (
        <InputGroup>
            <InputLeftElement>
                <RiSearchLine />
            </InputLeftElement>
            <Input
                type={'text'}
                value={query}
                w={{ base: 'full' }}
                placeholder={placeholder}
                onChange={onChange}
                {...props}
            />
        </InputGroup>
    )
}

export default SearchBar
