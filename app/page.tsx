'use client'

import Image from "next/image";
import AudioRecorder from "./audioRecorder"
import AudioPlayer from "./audioPlayer"
import MatchBar from "./matchBar"
import React, { useState } from 'react'

const ACCEPT_CUTOFF = 0.8;

export default function Home() {
    const [similarity, setSimilarity] = useState(null);
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-4 row-start-2 items-center">
                <Image
                    className="dark:invert justify-center flex items-center"
                    src={similarity > ACCEPT_CUTOFF ? "/unlocked_lock.jpg" : "/locked_lock.jpg"}
                    alt={similarity > ACCEPT_CUTOFF ? "This page is unlocked!" : "This page is locked!"}
                    width={150}
                    height={1}
                    priority
                />
                <div className="flex flex-row text-lg text-center font-[family-name:var(--font-geist-mono)]">
                    <p>Sing 'ahh' at this pitch</p> {<AudioPlayer className/>} <p>to enter!</p>
                </div>

                <div className="flex items-center">
                    <AudioRecorder setSimilarity={setSimilarity}/>
                </div>
                <div className="flex items-center">
                    <MatchBar percent_match={similarity} accept_cutoff={ACCEPT_CUTOFF}/>
                </div>
            </main>
        </div>
    );
}
