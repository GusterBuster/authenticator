'use client'

import React, { useState } from 'react'
import Image from "next/image"

function RecordIcon() {
  return (
    <Image
      className="dark:invert justify-center flex items-center"
      src="/play_button.png"
      alt="start"
      width={50}
      height={1}
      priority
    />
  );
}

function StopIcon() {
  return (
    <Image
      className="dark:invert justify-center flex items-center"
      src="/stop_button.png"
      alt="start"
      width={50}
      height={1}
      priority
    />
  );
}

export default function AudioRecorder() {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const sendRecording = async () => {
    if (!audioBlob) {
      alert('No audio to send!');
      return;
    }
    console.log('Blob size:', audioBlob.size); // This should be greater than 0
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    try {
      const response = await fetch('http://0.0.0.0:6900/process-audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.error('Server error:', response.status, response.statusText);
        return;
      }

      const result = await response.json();
      console.log('Server response:', result);
    } catch (error) {
      console.error('Error sending audio:', error);
    }
  };

  return (
    <div className = "flex flex-col items-center">
      <button onClick={isRecording ? stopRecording : startRecording}
        className = "mb-2">
        {isRecording ? <StopIcon /> : <RecordIcon />}
      </button>
      <button onClick={sendRecording} disabled={!audioBlob}
        className="border-2 border-solid border-green-500 px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-50"
        >
        Submit!
      </button>
    </div>
  );
}