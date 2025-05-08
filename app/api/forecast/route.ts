import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('latitude');
  const lng = searchParams.get('longitude');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing latitude or longitude parameter' }, { status: 400 });
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,rain_sum,wind_speed_10m_max&hourly=temperature_2m,rain,wind_speed_10m&forecast_days=3`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();

    const daily = {
        dates: data.daily.time,
        temp_max: data.daily.temperature_2m_max,
        temp_min: data.daily.temperature_2m_min,
        rain: data.daily.rain_sum,
        wind: data.daily.wind_speed_10m_max,
    };

    const hourly = {
        time: data.hourly.time,
        temp: data.hourly.temperature_2m,
        rain: data.hourly.rain,
        wind: data.hourly.wind_speed_10m,
    };

    return NextResponse.json({ daily, hourly });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}