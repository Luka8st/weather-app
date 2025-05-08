'use client'
import { use, useEffect, useState } from "react";
import DayCard from "./components/DayCard";
import SearchBar from "./components/SearchBar";
import CityNotFoundAlert from "./components/CityNotFoundAlert";
import { DailyForecast, HourlyForecast } from "@/types/weather";
import { Geolocation } from "@/types/geolocation";
import { capitalizeString } from "./utils/helper";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function Home() {
  const [dailyForecast, setDailyForecast] = useState<DailyForecast>({
    dates: [],
    temp_max: [],
    temp_min: [],
    rain: [],
    wind: []
  } as DailyForecast);

  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast>({
    time: [],
    temp: [],
    rain: [],
    wind: []
  } as HourlyForecast);

  const [cityNotFound, setCityNotFound] = useState(false);
  const [city, setCity] = useState("Rijeka");

  useEffect(() => {
    getForecast(city);
  }, [city]);

  const getForecast = async (city: string) => {
    const geolocation = await fetchCoordinates(city);
    if (!geolocation) {
      return;
    }

    const forecast = await fetchForecast(geolocation);
    console.log("forecast", forecast);  

    if (!forecast.daily) {
      console.error('Daily forecast data is missing');
      return;
    }

    setDailyForecast(forecast.daily);
    setHourlyForecast(forecast.hourly);
  } 

  async function fetchCoordinates(city: string) {
    const res = await fetch(`/api/geolocation?city=${encodeURIComponent(city)}`);
    if (!res.ok) {
      console.error('City not found');
      toast.error('City not found', {
        style: {
          color: '#ff0000',
        }
      });
      setCityNotFound(true);
      return null;
    }

    setCityNotFound(false);
    return res.json();
  }

  async function fetchForecast(geolocation: Geolocation) {
    const res = await fetch(`/api/forecast?latitude=${geolocation.lat}&longitude=${geolocation.lng}`);
    if (!res.ok) throw new Error('Forecast not found');
    const data = await res.json();
    return data;
  }

  const groupHourlyDataByDay = () => {
    const groupedData: Record<string, any> = {};

    hourlyForecast.time.forEach((timestamp, index) => {
      const date = timestamp.split('T')[0]; // Extract the date (e.g., "2025-05-07")
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

  const groupedHourlyData = groupHourlyDataByDay();
  console.log('groupedHourlyData', groupedHourlyData);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <SearchBar
        onSearch={async (query) => {
          const formattedCity = capitalizeString(query); 
          const geolocation = await fetchCoordinates(query);

          if (geolocation != null) {
            setCity(formattedCity);
            await getForecast(formattedCity);
          }
        }
        }
      />
      
      {/*cityNotFound && <CityNotFoundAlert />*/}
      <Toaster />

      <div className="flex flex-col items-center justify-center mt-4">
        <h1>Forecast for {city}</h1>
        <div className="flex flex-col justify-center items-center mt-4">        
        {dailyForecast.dates.map((date, index) => (
        <DayCard
          key={index}
          daily={{
            date: dailyForecast.dates[index],
            temp_max: dailyForecast.temp_max[index],
            temp_min: dailyForecast.temp_min[index],
            rain: dailyForecast.rain[index],
            wind: dailyForecast.wind[index],
          }}
          hourly={groupedHourlyData[date]} // Pass grouped hourly data for the day
        />
      ))}
        </div>
      </div>
    </div>
  );
}