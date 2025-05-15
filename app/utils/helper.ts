import { HourlyForecast } from "@/types/weather";

export function capitalizeString(string: string): string {
    return string
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

export function getDayOfWeek(date: string) {
    const dayOfWeek = new Date(date).getDay();    
    return isNaN(dayOfWeek) ? null : 
      ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
  }

  export function formatDateString(date: string): string {
    if (!date) return '';
    
    const s = date.split('-');
    return `${s[2]}.${s[1]}.${s[0]}`;
  }

export const groupHourlyDataByDay = (hourlyForecast: HourlyForecast) => {
    const groupedData: Record<string, any> = {};

    hourlyForecast.time.forEach((timestamp, index) => {
      const date = timestamp.split('T')[0];
      if (!groupedData[date]) {
        groupedData[date] = {
          time: [],
          temp: [],
          rain: [],
          wind: [],
        };
      }
      groupedData[date].time.push(timestamp);
      groupedData[date].temp.push(hourlyForecast.temp[index]);
      groupedData[date].rain.push(hourlyForecast.rain[index]);
      groupedData[date].wind.push(hourlyForecast.wind[index]);
    });

    return groupedData;
  };

  export const extractHour = (time: string) => {
    const date = new Date(time);
    const hours = date.getHours();
    const normalizedHours = hours % 12 || 12;
    return hours >= 12 ? `${normalizedHours} PM` : `${normalizedHours} AM`;
  };