import { Button, Heading } from '@chakra-ui/react'
import Link from 'next/link'

function NotFound() {
    return (
        <main className="tw-grid tw-min-h-full tw-place-items-center tw-px-6 tw-py-24 tw-sm:py-32 tw-lg:px-8">
            <div className="tw-text-center">
                <Heading
                    as="h4"
                    fontSize={'2xl'}
                    className="tw-text-base tw-font-semibold tw-text-indigo-600"
                >
                    404
                </Heading>
                <Heading
                    as="h1"
                    className="tw-mt-4 tw-text-3xl tw-font-bold tw-tracking-tight tw-sm:text-5xl"
                >
                    Page not found
                </Heading>
                <p className="tw-mt-6 tw-text-base tw-leading-7 tw-text-gray-400">
                    Sorry, we couldn’t find the page you’re looking for.
                </p>
                <div className="tw-mt-10 tw-flex tw-items-center tw-justify-center tw-gap-x-6">
                    <Button as={Link} href="/" colorScheme="teal">
                        Go back home
                    </Button>
                    <Button as={Link} href="https://owlvernyte.tk/to">
                        Contact support <span aria-hidden="true">&rarr;</span>
                    </Button>
                </div>
            </div>
        </main>
    )
}

NotFound.title = "Not Found"

export default NotFound
