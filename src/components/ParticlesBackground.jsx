import { useEffect, useRef } from 'react';

const COLORS = ['#f59e0b', '#fbbf24', '#60a5fa', '#ffffff'];
const PARTICLE_COUNT = 70;

// Анимирана позадина со точки на canvas.
// useRef ни дава пристап до вистинскиот <canvas> елемент, а useEffect ја
// стартува анимацијата откако елементот е во страницата.
function ParticlesBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId = null;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticles() {
      particles = [];

      for (let i = 0; i < PARTICLE_COUNT; i += 1) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speedX: (Math.random() - 0.5) * 0.25,
          speedY: (Math.random() - 0.5) * 0.25,
          size: Math.random() * 2 + 1,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          alpha: Math.random() * 0.5 + 0.2,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Кога точката излезе од екранот, се враќа од спротивната страна
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', resize);

    // Чистење кога компонентата се отстранува, за да не остане анимација
    // што троши ресурси во позадина
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas className="particles" ref={canvasRef} aria-hidden="true" />;
}

export default ParticlesBackground;
