import { Geolocation } from '@/types/geolocation';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');

  const apiKey = process.env.OPENCAGE_API_KEY;
  
  if (!city) {
    return NextResponse.json({ error: 'City parameter is required' }, { status: 400 });
  }
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.results.length === 0) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    const geolocation: Geolocation = data.results[0].geometry;

    return NextResponse.json(geolocation);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
