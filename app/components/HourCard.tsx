import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React from 'react'
import { Thermometer, CloudRain, Wind } from 'lucide-react'

type Props = {
    hour: string;
    temp: number;
    rain: number;
    wind: number;
};


const HourCard = ({ hour, temp, rain, wind }: Props) => {
  return (
    <Card className="w-60 p-2 flex flex-col items-center justify-center transition-all duration-700 ease-in-out transform hover:scale-105">
        <CardHeader className="w-36 items-center justify-center">
        	{hour}
        </CardHeader>
        <CardContent>
            <div className="text-center">
                <p className='flex flex-row py-4 gap-x-2'><Thermometer/> {temp}°C</p>
                <p className='flex flex-row py-4 gap-x-2'><CloudRain/> {rain} mm</p>
                <p className='flex flex-row py-4 gap-x-2'><Wind/> {wind} km/h</p>
            </div>
        </CardContent>
    </Card>
  )
}

export default HourCard
