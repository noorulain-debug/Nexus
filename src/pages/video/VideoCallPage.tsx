import React, { useRef, useState, useEffect } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  PhoneCall,
} from "lucide-react";

const VideoCallPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [callTime, setCallTime] = useState(0);

  // timer like real meeting
  useEffect(() => {
    let interval: any;
    if (isCalling) {
      interval = setInterval(() => setCallTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isCalling]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  // START CALL (with connecting effect)
  const startCall = async () => {
    try {
      setConnecting(true);

      const media = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = media;
      }

      setStream(media);

      setTimeout(() => {
        setConnecting(false);
        setIsCalling(true);
      }, 1200);
    } catch (error) {
      console.error("Camera error:", error);
      setConnecting(false);
    }
  };

  // END CALL
  const endCall = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    setIsCalling(false);
    setCallTime(0);
  };

  const toggleMute = () => {
    if (!stream) return;

    stream.getAudioTracks().forEach((track) => {
      track.enabled = isMuted;
    });

    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    if (!stream) return;

    stream.getVideoTracks().forEach((track) => {
      track.enabled = isVideoOff;
    });

    setIsVideoOff(!isVideoOff);
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center relative">

      {/* TOP BAR */}
      {isCalling && (
        <div className="absolute top-4 text-white text-sm bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
          🔴 Live Call • {formatTime(callTime)}
        </div>
      )}

      {/* VIDEO BOX */}
      <div className="w-[75%] max-w-4xl h-[70vh] bg-black rounded-2xl overflow-hidden shadow-2xl relative">

        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* IDLE SCREEN */}
        {!isCalling && !connecting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <PhoneCall size={50} className="text-green-500 mb-4 animate-pulse" />
            <button
              onClick={startCall}
              className="flex items-center gap-3 bg-green-600 hover:bg-green-700 transition px-8 py-3 rounded-full text-white text-lg shadow-lg"
            >
              Start Video Call
            </button>
            <p className="text-gray-400 mt-3 text-sm">
              Click to start secure meeting
            </p>
          </div>
        )}

        {/* CONNECTING */}
        {connecting && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-white text-lg animate-pulse">
              Connecting...
            </div>
          </div>
        )}
      </div>

      {/* CONTROL BAR */}
      {isCalling && (
        <div className="absolute bottom-6 flex items-center gap-6 bg-white/10 px-6 py-3 rounded-full backdrop-blur-xl shadow-lg">

          <button onClick={toggleMute} className="text-white hover:scale-110 transition">
            {isMuted ? <MicOff /> : <Mic />}
          </button>

          <button onClick={toggleVideo} className="text-white hover:scale-110 transition">
            {isVideoOff ? <VideoOff /> : <Video />}
          </button>

          <button
            onClick={endCall}
            className="text-red-500 hover:scale-110 transition bg-red-500/10 p-2 rounded-full"
          >
            <PhoneOff />
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoCallPage;