import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const waves = [
      { amplitude: 50, wavelength: 250, speed: 0.01, color: "rgba(59,130,246,0.3)" }, 
      { amplitude: 40, wavelength: 180, speed: 0.015, color: "rgba(96,165,250,0.35)" }, 
      { amplitude: 30, wavelength: 120, speed: 0.02, color: "rgba(147,197,253,0.3)" }, 
    ];

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 2; 
      
      waves.forEach((wave, index) => {
        ctx.beginPath();
        const yOffset = height * 0.45; 
        for (let x = 0; x <= width; x++) {
          const angle = x / wave.wavelength + time * wave.speed;
          const y = yOffset + Math.sin(angle) * wave.amplitude * (index === 0 ? 1 : 0.8);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.strokeStyle = wave.color;
        ctx.stroke();
      });
      
      time += 1;
      requestAnimationFrame(draw);
    };

    draw();
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-linear-to-br from-blue-50/50 to-white/50">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" />
    </div>
  );
}