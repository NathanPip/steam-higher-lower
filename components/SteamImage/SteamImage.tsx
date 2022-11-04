import Image from 'next/image'
import styles from './steamImage.module.css'

function steamImageLoader({ src }: {src: string}) {
    return `https://cdn.akamai.steamstatic.com/steam/apps/${src}/header.jpg`
}

type steamImageProps = {
    appId: string;
    title: string;
}

export const SteamImage = (props: steamImageProps) => {
    return (
        <Image
            className={`${styles.steam__img} opacity-50
            blur-sm scale-90 z-0`}
            loader={steamImageLoader}
            src={props.appId}
            alt={`${props.title} game`}
            width="500"
            height="300"
        >
        </Image>
    )
}