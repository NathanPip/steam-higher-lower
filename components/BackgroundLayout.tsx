import Head from "next/head";
import React, { FC, useEffect, useRef, useState } from "react";

type Props = {
    children: React.ReactNode;
}

const BackgroundLayout: FC<Props> = ({children}) => {

    const bg = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(!bg.current) return;
        bg.current.style.opacity = ".5";
        window.addEventListener("mousemove", (e) => {
            if(!bg.current) return;
            let amt = (window.innerHeight - (e.clientY + 300) * .5) / window.innerHeight;
            if(amt > 1 || amt < 0) {
                amt = Math.round(amt);
            }
            bg.current.style.opacity = amt.toString();
        })
    }, [])

    return (
        <div className="h-screen">
        <Head>
            <title>Steam Higher Lower</title>
            <meta name="description" content="Do you know what people are playing?" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div ref={bg} className="fixed -z-10 bg-top-gradient w-full h-full"></div>
        <div className="fixed -z-20 bg-bottom-gradient w-full h-full"></div>
        {children}
      </div>
    )
}

export default BackgroundLayout;