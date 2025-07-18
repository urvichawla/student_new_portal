import React, { useRef, useEffect, useState } from "react";

export function Squares({
  direction = "right",
  speed = 1,
  borderColor = "#333",
  squareSize = 40,
  hoverFillColor = "#222",
  className,
}) {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const numSquaresX = useRef();
  const numSquaresY = useRef();
  const gridOffset = useRef({ x: 0, y: 0 });
  const [hoveredSquare, setHoveredSquare] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.style.background = "#060606";
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
      numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;
      ctx.lineWidth = 0.5;
      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize);
          const squareY = y - (gridOffset.current.y % squareSize);
          // Calculate if this square is hovered
          let isHovered = false;
          if (hoveredSquare) {
            const mouseX = hoveredSquare.mouseX;
            const mouseY = hoveredSquare.mouseY;
            if (
              mouseX >= squareX && mouseX < squareX + squareSize &&
              mouseY >= squareY && mouseY < squareY + squareSize
            ) {
              isHovered = true;
            }
          }
          if (isHovered) {
            console.log('Hovered square:', { squareX, squareY });
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
            // Draw a red border for debug
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(squareX, squareY, squareSize, squareSize);
            ctx.lineWidth = 0.5;
          }
          ctx.strokeStyle = borderColor;
          ctx.strokeRect(squareX, squareY, squareSize, squareSize);
        }
      }
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2)) / 2
      );
      gradient.addColorStop(0, "rgba(6, 6, 6, 0)");
      gradient.addColorStop(1, "#060606");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1);
      switch (direction) {
        case "right":
          gridOffset.current.x =
            (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          break;
        case "left":
          gridOffset.current.x =
            (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
          break;
        case "up":
          gridOffset.current.y =
            (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
          break;
        case "down":
          gridOffset.current.y =
            (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        case "diagonal":
          gridOffset.current.x =
            (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          gridOffset.current.y =
            (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        default:
          break;
      }
      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      console.log('Mouse move:', { mouseX, mouseY });
      setHoveredSquare({ mouseX, mouseY });
    };
    const handleMouseLeave = () => {
      setHoveredSquare(null);
    };
    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    resizeCanvas();
    requestRef.current = requestAnimationFrame(updateAnimation);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [direction, speed, borderColor, hoverFillColor, hoveredSquare, squareSize]);
  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full border-none block ${className || ''}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
} 