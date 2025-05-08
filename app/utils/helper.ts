export function capitalizeString(string: string): string {
    return string
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

export function getDayOfWeek(date: string) {
    const dayOfWeek = new Date(date).getDay();    
    return isNaN(dayOfWeek) ? null : 
      ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
  }

  export function formatDateString(date: string): string {
    if (!date) return '';
    
    const s = date.split('-');
    return `${s[2]}.${s[1]}.${s[0]}`;
  }