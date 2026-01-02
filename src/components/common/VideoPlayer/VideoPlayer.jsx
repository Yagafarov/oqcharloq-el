import { FiPlay } from 'react-icons/fi';
import './VideoPlayer.css';

const VideoPlayer = ({ videoUrl, title }) => {
  if (!videoUrl) return null;

  // Extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(videoUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : videoUrl;

  return (
    <div className="video-player">
      <div className="video-header">
        <FiPlay />
        <span>Video dars</span>
      </div>
      <div className="video-container">
        <iframe
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="video-iframe"
        ></iframe>
      </div>
    </div>
  );
};

export default VideoPlayer;
