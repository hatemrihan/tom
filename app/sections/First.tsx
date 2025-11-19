'use client';

// This imports React hooks to manage state and side effects
import { useEffect, useState } from 'react';
// This imports the scroll progress bar component
import { ScrollProgress } from '@/components/ui/scroll-progress';

// Main component that creates the scroll-shrinking video effect
const First = () => {
  // This stores how much the user has scrolled (0 to 1)
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // This tracks if the video has shrunk to its minimum size
  const [isMinimized, setIsMinimized] = useState(false);

  // This runs when the component loads and sets up scroll tracking
  useEffect(() => {
    // This function calculates how much the user has scrolled
    const handleScroll = () => {
      // Get the current scroll position from top of page
      const scrollY = window.scrollY;
      
      // Define how many pixels to scroll before video is fully shrunk (1500px)
      const maxScroll = 2500;
      
      // Calculate progress as a number between 0 and 1
      const progress = Math.min(scrollY / maxScroll, 1);
      
      // Update the scroll progress state
      setScrollProgress(progress);
      
      // Check if video has started shrinking (show text after 40% scroll)
      setIsMinimized(progress > 0.4);
    };

    // Listen for scroll events and call handleScroll
    window.addEventListener('scroll', handleScroll);
    
    // Call once on mount to set initial values
    handleScroll();

    // Cleanup: remove listener when component is destroyed
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate video scale: starts at 1 (100%), shrinks to 0.35 (35%)
  const scale = 1 - (scrollProgress * 0.99);
  
  // Calculate video width: starts at 100vw, shrinks to 35vw
  const width = 100 - (scrollProgress * 95);
  
  // Calculate video height: starts at 100vh, shrinks to 40vh
  const height = 100 - (scrollProgress * 90);

  return (
    <>
      {/* Scroll progress bar - appears when video finishes scaling */}
      {isMinimized && <ScrollProgress />}
      
      {/* Main container with white background */}
      <div className="relative bg-[#f2f2f2] min-h-screen">
        
        {/* Sticky container that holds video in center of screen */}
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          
          {/* Main centered text section with infinite scroll BEHIND video */}
          {isMinimized && (
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0">
              <div className="animate-marquee-left whitespace-nowrap">
                <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-black uppercase tracking-wider">
                  Wanna Hire This Guy?&nbsp;&nbsp;&nbsp;
                </span>
                <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-black uppercase tracking-wider">
                  Wanna Hire This Guy?&nbsp;&nbsp;&nbsp;
                </span>
                <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-black uppercase tracking-wider">
                  Wanna Hire This Guy?&nbsp;&nbsp;&nbsp;
                </span>
              </div>
              
            </div>
            
          )}
          

         

         

          {/* Video container with dynamic size based on scroll */}
          <div 
            className="relative transition-all duration-100 ease-out z-20"
            style={{
              width: `${width}vw`,
              height: `${height}vh`,
              transform: `scale(${scale})`,
            }}
          >
            {/* The actual video element */}
            
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/videos/hatem.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            
          </div>
        </div>
        

        {/* Spacer to enable scrolling - makes page tall enough to scroll */}
        <div className="h-[300vh]"></div>
        
      </div>
      
    </>
  );
};

export default First;