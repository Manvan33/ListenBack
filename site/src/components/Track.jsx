

export default function Track({ artist: string, title: string }) {
    const track_json = fetch("http:")
    return (
        <div className="track">
            <div className="track__title">{title}</div>
            <div className="track__artist">{artist}</div>
        </div>
    );
}