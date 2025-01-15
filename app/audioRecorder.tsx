import React, { useState, useEffect } from 'react';
import { useReactMediaRecorder } from "react-audio-voice-recorder";

const AudioRecorder = () => {
  const [audioUrl, setAudioUrl] = useState(null);
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true });

  useEffect(() => {
    if (mediaBlobUrl) {
      setAudioUrl(mediaBlobUrl);
    }
  }, [mediaBlobUrl]);

  return (
    <div>
      <button onClick={startRecording} disabled={status === 'recording'}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={status !== 'recording'}>
        Stop Recording
      </button>
      {audioUrl && (
        <audio src={audioUrl} controls />
      )}
    </div>
  );
};

export default AudioRecorder;
