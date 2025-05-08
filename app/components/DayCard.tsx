import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DailyForecast } from '@/types/weather';
import React, { useState } from 'react'
import { formatDateString, getDayOfWeek } from '../utils/helper';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import HourCard from './HourCard';
import { Scroll } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

type DailyData = {
  date: string;
  temp_max: number;
  temp_min: number;
  rain: number;
  wind: number;
};

type HourlyData = {
  time: string[];
  temp: number[];
  rain: number[];
  wind: number[];
};

type Props = {
  daily: DailyData;
  hourly: HourlyData;
};

const DayCard = ({ daily, hourly }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCheckboxChange = () => {
    setIsExpanded(!isExpanded);
  };

  const extractHour = (time: string) => {
    const date = new Date(time);
    // return format(date, 'HH:mm');
    let hours = date.getHours();
    let normalizedHours = hours % 12 || 12;
    return hours >= 12 ? `${normalizedHours} PM` : `${normalizedHours} AM`;
  };

  return (
    <Card className={`${isExpanded ? 'w-288' : 'w-72'} m-4 transition-all duration-300 ease-in-out`}>
      <CardHeader className="flex flex-col items-center justify-center">
        <CardTitle>
          {getDayOfWeek(daily.date)} ({formatDateString(daily.date)})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row">
        <div className="w-72">
          Max temp: {daily.temp_max}°C
          <br />
          Min temp: {daily.temp_min}°C
          <br />
          Rain: {daily.rain} mm
          <br />
          Wind: {daily.wind} km/h
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
                {hourly.time.map((time, i) => (
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