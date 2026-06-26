/* eslint-disable react-hooks/purity */
import { useMemo } from "react";
const WeatherEffect = ({ theme }) => {
  const elements = useMemo(() => {
    const count = theme === 'dark' ? 30 : 65;
    return Array.from({ length: count }).map((_, index) => {
      const left = Math.random() * 100;
      const delay = Math.random() * -15;
      const duration = theme === 'dark' 
        ? 6 + Math.random() * 10 
        : 0.7 + Math.random() * 0.8;
      const size = theme === 'dark'
        ? 3 + Math.random() * 6 
        : 1.5 + Math.random() * 1.5;
      const height = theme === 'light' ? 22 + Math.random() * 20 : size;
      const opacity = theme === 'dark'
        ? 0.15 + Math.random() * 0.4
        : 0.45 + Math.random() * 0.4;
      
      return {
        id: index,
        left: `${left}%`,
        delay: `${delay}s`,
        duration: `${duration}s`,
        size: `${size}px`,
        height: `${height}px`,
        opacity
      };
    });
  }, [theme]);

  if (theme === 'dark') {
    return (
      <div className="weather-overlay" aria-hidden="true">
        {elements.map(el => (
          <span
            key={el.id}
            className="snowflake"
            style={{
              left: el.left,
              animationDelay: el.delay,
              animationDuration: el.duration,
              width: el.size,
              height: el.size,
              opacity: el.opacity
            }}
          />
        ))}
      </div>
    );
  } else {
    return (
      <div className="weather-overlay" aria-hidden="true">
        {elements.map(el => (
          <span
            key={el.id}
            className="raindrop"
            style={{
              left: el.left,
              animationDelay: el.delay,
              animationDuration: el.duration,
              width: el.size,
              height: el.height,
              opacity: el.opacity
            }}
          />
        ))}
      </div>
    );
  }
};

export default WeatherEffect;