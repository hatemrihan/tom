'use client';

// This imports React hooks
import React, { useState, useRef } from 'react';
// Import motion and useInView for animations
import { motion, useInView } from 'motion/react';
// Import typing animation component
import { TypingAnimation } from '@/components/ui/typing-animation';

// Import project images for deployment
import JayashOneImage from '../../public/images/JayashOne-image.jpg';
import JayashTwoImage from '../../public/images/JayashTwo-image.png';
import JayashThreeImage from '../../public/images/JayashThree-image.png';
import JayashFourImage from '../../public/images/JayashFour-image.png';
import JayashFiveImage from '../../public/images/JayashFive-image.png';
import JayashSixImage from '../../public/images/JayashSix-image.png';
import JayashSevenImage from '../../public/images/JayashSeven-image.png';
import UnlimitedOneImage from '../../public/images/UnlimitedOne-image.jpg'; 
import UnlimitedTwoImage from '../../public/images/UnlimitedTwo-image.png';
import UnlimitedThreeImage from '../../public/images/UnlimitedThree-image.png';
import UnlimitedFourImage from '../../public/images/UnlimitedFour-image.png';
import NaderOneImage from '../../public/images/NaderOne-image.png';
import NaderTwoImage from '../../public/images/NaderTwo-image.png';
import NaderThreeImage from '../../public/images/NaderThree-image.png';
import NaderFourImage from '../../public/images/NaderFour-image.png';
import FaragOneImage from '../../public/images/FaragOne-image.png';
import FaragTwoImage from '../../public/images/FaragTwo-image.png';
import FaragThreeImage from '../../public/images/FaragThree-image.png';
import FaragFourImage from '../../public/images/FaragFour-image.png';
import FaragFiveImage from '../../public/images/FaragFive-image.png';
import FaragSixImage from '../../public/images/FaragSix-image.png';

// Import Next.js image type
import { StaticImageData } from 'next/image';

// Interface defines the structure of a project
interface Project {
  id: number;
  name: string;
  image: string | StaticImageData;
  isVideo?: boolean;
  previewImages?: StaticImageData[];
  link: string;
  description?: string;
  type?: string;
}

// Projects data array - stores all project information
const projects: Project[] = [
  {
    id: 1,
    name: 'JAYASH',
    image: JayashOneImage,
    previewImages: [
        // Images imported for deployment
      JayashOneImage,
      JayashTwoImage,
      JayashThreeImage,
      JayashFourImage,
      JayashFiveImage,
      JayashSixImage,
      JayashSevenImage,

    ],
    link: 'https://ja-yash.com',
    description: 'Collaboration on the graphic design for album. Custom typeface inspired by modern lettering, designed fan-style merch, and developed cohesive packaging working closely with the artist.',
    type: 'E commerce - Branding.'
  },
  {
    id: 2,
    name: 'UNLIMITED',
    image: UnlimitedOneImage,
    previewImages: [
      UnlimitedOneImage,
      UnlimitedTwoImage,
      UnlimitedThreeImage,
      UnlimitedFourImage,

    ],
    link: 'https://unlimited-sw.com',
    description: 'Developed a cohesive visual identity, custom typeface,interface, Data specifications,  Using Next js the most advanced framework.',
    type: 'E commerce - Branding.'
  },
  {
    id: 3,
    name: 'NE - COACH PROFILE',
    image: '/videos/nader.mp4',
    isVideo: true,
    previewImages:[
        NaderOneImage,
        NaderTwoImage,
        NaderThreeImage,
        NaderFourImage,
      
    ],
    link: 'https://nader-emad.vercel.app/',
    description: 'Turning it digital, Created a powerful UserInterface where they can subscribe and get the coaching services through live chat through talk-js.',
    type: 'Coaching Portfolio'
  },
  {
    id: 4,
    name: 'FARAG',
    image: FaragOneImage,
    previewImages: [
        FaragOneImage,
        FaragTwoImage,
        FaragThreeImage,
        FaragFourImage,
        FaragFiveImage,
        FaragSixImage,
    ],
    link: 'https://faragg.netlify.app/',
    description: 'Creating a brand identity for a photography studio, with a focus on minimalist design principles, choosen design, threejs, gsap and framer motion.',
    type: 'Photography - Branding.'
  },
];

// Modal component that shows project details
interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  // Don't render if modal is closed or no project selected
  if (!isOpen || !project) return null;

  return (
    // Full-screen overlay with backdrop blur
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center  bg-black/50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal container - macOS style - smaller on mobile */}
      <div 
        className="relative w-[90vw] md:w-full max-w-sm md:max-w-4xl max-h-[70vh] md:max-h-[85vh] bg-white dark:bg-gray-900 overflow-hidden animate-in zoom-in-95 duration-300 mx-4 rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* macOS Window Header with traffic light buttons */}
        <div className=" px-4 py-3 flex items-center gap-2 bg-[#f2f2f2] ">
          <div className="flex gap-2">
            {/* Close button (red) */}
            <button 
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            />
            {/* Minimize button (yellow) */}
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            {/* Maximize button (green) */}
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          {/* Window title - centered */}
          <div className="flex-1 text-center ">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Information about: {project.name}
            </span>
          </div>
          {/* Spacer for centering */}
          <div className="w-16" />
        </div>

        {/* Modal Content - scrollable - more compact on mobile */}
        <div className="overflow-y-auto max-h-[calc(70vh-60px)] md:max-h-[calc(85vh-60px)]">
          <div className="p-3 md:p-6">
            {/* Header with thumbnail and title */}
            <div className="flex gap-2 md:gap-4 mb-4 md:mb-6">
              {/* Show video or image thumbnail */}
              {project.isVideo ? (
                <video
                  src={project.image as string}
                  className="w-12 h-12 md:w-20 md:h-20 object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={typeof project.image === 'string' ? project.image : project.image.src}
                  alt={project.name}
                  className="w-12 h-12 md:w-20 md:h-20 object-cover"
                />
              )}
              <div>
                <h2 className="text-base mt-3 text-center  md:text-xl font-bold text-gray-900 dark:text-white ">
                  {project.name}
                </h2>
                
              </div>
            </div>

            {/* Description section */}
            {project.description && (
              <div className="mb-4 md:mb-6">
                <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {project.description}
                </p>
              </div>
            )}

            {/* Details Section */}
            <div className="mb-3 md:mb-4">
            
              <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Type:</span> {project.type || ""}
              </p>
            </div>

            {/* Preview Section - Multiple Images */}
            <div>
              <h3 className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white mb-2 md:mb-3">
                Preview:
              </h3>
              <div className="space-y-3 md:space-y-4">
                {/* If previewImages exists, show all images; otherwise show main image */}
                {(project.previewImages && project.previewImages.length > 0) ? (
                  project.previewImages.map((imageUrl, index) => (
                    <div key={index} className="p-2 md:p-4">
                      <img
                        src={typeof imageUrl === 'string' ? imageUrl : imageUrl.src}
                        alt={`${project.name} - Image ${index + 1}`}
                        className="w-full h-auto"
                      />
                    </div>
                  ))
                ) : (
                  <div className="p-2 md:p-4">
                    <img
                      src={typeof project.image === 'string' ? project.image : project.image.src}
                      alt={project.name}
                      className="w-full h-auto"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Explore component that displays our work
const Exolore = () => {
  // State to track which project modal is open
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open modal with selected project
  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };
  // ⚙️ CONTROL TYPING SPEED HERE - Change this number (in milliseconds)
  // Lower = faster, Higher = slower (e.g., 50 = fast, 200 = slow)
  const typingSpeed = 120;

  return (
    // Main container with padding and white background
    <section className="w-full min-h-screen bg-[#f2f2f2]  px-6 md:px-12 lg:px-24">
      
      {/* Large typography headline with typing animation */}
      <div className="mb-4 md:mb-10 lg:mb-50 text-center">
        <h2 className="text-4xl font-bold leading-tight tracking-tight">
          Explore My{' '}
          <TypingAnimation
            className="text-4xl font-bold leading-tight tracking-tight inline-block"
            duration={typingSpeed}
            startOnView={true}
            showCursor={true}
            blinkCursor={true}
            loop={false}
          >
            Work.
          </TypingAnimation>
        </h2>
      </div>

      {/* ⚙️ CUSTOMIZE IMAGE SCALE - Change these values to make image bigger or smaller */}
      {/* Scale: 1.0 = original, 0.8 = 80% smaller, 1.2 = 20% bigger */}
      <style jsx>{`
        .scaled-image-mobile { transform: scale(0.35); transform-origin: left center; }
        @media (min-width: 768px) and (max-width: 1023px) {
          .scaled-image-mobile { transform: scale(0.5); }
        }
        @media (min-width: 1024px) {
          .scaled-image-mobile { transform: scale(0.45); }
        }
      `}</style>

      {/* Container for all projects - vertical spacing between items */}
      <div className="w-full -space-y-80 md:-space-y-60 lg:-space-y-60">
        
        {/* Loop through each project */}
        {projects.slice(0, 4).map((project, index) => {
          // Create a ref for each project to track if it's in view
          const ProjectWrapper = () => {
            const projectRef = useRef(null);
            const isInView = useInView(projectRef, { 
              once: true, 
              margin: "-100px" 
            });

            return (
              // Individual project container with inView animation - plays once, slowly
              <motion.div
                ref={projectRef}
                key={project.id} 
                className="relative w-full px-4 lg:-mx-40"
                initial={{ opacity: 0, y: 80 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
                transition={{ 
                  duration: 1.5, 
                  delay: 0.3,
                  ease: "easeOut" 
                }}
              >
                {/* Flex container to hold the image on the left */}
                <div className="flex justify-start">
              
              {/* Image container - scaled based on screen size */}
              <div className="relative w-auto h-auto">
                
                {/* Actual image/video wrapper with scaling - clickable */}
                <div 
                  className="relative w-screen h-[70vh] md:h-[75vh] lg:h-[80vh] scaled-image-mobile cursor-pointer group"
                  onClick={() => handleProjectClick(project)}
                >
                  {/* Show video if isVideo is true, otherwise show image */}
                  {project.isVideo ? (
                    <video
                      src={project.image as string}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={typeof project.image === 'string' ? project.image : project.image.src}
                      alt={project.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  
                  {/* Hover overlay effect */}
                  <div className="absolute inset-0 bg-black opacity-0  transition-opacity duration-300" />
                </div>
              </div>
              
              {/* Text container - absolutely positioned on the RIGHT side */}
              <div className="absolute right-0 lg:right-44 top-1/2 -translate-y-1/2">
                {/* Text alignment to the right */}
                <div className="text-center">
                  {/* Project name with typing animation */}
                  <h2 className="font-open-sans-light text-sm md:text-base lg:text-lg tracking-wide text-gray-800 mb-2 uppercase">
                    {project.name}
                  </h2>
                  
                  {/* View project link */}
                  <button 
                    onClick={() => handleProjectClick(project)}
                    className="mt-1 text-xs md:text-sm font-bold text-gray-800 hover:text-black transition-colors uppercase tracking-wide"
                  >
                    View Project →
                  </button>
                  
                  {/* View Live Site link */}
                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-open-sans-light block mt-3 text-xs md:text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    View Live Site ↗
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
            );
          };
          
          return <ProjectWrapper key={project.id} />;
        })}
        
      </div>

      {/* Project Modal */}
      <ProjectModal 
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default Exolore;