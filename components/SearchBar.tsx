import { Box, Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import React from 'react'
import { RiSearchLine } from 'react-icons/ri'

type Props = {
    query: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    [key: string]: any
}

function SearchBar({ query, onChange, ...props }: Props) {
    return (
        <InputGroup>
            <InputLeftElement>
                <RiSearchLine />
            </InputLeftElement>
            <Input
                id={"search_bar"}
                key={"SearchBar"}
                type={'text'}
                name={'searchQuery'}
                value={query}
                w={{ base: 'full', md: 300 }}
                placeholder='Play a melody'
                onChange={onChange}
                {...props}
            />
        </InputGroup>
    )
}

export default SearchBar
