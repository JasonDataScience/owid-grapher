import React, { useState } from "react"

import Lightbox from "react-image-lightbox"
// import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

export default function Image({ d, styles }: any) {
    const [isOpen, setIsOpen] = useState(false)

    if (isOpen) {
        return (
            <Lightbox
                mainSrc={d.value.src}
                onCloseRequest={() => setIsOpen(false)}
            />
        )
    }
    return <img src={d.value.src} onClick={() => setIsOpen(true)} />
}
