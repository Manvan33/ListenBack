import { useEffect, useState } from "react";

type TrackProps = {
  artist: string;
  title: string;
};

export default function Track({ artist, title }: TrackProps) {
  const [trackJson, setTrackJson] = useState({});

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/track?name=${title}&artist=${artist}`)
      .then((response) => response.json())
      .then((data) => {
        setTrackJson(data);
      });
  }, [artist, title]);

  return (
    <div className="track">
      <div className="track__title">{title}</div>
      <div className="track__artist">{artist}</div>
      <p>{Object.keys(trackJson)[0]}</p>
    </div>
  );
}
