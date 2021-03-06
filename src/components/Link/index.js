import React from 'react'
import NextLink from 'next/Link'

export default function Link({children, href, ...props}) {
    return(
        <NextLink href={href} passHref>
            <a>
                {children}
            </a>
        </NextLink>
    )
}