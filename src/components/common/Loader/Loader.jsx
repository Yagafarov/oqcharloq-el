import './Loader.css';

const Loader = ({
  size = 'medium',
  fullscreen = false,
  text = ''
}) => {
  if (fullscreen) {
    return (
      <div className="loader-fullscreen">
        <div className={`loader loader-${size}`}></div>
        {text && <p className="loader-text">{text}</p>}
      </div>
    );
  }

  return (
    <div className="loader-container">
      <div className={`loader loader-${size}`}></div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;
