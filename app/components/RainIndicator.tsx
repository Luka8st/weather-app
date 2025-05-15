import React from 'react'
import { Droplet, CloudDrizzle, CloudRain, CloudLightning } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type RainIndicatorProps = {
  rainAmount: number
}

const RainIndicator = ({ rainAmount }: RainIndicatorProps) => {
  let icon: React.ReactNode
  let tooltipText: string

  if (rainAmount < 0.1) {
    icon = <Droplet className="text-slate-500" />
    tooltipText = 'No rain'
  } else if (rainAmount < 1) {
    icon = <Droplet className="text-sky-600" />
    tooltipText = 'Light drizzle'
  } else if (rainAmount < 5) {
    icon = <CloudDrizzle className="text-blue-500" />
    tooltipText = 'Light rain'
  } else if (rainAmount < 20) {
    icon = <CloudRain className="text-blue-700" />
    tooltipText = 'Moderate rain'
  } else {
    icon = <CloudLightning className="text-indigo-700" />
    tooltipText = 'Heavy rain'
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{icon}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default RainIndicator