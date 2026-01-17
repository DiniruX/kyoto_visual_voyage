
interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

const VideoPlayer = ({ videoUrl, title }: VideoPlayerProps) => {
  if (!videoUrl) return null;

  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden shadow-md">
      <iframe
        src={videoUrl}
        title={`Video - ${title}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
