import { useState, useEffect } from "react";

import "./Footer.css";

function Footer() {
  const worlds = ["🌍", "🌏", "🌎"];

  const [worldIndex, setWorldIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWorldIndex((prevState) => {
        return prevState === (worlds.length - 1) ? 0 : prevState + 1
      });
    }, 1000);

    return () => clearInterval(timer);
  });

  return (
    <footer className="mt-4">
      <p>
        Made by <a href="http://tomer.shvueli.com?ref=hourlyping" target="_blank" rel="noopener noreferrer">Tomer</a> from all around the <a href="http://wherethehellaretomerandmichelle.com?ref=hourlyping" target="_blank" rel="noopener noreferrer"><span role="img" aria-label="World">{worlds[worldIndex]}</span></a>
      </p>
    </footer>
  );
}

export default Footer;
