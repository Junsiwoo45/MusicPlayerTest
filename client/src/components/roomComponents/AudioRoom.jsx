import { useRef, useState, useEffect } from "react";
import MusicList from "./MusicList";
import RoomControl from "./RoomControls";

const AudioRoom = (props) => 
{
  const audioRef = useRef(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [roomControls, setRoomControls] = useState(null);

  const handlePlayPauseBtn = () => 
  {
    props.onUpdateAudioData([audioRef.current.currentTime]);
    setButtonDisabled(true);
    setTimeout(() => {setButtonDisabled(false)}, 200);  
  };

  useEffect(()=>{setRoomControls(props.roomControls)},[props.roomControls]);

  useEffect(() => {
  // Check if props.trackPosition is a finite number
  if (isFinite(props.trackPosition)) {
    audioRef.current.currentTime = props.trackPosition;
  }

  const handlePlay = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play();
    }
  };

  const handlePause = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  };

  if (props.isTrackPlaying) {
    handlePlay();
  } else {
    handlePause();
  }

  // Set up event listeners
  if (audioRef.current) {
    audioRef.current.addEventListener('play', handlePlay);
    audioRef.current.addEventListener('pause', handlePause);
  }

  // Clean up event listeners
  return () => 
  {
    // Check if audioRef.current is not null before removing listeners
    if (audioRef.current) {
      audioRef.current.removeEventListener('play', handlePlay);
      audioRef.current.removeEventListener('pause', handlePause);
    }
  };

},[props]);


   return (
    <div>
      <h2>Audio Room {props.roomNumber}</h2>
      <RoomControl {...roomControls} isHost={props.isHost} onUpdateControls={(newControls)=>{props.onUpdateAudioData([audioRef.current.currentTime, newControls])}}/>
      <audio ref={audioRef}>
        <source src="Passionfruit.mp3" type="audio/mpeg" />
      </audio>
      <button onClick={handlePlayPauseBtn} disabled={buttonDisabled}>{props.isTrackPlaying ? 'Pause' : 'Play'}</button>
      <br/>
      <br/>
      <button onClick={()=>{props.onLeaveRoom()}}>Leave Room</button>
      <MusicList/>
    </div>
  );
}
export default AudioRoom;


