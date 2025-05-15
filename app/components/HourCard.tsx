import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React from 'react'
import { Thermometer, CloudRain, Wind, CloudFog, CloudLightning, Feather } from 'lucide-react'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import WindStrengthIndicator from './WindStrengthIndicator';
import RainIndicator from './RainIndicator';

type Props = {
    hour: string;
    temp: number;
    rain: number;
    wind: number;
};

const getWindStrengthIcon = (windSpeed: number) => {
  let tooltipComponent;
  if (windSpeed <= 5) { // Calm
    tooltipComponent = 
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Wind className='text-slate-500'/>
        </TooltipTrigger>
        <TooltipContent>
          <p>Calm</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>;
  } else if (windSpeed <= 20) { // Light Breeze
    tooltipComponent = 
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Wind className='text-sky-600'/>
        </TooltipTrigger>
        <TooltipContent>
          <p>Light breeze</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>;
  } else if (windSpeed <= 40) { // Moderate Breeze
    tooltipComponent = 
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Wind className='text-green-600'/>
        </TooltipTrigger>
        <TooltipContent>
          <p>Moderate breeze</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>;
  } else if (windSpeed <= 60) { // Strong Breeze
    tooltipComponent = 
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Wind className='text-orange-600'/>
        </TooltipTrigger>
        <TooltipContent>
          <p>Strong breeze</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>;
  } else { // Very Strong
    tooltipComponent = 
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Wind className='text-red-600'/>
        </TooltipTrigger>
        <TooltipContent>
          <p>Very strong</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>;
  }
  return tooltipComponent;
};

const HourCard = ({ hour, temp, rain, wind }: Props) => {
  const windIconToShow = getWindStrengthIcon(wind);
  
  return (
    <Card className="w-60 p-2 flex flex-col items-center justify-center transition-all duration-700 ease-in-out transform hover:scale-105">
        <CardHeader className="w-36 items-center justify-center font-bold">
        	{hour}
        </CardHeader>
        <CardContent>
            <div className="text-center">
                <p className='flex flex-row py-4 gap-x-2'><Thermometer/> {temp}°C</p>
                <p className='flex flex-row py-4 gap-x-2'><RainIndicator rainAmount={rain}/> {rain} mm</p>
                <p className='flex flex-row py-4 gap-x-2'><WindStrengthIndicator windSpeed={wind}/> {wind} km/h</p>
            </div>
        </CardContent>
    </Card>
  )
}

export default HourCard
