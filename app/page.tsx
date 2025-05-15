'use client'
import { useCallback, useEffect, useMemo, useState } from "react";
import DayCard from "./components/DayCard";
import SearchBar from "./components/SearchBar";
import { DailyForecast, Forecast, HourlyForecast } from "@/types/weather";
import { Geolocation } from "@/types/geolocation";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { City } from "@/types/city";
import { groupHourlyDataByDay } from "./utils/helper";

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

  const [city, setCity] = useState<City>({ name: 'Rijeka', country: 'Croatia' });
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({})

  const updateCity = (newCity: City) => {
    if (city.name !== newCity.name || city.country !== newCity.country) {
      setCity(newCity);
    }
  };

  const getForecast = useCallback(async (city: City) => {
    const geolocation = await fetchCoordinates(`${city.name},${city.country}`);
    if (!geolocation) return;

    const forecast = await fetchForecast(geolocation);
    if (forecast) {
      setDailyForecast(forecast.daily);
      setHourlyForecast(forecast.hourly);
    }
  }, []);

  async function fetchCoordinates(city: string): Promise<Geolocation | null> {
    const res = await fetch(`/api/geolocation?city=${encodeURIComponent(city)}`); // TODO create a type for this response
    if (res.status === 404) {
      toast.error('City not found', {
        style: {
          color: '#ff0000',
        }
      });
      return null;
    }
    if (res.status !== 200) {
      toast.error('Something went wrong', {
        style: {
          color: '#ff0000',
        }
      });
      return null;
    }

    return res.json();
  }

  async function fetchForecast(geolocation: Geolocation): Promise<Forecast | null> {
    const res = await fetch(`/api/forecast?latitude=${geolocation.lat}&longitude=${geolocation.lng}`);
    if (res.status === 404) {
      toast.error('Forecast not found', {
        style: {
          color: '#ff0000',
        }
      });
      return null;
    }
    if (res.status !== 200) {
      toast.error('Something went wrong', {
        style: {
          color: '#ff0000',
        }
      });
      return null;
    }
    const data = await res.json();
    return data as Forecast;
  }

  const handleSearch = async (query: string) => {
    const cityName = query.split(',')[0].trim();
    const country = query.split(',')[1]?.trim();
    const geolocation = await fetchCoordinates(query);

    if (geolocation != null) {
      const formattedCity = {
        name: cityName,
        country: country,
      };
      updateCity(formattedCity);
      setExpandedDays({}) 
      await getForecast(formattedCity);
    }
  }

  const groupedHourlyData = useMemo(() => {
    return groupHourlyDataByDay(hourlyForecast);
  }, [hourlyForecast]);


  useEffect(() => {
    getForecast(city);
  }, [city, getForecast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 [background:linear-gradient(to_bottom_right,_#a1c4fd,_#c2e9fb)]">
      <SearchBar
        onSearch={handleSearch}
      />

      <Toaster />

      <div className="flex flex-col items-center justify-center mt-4">
        <h1 className="text-5xl font-extrabold font-serif tracking-tight text-indigo-600 my-8">Forecast for {city.name}, {city.country}</h1>
        <div className="flex flex-col justify-center items-center mt-4">
          {dailyForecast.dates.map((date, index) => (
            <DayCard
              key={index}
              index={index}
              daily={dailyForecast}
              hourly={groupedHourlyData[date]}
              isExpanded={!!expandedDays[date]}
              onToggle={() =>
                setExpandedDays(prev => ({
                  ...prev,
                  [date]: !prev[date],
                }))
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}