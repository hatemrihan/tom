import React from 'react'
// Import Highlighter component for text highlighting effect
import { Highlighter } from '@/components/ui/highlighter'

const Footer = () => {
  return (
    <section className="w-full bg-[#f2f2f2] px-6 md:px-12 lg:px-24 py-20">

      {/* Main Heading - Centered and Bold with Highlighter effect */}
      <div className="text-center mb-32 md:mb-40 -mt-30">
        <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-bold leading-tight tracking-tight">

          Are You <Highlighter
            action="highlight"
            color="#FFD700"
            strokeWidth={3}
            animationDuration={800}
            isView={true}
            multiline={true}
          >Still </Highlighter> Wanna
          <br />

          <Highlighter
            action="highlight"
            color="#FFD700"
            strokeWidth={3}
            animationDuration={800}
            isView={true}
            multiline={true}
          >Hire</Highlighter>  Him?


        </h2>
      </div>

      {/* Footer Info - Compact Layout */}
      <footer className="w-full">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">

          {/* Project Inquiries */}
          <div className="shrink-0">
            <h3 className="text-xs font-normal uppercase tracking-wide text-gray-500 mb-2">
              PROJECT INQUIRIES ↓
            </h3>
            <a
              href="mailto:hatemrihann@gmail.com"
              className="font-open-sans-light text-sm font-normal text-black hover:underline transition-all"
            >
              hatemrihann@gmail.com
            </a>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-xs font-normal uppercase tracking-wide text-gray-500 mb-2">
              SOCIAL
            </h3>
            <div className="flex flex-wrap gap-3 text-sm font-normal">
              <a
                href="https://www.instagram.com/hatemrihann"
                target="_blank"
                rel="noopener noreferrer"
                className="font-open-sans-light text-black hover:underline transition-all"
              >
                Instagram
              </a>
              <span className="text-gray-400">—</span>
              <a
                href="https://x.com/hatemrihan"
                target="_blank"
                rel="noopener noreferrer"
                className="font-open-sans-light text-black hover:underline transition-all"
              >
                Twitter
              </a>
              <span className="text-gray-400">—</span>
              <a
                href="https://www.linkedin.com/in/hatem-rihan-298753309"
                target="_blank"
                rel="noopener noreferrer"
                className="font-open-sans-light text-black hover:underline transition-all"
              >
                LinkedIn
              </a>
            </div>
          </div>

        </div>
      </footer>

    </section>
  )
}

export default Footer