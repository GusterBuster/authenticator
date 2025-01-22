'use client'

import React, { useState } from 'react'
import Image from "next/image"

function PlayIcon() {
  return (
    <Image
      className="dark:invert justify-center flex items-center"
      src="/music_note.png"
      alt="play"
      width={18}
      height={1}
      priority
    />
  );
}

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  async function startPlaying() {
    const audio = new Audio('/A3_piano.mp3')
    audio.play();
  }

  return (
    <div className = "flex items-center">
      <button onClick={startPlaying}
        className = "mb-2 mx-2">
        <PlayIcon />
      </button>
    </div>
  );
}