
import { useEffect, useState } from "react";
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';

type TrackProps = {
    artist: string;
    title: string;
}


export const getServerSideProps = (async () => {
    // Fetch data from external API
    const res = await fetch('https://api.github.com/repos/vercel/next.js')
    const track: TrackProps = await res.json()
    // Pass data to the page via props
    return { props: { track } }
  }) satisfies GetServerSideProps<{ track: TrackProps }>

export default function Track({ track }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const [trackJson, setTrackJson] = useState({});
    
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/track?name=${title}&artist=${artist}`)
        .then(response => response.json())
        .then(data => {
            setTrackJson(data);
        });}, []);

    return (
        <div className="track">
            <div className="track__title">{title}</div>
            <div className="track__artist">{artist}</div>
            <p>{Object.keys(trackJson)[0]}</p>
        </div>
    );
}

 
 
 
export default function Page({
  repo,
}: 
  return (
    <main>
      <p>{repo.stargazers_count}</p>
    </main>
  )
}