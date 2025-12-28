import { useEffect, useState } from "react";

export default function Timer({ seconds }) {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-right text-sm text-gray-600">
      Time Left: <span className="font-bold">{time}s</span>
    </div>
  );
}
