import React, { useEffect, useMemo, useRef } from 'react';

/**
 * Represents a data point in the visualization
 */
interface DataPoint {
  x: number;
  y: number;
  opacity: number;
  fadeDirection: 'in' | 'out';
  fadeSpeed: number;
  size: number;
  type: 'campaign' | 'user' | 'business' | 'tracker' | 'connection';
  value: number; // Performance value or importance (0-100)
  id: string; // Unique identifier
  group?: string; // Optional grouping
  appearing: boolean; // Whether point is newly appearing
  age: number; // Time alive in frames
  lifespan: number; // How long point will live
}

/**
 * Props for the data-driven canvas background
 */
interface CanvasBackgroundProps {
  /** Optional CSS class for the canvas element */
  className?: string;
  /** Visualization mode - affects appearance and behavior */
  mode?: 'background' | 'foreground';
  /** Controls whether points emerge and disappear constantly */
  dynamic?: boolean;
  /** Controls data point density (higher = fewer points) */
  density?: number;
  /** Controls what type of insights to highlight */
  insightFocus?: 'campaigns' | 'engagement' | 'conversions' | 'all';
  /** Controls the base color scheme */
  theme?: 'standard' | 'performance' | 'growth';
}

/**
 * A dynamic, data-driven canvas visualization that transforms analytics
 * into an engaging visual layer. Represents entities as points that connect
 * based on relationships, with colors and animations reflecting performance metrics.
 * 
 * Serves as both an aesthetic background and functional data visualization.
 */
export const CanvasBackground: React.FC<CanvasBackgroundProps> = ({
  className,
  mode = 'background',
  dynamic = true,
  density = 15000,
  insightFocus = 'all',
  theme = 'standard'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsRef = useRef<DataPoint[]>([]);
  const animationRef = useRef<number>(0);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const lastPointAddedRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const maxPointsRef = useRef<number>(0);

  // Color schemes based on theme and design system
  const colorSchemes = useMemo(() => ({
    standard: {
      campaign: '#fd5304', // pumpkin-orange
      user: '#5a33ee', // iris-purple
      business: '#c0f03e', // lime-green
      tracker: '#1d1d1b', // black
      connection: '#fbf8f3', // white
      highValue: '#fd5304',
      lowValue: '#5a33ee'
    },
    performance: {
      campaign: '#fd5304',
      user: '#5a33ee',
      business: '#c0f03e',
      tracker: '#1d1d1b',
      connection: '#fbf8f3',
      highValue: '#c0f03e', // Success/high performance
      lowValue: '#fd5304'    // Needs attention
    },
    growth: {
      campaign: '#c0f03e',
      user: '#5a33ee',
      business: '#fd5304',
      tracker: '#1d1d1b',
      connection: '#fbf8f3',
      highValue: '#5a33ee', // Growth potential
      lowValue: '#c0f03e'   // Stable
    }
  }), []);

  const colors = colorSchemes[theme];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Create a data point with type-specific properties
    const createDataPoint = (
      x: number, 
      y: number, 
      type: 'campaign' | 'user' | 'business' | 'tracker' | 'connection' = 'connection'
    ): DataPoint => {
      const value = type === 'connection' ? 0 : Math.floor(Math.random() * 100);
      
      // Size based on type and value
      let size = 1;
      if (type === 'campaign') size = 1.5 + (value / 100) * 1.5;
      else if (type === 'business') size = 1.8 + (value / 100);
      else if (type === 'user') size = 1.2 + (value / 100) * 0.8;
      else if (type === 'tracker') size = 1.3 + (value / 100) * 0.7;
      
      // If foreground mode, make points larger
      if (mode === 'foreground') {
        size *= 1.5;
      }
      
      return {
        x,
        y,
        // Start with some opacity so points are immediately visible
        opacity: 0.3 + Math.random() * 0.2,
        fadeDirection: 'in',
        fadeSpeed: 0.003 + Math.random() * 0.004,
        size,
        type,
        value,
        id: Math.random().toString(36).substring(2, 9),
        group: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
        appearing: true,
        age: 0,
        lifespan: dynamic ? 400 + Math.floor(Math.random() * 800) : 10000
      };
    };

    // Initialize with data-representative points
    const initializeDataPoints = (width: number, height: number) => {
      // Increase initial count for better visibility
      const initialCount = Math.floor(maxPointsRef.current * 0.5);
      const points: DataPoint[] = [];
      
      const typeDistribution = {
        campaign: 0.15,
        user: 0.40,
        business: 0.25,
        tracker: 0.10,
        connection: 0.10
      };

      // Adjust distribution based on insightFocus
      if (insightFocus === 'campaigns') {
        typeDistribution.campaign = 0.40;
        typeDistribution.user = 0.25;
      } else if (insightFocus === 'engagement') {
        typeDistribution.user = 0.50;
        typeDistribution.campaign = 0.10;
      } else if (insightFocus === 'conversions') {
        typeDistribution.business = 0.40;
        typeDistribution.tracker = 0.20;
      }
      
      for (let i = 0; i < initialCount; i++) {
        // Determine point type based on probability distribution
        const rand = Math.random();
        let type: 'campaign' | 'user' | 'business' | 'tracker' | 'connection' = 'connection';
        let cumulative = 0;
        
        for (const [t, probability] of Object.entries(typeDistribution)) {
          cumulative += probability;
          if (rand <= cumulative) {
            type = t as any;
            break;
          }
        }
        
        // Create clusters for each type (more visible arrangement)
        let x, y;
        if (Math.random() > 0.3) { // 70% clustered
          // Create clustered points
          const cluster = Math.floor(Math.random() * 3); // 3 clusters
          const clusterX = width * (0.25 + (cluster * 0.25));
          const clusterY = height * (0.3 + (Math.random() * 0.4));
          const spread = Math.min(width, height) * 0.15;
          
          x = clusterX + (Math.random() - 0.5) * spread;
          y = clusterY + (Math.random() - 0.5) * spread;
        } else {
          // Random positions
          x = Math.random() * width;
          y = Math.random() * height;
        }
        
        points.push(createDataPoint(x, y, type));
      }
      
      pointsRef.current = points;
    };

    // Set canvas dimensions to match parent container
    const adjustCanvasSize = () => {
      if (!canvas || !canvas.parentElement) return;
      
      // Set display size (css pixels)
      const { width, height } = canvas.parentElement.getBoundingClientRect();
      
      // Ensure we have dimensions
      if (width === 0 || height === 0) {
        // If parent has no dimensions, use viewport size as fallback
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      } else {
        canvas.width = width;
        canvas.height = height;
      }
      
      // Ensure canvas is visible with a style
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      
      // Recalculate max points based on new dimensions
      const calculatedMax = Math.floor((canvas.width * canvas.height) / density);
      maxPointsRef.current = Math.max(calculatedMax, 50); // Ensure we have at least 50 points
      
      // Initialize points if first time or reset
      if (pointsRef.current.length === 0) {
        initializeDataPoints(canvas.width, canvas.height);
      }
    };

    // Setup resize observer
    resizeObserverRef.current = new ResizeObserver(adjustCanvasSize);
    if (canvas.parentElement) {
      resizeObserverRef.current.observe(canvas.parentElement);
    }
    adjustCanvasSize();

    // Simplified animation loop for better performance
    // eslint-disable-next-line complexity
    const animate = () => {
      frameCountRef.current++;
      if (!canvas || !ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Add new points periodically if in dynamic mode
      if (dynamic && pointsRef.current.length < maxPointsRef.current) {
        const now = frameCountRef.current;
        
        if (now - lastPointAddedRef.current > 10) { // Add a point every ~10 frames
          lastPointAddedRef.current = now;
          
          // Add based on insight focus
          let newType: 'campaign' | 'user' | 'business' | 'tracker' | 'connection';
          
          if (insightFocus === 'campaigns') {
            newType = Math.random() > 0.6 ? 'campaign' : (Math.random() > 0.5 ? 'user' : 'business');
          } else if (insightFocus === 'engagement') {
            newType = Math.random() > 0.6 ? 'user' : (Math.random() > 0.5 ? 'campaign' : 'connection');
          } else if (insightFocus === 'conversions') {
            newType = Math.random() > 0.6 ? 'business' : (Math.random() > 0.5 ? 'tracker' : 'user');
          } else {
            const types: ('campaign' | 'user' | 'business' | 'tracker' | 'connection')[] = 
              ['campaign', 'user', 'business', 'tracker', 'connection'];
            newType = types[Math.floor(Math.random() * types.length)];
          }
          
          pointsRef.current.push(createDataPoint(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            newType
          ));
        }
      }
      
      // Update points lifecycle and properties
      const updatedPoints: DataPoint[] = [];
      
      pointsRef.current.forEach(point => {
        // Update age
        point.age += 1;
        
        // Handle appearing/disappearing
        if (point.fadeDirection === 'in') {
          point.opacity += point.fadeSpeed;
          if (point.opacity >= 0.9) {
            point.fadeDirection = 'out';
            point.appearing = false;
          }
        } else {
          // Only start fading out when we reach 80% of lifespan
          if (point.age > point.lifespan * 0.8) {
            const ageFactor = point.age > point.lifespan * 0.9 ? 1.5 : 1;
            point.opacity -= point.fadeSpeed * ageFactor;
          }
        }
        
        // Keep if still visible or hasn't reached max age
        if (point.opacity > 0.01 && (point.age < point.lifespan || !dynamic)) {
          updatedPoints.push(point);
        }
      });
      
      pointsRef.current = updatedPoints;
      
      // Get points with enough opacity to be visible
      const visiblePoints = pointsRef.current.filter(p => p.opacity > 0.1);
      
      // Create connections between points (simplified for better performance)
      for (let i = 0; i < visiblePoints.length; i++) {
        const pointA = visiblePoints[i];
        
        // Limit connections per point for better performance
        const connectionLimit = mode === 'foreground' ? 4 : 2;
        let connections = 0;
        
        for (let j = i + 1; j < visiblePoints.length && connections < connectionLimit; j++) {
          const pointB = visiblePoints[j];
          const distance = Math.sqrt(
            Math.pow(pointA.x - pointB.x, 2) + 
            Math.pow(pointA.y - pointB.y, 2)
          );
          
          // Base max distance - increased for better visibility
          const baseMaxDistance = canvas.width / (mode === 'foreground' ? 3 : 4);
          
          // Enhanced connection logic based on type relationships
          let shouldConnect = false;
          const connectionStrength = 1.0;
          const maxDistance = baseMaxDistance;
          
          // Simplified connection logic - connect most points
          if (distance < maxDistance) {
            shouldConnect = true;
            connections++;
            
            // Calculate opacity
            const opacity = Math.max(0.3, Math.min(pointA.opacity, pointB.opacity));
            
            // Choose color based on connection type
            let connectionColor: string;
            
            // Type-based connections
            if (pointA.type === pointB.type) {
              connectionColor = colors[pointA.type];
            } else {
              connectionColor = colors[pointA.type];
            }
            
            // Draw line connecting points with improved visibility
            ctx.beginPath();
            ctx.moveTo(pointA.x, pointA.y);
            ctx.lineTo(pointB.x, pointB.y);
            ctx.strokeStyle = connectionColor;
            ctx.globalAlpha = opacity;
            ctx.lineWidth = mode === 'foreground' ? 0.8 : 0.6;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
            
            // Add data indicators on some connections
            if (Math.random() > 0.8) {
              const midX = (pointA.x + pointB.x) / 2;
              const midY = (pointA.y + pointB.y) / 2;
              
              ctx.fillStyle = connectionColor;
              ctx.globalAlpha = opacity;
              
              // Show coordinate-like data point
              ctx.font = '8px monospace';
              ctx.fillText(`${Math.floor(midX)},${Math.floor(midY)}`, midX + 5, midY);
              
              // Small circle at the midpoint for data node
              ctx.beginPath();
              ctx.arc(midX, midY, mode === 'foreground' ? 1.5 : 1.2, 0, Math.PI * 2);
              ctx.fill();
              
              ctx.globalAlpha = 1.0;
            }
          }
        }
      }
      
      // Draw the points themselves
      visiblePoints.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        
        // Color based on type
        const pointColor = colors[point.type];
        
        ctx.fillStyle = pointColor;
        ctx.globalAlpha = Math.min(point.opacity + 0.1, 1.0);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        
        // Add highlight ring for better visibility
        if (point.type !== 'connection') {
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.size + 1, 0, Math.PI * 2);
          ctx.strokeStyle = pointColor;
          ctx.globalAlpha = point.opacity * 0.5;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Clean up
    return () => {
      cancelAnimationFrame(animationRef.current);
      if (resizeObserverRef.current && canvas.parentElement) {
        resizeObserverRef.current.unobserve(canvas.parentElement);
      }
    };
  }, [colors, density, dynamic, insightFocus, mode, theme]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={className || "absolute inset-0 z-0"}
      style={{ 
        position: className ? 'relative' : 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        pointerEvents: 'none' 
      }}
      aria-hidden="true" 
    />
  );
};

export default CanvasBackground;