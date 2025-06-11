import type React from 'react';
import { PenTool } from 'lucide-react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex items-center gap-2 text-2xl font-headline font-semibold ${className}`}>
      <PenTool className="h-7 w-7 text-accent" />
      <span>AI Scribe</span>
    </div>
  );
};

export default Logo;
