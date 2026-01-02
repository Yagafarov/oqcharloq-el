import './Card.css';

const Card = ({
  children,
  hover = false,
  padding = 'medium',
  className = '',
  onClick,
  ...props
}) => {
  const cardClass = [
    'card',
    hover && 'card-hover',
    `card-padding-${padding}`,
    onClick && 'card-clickable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClass} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;
