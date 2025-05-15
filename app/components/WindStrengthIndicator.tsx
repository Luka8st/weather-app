import React from 'react';
import { Wind } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

type WindStrengthIndicatorProps = {
  windSpeed: number;
};

const WindStrengthIndicator = ({ windSpeed }: WindStrengthIndicatorProps) => {
  let iconClassName = '';
  let tooltipText = '';

  if (windSpeed <= 5) { // Calm
    iconClassName = 'text-slate-500';
    tooltipText = 'Calm';
  } else if (windSpeed <= 20) { // Light Breeze
    iconClassName = 'text-sky-600';
    tooltipText = 'Light breeze';
  } else if (windSpeed <= 40) { // Moderate Breeze
    iconClassName = 'text-green-600';
    tooltipText = 'Moderate breeze';
  } else if (windSpeed <= 60) { // Strong Breeze
    iconClassName = 'text-orange-600';
    tooltipText = 'Strong breeze';
  } else { // Very Strong
    iconClassName = 'text-red-600';
    tooltipText = 'Very strong';
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Wind className={iconClassName} />
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WindStrengthIndicator;