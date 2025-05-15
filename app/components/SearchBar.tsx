import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import countryMap from '../data/countries.json' assert { type: 'json' };
import { City } from '@/types/city';

const typedCountryMap = countryMap as Record<string, string>;

type Props = {
  onSearch: (query: string) => void;
};

const SearchBar = ({ onSearch }: Props) => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const valueChangedBySuggestionClick = useRef(false); 

  const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_API_KEY;

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (valueChangedBySuggestionClick.current) {
        valueChangedBySuggestionClick.current = false; 
        return;
      }

      if (!value.trim()) {
        setSuggestions([]);
        setShowSuggestions(false); 
        return;
      }

      const [city, country] = value.split(',').map((part) => part.trim().toLowerCase());

      const url = new URL('https://wft-geo-db.p.rapidapi.com/v1/geo/cities');
      url.searchParams.set('namePrefix', city);
      url.searchParams.set('limit', '5');

      // Match partial country name to countryMap key
      if (country) {
        const matchedCountries = Object.keys(typedCountryMap).filter((key) =>
          key.toLowerCase().startsWith(country) 
        );
        
        if (matchedCountries.length > 0) {
          const countryIds = matchedCountries.map((key) => typedCountryMap[key]).join(',');
          url.searchParams.set('countryIds', countryIds); 
        } else {
          setSuggestions([]);
          setShowSuggestions(false); 
          return;
        }
      }

      try {
        const response = await fetch(url.toString(), {
          headers: {
            'X-RapidAPI-Key': apiKey || '',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch city suggestions, status:', response.status);
          setSuggestions([]);
          setShowSuggestions(false);
          return;
        }

        const data = await response.json();
        const cities = data.data && Array.isArray(data.data) ? data.data.map((cityItem: any) => ({ 
          name: cityItem.name,
          country: cityItem.country,
        })) as City[] : [];

        if (cities.length > 0) {
          setSuggestions(cities);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error('Failed to fetch city suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 1000);
    return () => clearTimeout(debounce);
  }, [value, apiKey]); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (city: City) => {
    const cityQuery = `${city.name}, ${city.country}`;
    valueChangedBySuggestionClick.current = true; 
    setValue(cityQuery);
    setSuggestions([]); 
    setShowSuggestions(false); 
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Search for a city (e.g., Rijeka, Croatia)..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (!e.target.value.trim()) {
              setShowSuggestions(false); 
            }
          }}
          onFocus={() => {
            if (value.trim() && suggestions.length > 0) {
              setShowSuggestions(true);
            } 
          }}
          onBlur={() => {
            setTimeout(() => {
              setShowSuggestions(false);
            }, 150);
          }}
          className="bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
        />
        <Button type="submit">
          <Search className="h-4 w-4 text-gray-500" />
        </Button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border mt-1 w-full rounded shadow-lg overflow-y-auto">
          {suggestions.map((city, index) => (
            <li
              key={index}
              onMouseDown={() => handleSuggestionClick(city)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {city.name}, {city.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;