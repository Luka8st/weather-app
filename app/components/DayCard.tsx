import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DailyForecast } from '@/types/weather';
import React, { useState } from 'react'
import { extractHour, formatDateString, getDayOfWeek } from '../utils/helper';
import { Checkbox } from '@/components/ui/checkbox';
import HourCard from './HourCard';
import { Scroll, ThermometerSun, WindIcon, CloudRain, ThermometerSnowflake, LineChart } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

type DayCardProps = {
  index: number;
  daily: DailyForecast
  hourly: Record<string, any>;
};

const DayCard = ({ index, daily, hourly }: DayCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCheckboxChange = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Card className={`${isExpanded ? 'w-288' : 'w-72'} m-4 transition-all duration-300 ease-in-out border-4 border-gray-600 bg-white shadow-2xl rounded-lg`}>
      <CardHeader className="flex flex-col items-center justify-center">
        <CardTitle>
          {getDayOfWeek(daily.dates[index])} ({formatDateString(daily.dates[index])})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row bg-blue-400/60 rounded-lg p-4">
        <div className="w-72 py-2">
          <p className='flex flex-row items-center gap-x-2'><ThermometerSun size={28} /> Max temp: {daily.temp_max[index]}°C</p>
          <br />
          <p className='flex flex-row items-center gap-x-2'><ThermometerSnowflake size={28} /> Min temp: {daily.temp_min[index]}°C</p>
          <br />
          <p className='flex flex-row items-center gap-x-2'><CloudRain size={28} /> Rain: {daily.rain[index]} mm</p>
          <br />
          <p className='flex flex-row items-center gap-x-2'><WindIcon size={28} /> Wind: {daily.wind[index]} km/h</p>
        </div>
        <div
          className={`transition-all duration-300 ease-in-out h-80 ${
            isExpanded ? 'w-[80%]' : 'w-0'
          } overflow-hidden`}
        >      
          {isExpanded && (
            <ScrollArea
              type="always"
              className="w-full h-80 py-2 overflow-x-auto"
              scrollHideDelay={1000}
            >
              <div className="flex flex-row flex-nowrap justify-start">
                {hourly.time.map((time: string, i: number) => (
                  <div
                    key={i}
                    className="mx-2 opacity-0 translate-y-4 transition-all duration-300 ease-in-out"
                    style={{
                      opacity: isExpanded ? 1 : 0,
                      transform: isExpanded
                        ? 'translateY(0)'
                        : 'translateY(10px)',
                    }}
                  >
                    <HourCard
                      hour={extractHour(time)}
                      temp={hourly.temp[i]}
                      rain={hourly.rain[i]}
                      wind={hourly.wind[i]}
                    />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="w-full" />
            </ScrollArea>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Checkbox
          id="byHour"
          checked={isExpanded}
          onClick={handleCheckboxChange}
        />
        <label htmlFor="byHour" className="text-sm cursor-pointer px-2">
          Show by hour
        </label>
      </CardFooter>
    </Card>
  );
};

export default DayCard;