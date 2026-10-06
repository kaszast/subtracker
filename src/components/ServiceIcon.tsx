'use client';

import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import Image from 'next/image';

interface ServiceIconProps {
  name?: string;
  domain?: string;
  className?: string;
  color?: string;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({ name, domain, className = 'w-10 h-10', color }) => {
  const [imageError, setImageError] = useState(false);
  
  const hasDomain = Boolean(domain);
  const showImage = hasDomain && !imageError;

  if (showImage && domain) {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden bg-white rounded-lg shadow-sm ${className}`}>
        <img
          src={`https://logo.clearbit.com/${domain}?size=128`}
          alt={name || domain}
          className="w-full h-full object-contain p-1"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Megkeressük az ikont a Lucide készletből név alapján
  const LucideIcon = (name && (Icons as any)[name]) || Icons.CreditCard;

  return (
    <div
      className={`inline-flex items-center justify-center rounded-lg p-2 shrink-0 ${className}`}
      style={color ? { backgroundColor: `${color}20`, color: color } : undefined}
    >
      <LucideIcon className="w-full h-full" />
    </div>
  );
};
