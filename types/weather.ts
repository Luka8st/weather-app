export interface DailyForecast {
    dates: string[];
    temp_max: number[];
    temp_min: number[];
    rain: number[];
    wind: number[];
  }

export interface HourlyForecast {
    time: string[];
    temp: number[];
    rain: number[];
    wind: number[];
  }