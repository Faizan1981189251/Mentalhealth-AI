import React from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  name, 
  size = 'md', 
  className = '' 
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base'
  };
  
  const combinedClassName = `rounded-full flex items-center justify-center font-medium ${sizeClasses[size]} ${className}`;
  
  return src ? (
    <img 
      src={src} 
      alt={name}
      className={`${combinedClassName} object-cover`}
    />
  ) : (
    <div className={combinedClassName}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;