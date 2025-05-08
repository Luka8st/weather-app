import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react';
import React, { useState } from 'react'

type Props = {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: Props) => {
    const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full max-w-md">
      <Input
        type="text"
        placeholder="Search for a city..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button type="submit">
        <Search className="h-4 w-4 text-gray-500" />
      </Button>
    </form>
  )
}

export default SearchBar