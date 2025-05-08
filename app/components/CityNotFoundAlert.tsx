import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import React from 'react'

const CityNotFoundAlert = () => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Not found</AlertTitle>
      <AlertDescription>
        The city you searched for was not found. Please try again with a different name.
      </AlertDescription>
    </Alert>
  )
}

export default CityNotFoundAlert
