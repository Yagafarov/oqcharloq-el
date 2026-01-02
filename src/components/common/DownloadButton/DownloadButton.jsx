import { FiDownload } from 'react-icons/fi';
import Button from '../Button';
import './DownloadButton.css';

const DownloadButton = ({ downloads, bookTitle }) => {
  if (!downloads || Object.keys(downloads).length === 0) {
    return null;
  }

  const handleDownload = (url, format) => {
    // Mock download - real implementation would download the file
    const link = document.createElement('a');
    link.href = url;
    link.download = `${bookTitle}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show notification
    alert(`${format.toUpperCase()} fayl yuklanmoqda...`);
  };

  return (
    <div className="download-button">
      <div className="download-header">
        <FiDownload />
        <span>Yuklab olish</span>
      </div>
      <div className="download-options">
        {downloads.pdf && (
          <Button
            variant="outline"
            size="small"
            onClick={() => handleDownload(downloads.pdf, 'pdf')}
          >
            PDF
          </Button>
        )}
        {downloads.epub && (
          <Button
            variant="outline"
            size="small"
            onClick={() => handleDownload(downloads.epub, 'epub')}
          >
            EPUB
          </Button>
        )}
        {downloads.docx && (
          <Button
            variant="outline"
            size="small"
            onClick={() => handleDownload(downloads.docx, 'docx')}
          >
            DOCX
          </Button>
        )}
      </div>
    </div>
  );
};

export default DownloadButton;
