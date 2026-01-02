import { FiShare2 } from 'react-icons/fi';
import Button from '../Button';
import './ShareButton.css';

const ShareButton = ({ title, url }) => {
  const handleShare = async () => {
    const shareData = {
      title: title,
      text: `${title} - Oqcharloq kutubxonasi`,
      url: url || window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Havola nusxalandi!');
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <Button
      variant="outline"
      icon={<FiShare2 />}
      onClick={handleShare}
      className="share-button"
    >
      Ulashish
    </Button>
  );
};

export default ShareButton;
