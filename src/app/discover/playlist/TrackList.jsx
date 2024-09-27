import { useEffect, useRef, useState } from 'react';

import TrackTile from './TrackTile';

const TrackList = ({ tracks }) => {
  const [audioSrc, setAudioSrc] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioSrc) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [audioSrc]);

  return (
    <div className="">
      <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tracks?.map((track) => (
          <TrackTile
            key={track.id}
            singleTrack={true}
            audioRef={audioRef}
            setAudioSrc={setAudioSrc}
            audioSrc={audioSrc}
            {...track}
          />
        ))}
      </div>
      <audio ref={audioRef} src={audioSrc} />
    </div>
  );
};

export default TrackList;
