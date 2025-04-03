import { useState } from 'react'; 

export const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);

  const increment = (value = 1) => setCount(count + value);
  
  const decrement = () => {
    if (count === 0) return;
    setCount(count - 1);
  }
  
  const reset = () => setCount(initialValue);

  return { count, increment, reset, decrement };
}