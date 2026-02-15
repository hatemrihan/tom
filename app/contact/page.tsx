"use client";

import React, { useEffect, useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import Stepper, { Step } from "@/components/Stepper";
import Nav from "../sections/Nav";
import Image from "next/image";
import hatemImage from "../../public/images/hatem-image.jpg";




const ClientAgreementPage = () => {


  return (
    <div className="overflow-x-hidden w-full">
      {/* Navigation Header */}


      {/* CLIENT AGREEMENT Section */}
      <section className="min-h-screen bg-stone-100 dark:bg-black text-black  pt-16 lg:pt-20 w-full overflow-x-hidden transition-colors duration-300 relative">
        {/* WebGL Background */}
        <div id="webgl-background" className="absolute inset-0 z-0 opacity-20"></div>

        <div className="relative z-10 w-full px-4 sm:px-6 py-8 lg:py-24">
          {/* CLIENT AGREEMENT Text */}
          <div className="text-center mb-8 lg:mb-16 w-full">
            <motion.h1
              className="text-2xl sm:text-2xl md:text-4xl lg:text-4xl xl:text-5xl font-black uppercase leading-none mb-4 lg:mb-8 w-full"
              style={{
                letterSpacing: '0.1em',
                wordBreak: 'keep-all',
                overflowWrap: 'normal'
              }}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              CLIENT<br />
              AGREEMENT
            </motion.h1>
          </div>

          <Nav />

          {/* Agreement Topics Carousel */}
          <AgreementCarousel />

          {/* Contact Form Section */}
          <ContactForm />
        </div>
      </section>

      {/* WebGL Background - Removed to prevent SSR Html import errors */}
    </div>
  );
};

// Agreement Carousel Component
const AgreementCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "INTRO",
      content: (
        <>
          <p>This Client Agreement ("Agreement") is entered into between The Client, hereinafter referred to as the "Client," and Tom , a development studio based in Egypt, hereinafter referred to as "Tom."</p>
          <p>Any use of "I" refers to design concept, development, branding, ideas, concepts and materials and any and all work that results from any project.</p>
          <p>By engaging with Tom  for development/design services, the Client agrees to the terms and conditions outlined in this Agreement.</p>
        </>
      )
    },
    {
      id: 2,
      title: "SCOPE OF WORK",
      content: (
        <>
          <p><strong>2.1)</strong> Tom agrees to provide development/design services to the Client as outlined in the attached proposal signed by both parties. The scope of work, deliverables, and project timeline will be detailed in the received project proposal.</p>
          <p><strong>2.2)</strong> Two (2) rounds of edits/revisions are included within the quoted price. The Client must respond to revision requests, further revisions will be charged at an hourly rate as specified in the proposal.</p>
        </>
      )
    },
    {
      id: 3,
      title: "FEES AND PAYMENTS",
      content: (
        <>
          <p><strong>3.1) Payment Terms:</strong> The Client agrees to pay the total project fee as outlined in the project proposal. Payment schedule will be 50% upfront deposit, with remaining balance due upon project completion.</p>
          <p><strong>3.2) Late Payments:</strong> Invoices are due within 30 days. Late payments may incur a 1.5% monthly service charge.</p>
          <p><strong>3.3) Additional Work:</strong> Any work beyond the agreed scope will be billed separately at our standard hourly rate.</p>
        </>
      )
    },
    {
      id: 4,
      title: "PROJECT MANAGEMENT",
      content: (
        <>
          <p><strong>4.1) Communication:</strong> All project communication will be conducted via email and scheduled video calls. The Client agrees to respond to requests for information within 5 business days.</p>
          <p><strong>4.2) Timeline:</strong> Project timelines are estimates based on receiving timely feedback and materials from the Client.</p>
          <p><strong>4.3) Deliverables:</strong> All final files will be delivered electronically in the formats specified in the project proposal.</p>
        </>
      )
    },
    {
      id: 5,
      title: "TERMINATION",
      content: (
        <>
          <p><strong>5.1)</strong> Either party may terminate this agreement with 14 days written notice. The Client will be billed for work completed up to the termination date.</p>
          <p><strong>5.2)</strong> Upon termination, all work completed to date becomes property of the Client upon final payment of all outstanding invoices.</p>
          <p><strong>5.3)</strong> Tom reserves the right to terminate the agreement immediately in case of non-payment or breach of contract.</p>
        </>
      )
    },
    {
      id: 6,
      title: "CONFLICT OF INTEREST",
      content: (
        <>
          <p><strong>6.1)</strong> Tom will disclose any potential conflicts of interest before beginning work and obtain written consent from the Client to proceed.</p>
          <p><strong>6.2)</strong> Tom agrees not to work on directly competing projects during the duration of this agreement without prior written consent.</p>
          <p><strong>6.3)</strong> All conflicts of interest will be resolved in favor of the Client's best interests.</p>
        </>
      )
    },
    {
      id: 7,
      title: "CONFIDENTIALITY",
      content: (
        <>
          <p><strong>7.1)</strong> Both parties agree to maintain confidentiality of proprietary information shared during the project.</p>
          <p><strong>7.2)</strong> Tom will not disclose any confidential business information, trade secrets, or proprietary data without written consent.</p>
          <p><strong>7.3)</strong> This confidentiality agreement remains in effect for 5 years after project completion.</p>
        </>
      )
    },
    {
      id: 8,
      title: "INDEMNIFICATION",
      content: (
        <>
          <p><strong>8.1)</strong> The Client agrees to indemnify and hold harmless the Studio from any claims arising from the use of completed work.</p>
          <p><strong>8.2)</strong> Tom's liability is limited to the total amount paid for the project.</p>
          <p><strong>8.3)</strong> Neither party will be liable for indirect, incidental, or consequential damages.</p>
        </>
      )
    },
    {
      id: 9,
      title: "SUB-CONTRACTORS",
      content: (
        <>
          <p><strong>9.1)</strong> Tom may engage qualified sub-contractors to complete portions of the work, subject to the same confidentiality and quality standards.</p>
          <p><strong>9.2)</strong> All sub-contractors will be bound by the same terms and conditions as outlined in this agreement.</p>
          <p><strong>9.3)</strong> Tom remains fully responsible for all work performed by sub-contractors.</p>
        </>
      )
    },
    {
      id: 10,
      title: "INTELLECTUAL PROPERTY",
      content: (
        <>
          <p><strong>10.1) Ownership:</strong> Upon full payment, the Client will own the final delivered work. Tom retains rights to preliminary concepts, sketches, and unused designs.</p>
          <p><strong>10.2) Portfolio Rights:</strong> Tom reserves the right to display completed work in portfolios, websites, and promotional materials.</p>
          <p><strong>10.3) Third-Party Assets:</strong> Any stock photography, fonts, or other third-party materials used will require separate licensing by the Client.</p>
        </>
      )
    },
    {
      id: 11,
      title: "TERMS AND CONDITIONS",
      content: (
        <>
          <p><strong>11.1) Governing Law:</strong> This agreement will be governed by the laws of Egypt and any disputes will be resolved through arbitration.</p>
          <p><strong>11.2) Force Majeure:</strong> Neither party will be liable for delays caused by circumstances beyond their reasonable control.</p>
          <p><strong>11.3) Amendments:</strong> Any changes to this agreement must be made in writing and signed by both parties.</p>
        </>
      )
    },
    {
      id: 12,
      title: "ACCEPTANCE OF AGREEMENT",
      content: (
        <>
          <p><strong>12.1)</strong> By signing below or by making payment for services, the Client acknowledges that they have read, understood, and agree to be bound by all terms and conditions outlined in this agreement.</p>
          <p><strong>12.2)</strong> This agreement becomes effective upon signature by both parties or upon receipt of initial payment, whichever comes first.</p>
          <div className="mt-6 pt-6 border-t border-black/20 ">
            <a href="mailto:hatemriahnn@gmail.com" className="font-semibold">Contact: hatemriahnn@gmail.com</a>  <p className="font-semibold">Contact: hatemriahnn@gmail.com</p>
          </div>
        </>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (

    <motion.div
      className="w-full max-w-5xl mx-auto scale-90"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <div className="relative">
        {/* Mobile Layout - Better responsive design */}
        <div className="lg:hidden">
          <div className="relative min-h-[70vh] sm:min-h-[70vh] py-4 px-3 sm:px-4">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-500 ease-in-out ${index === currentSlide ? 'opacity-100 translate-x-0' :
                    index < currentSlide ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full'
                  }`}
              >
                <div className="flex flex-col h-full pt-3 px-2 sm:px-3 overflow-y-auto">
                  {/* Topic Title (Mobile) */}
                  <div className="shrink-0 mb-3">
                    <div className="font-black uppercase leading-tight text-black ">
                      <div className="text-base sm:text-lg opacity-70 mb-1">{String(slide.id).padStart(2, '0')}</div>
                      {slide.title.split(' ').map((word, i) => (
                        <div key={i} className="leading-none text-base sm:text-lg md:text-xl">{word}</div>
                      ))}
                    </div>
                  </div>

                  {/* Content (Mobile) */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="client-agreement-content text-xs sm:text-sm leading-relaxed space-y-2 text-black pr-2">
                      {slide.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Arrows - Mobile */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20
                text-black  p-2
                transition-all duration-200 hover:scale-110 hover:opacity-70"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20
                text-black  p-2
                transition-all duration-200 hover:scale-110 hover:opacity-70"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Slide Counter - Mobile */}
            <div className="absolute top-4 right-4 bg-black/5 dark:bg-white/5 rounded-lg px-2 py-1 text-black  text-xs font-medium">
              {currentSlide + 1} / {slides.length}
            </div>
          </div>
        </div>

        {/* Desktop Layout - Split design without box */}
        <div className="hidden lg:block">
          <div className="relative min-h-[400px] py-8 px-12 xl:px-16">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-500 ease-in-out ${index === currentSlide ? 'opacity-100 translate-x-0' :
                    index < currentSlide ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full'
                  }`}
              >
                <div className="grid grid-cols-10 gap-8 xl:gap-10 h-full items-center px-8 xl:px-10">
                  {/* Left Side - Topic Title (Desktop) */}
                  <div className="col-span-3">
                    <div className="font-black uppercase leading-tight text-black ">
                      <div className="text-base xl:text-lg opacity-70 mb-1">{String(slide.id).padStart(2, '0')}</div>
                      {slide.title.split(' ').map((word, i) => (
                        <div key={i} className="leading-none text-lg xl:text-xl 2xl:text-2xl">{word}</div>
                      ))}
                    </div>
                  </div>

                  {/* Right Side - Content (Desktop) */}
                  <div className="col-span-7">
                    <div className="text-sm lg:text-base xl:text-base leading-relaxed space-y-2 lg:space-y-3 text-black ">
                      {slide.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Arrows - Desktop (No Background) */}
            <button
              onClick={prevSlide}
              className="absolute -left-8 xl:-left-10 top-1/2 transform -translate-y-1/2 z-20
   text-black  p-4
   transition-all duration-200 hover:scale-110 hover:opacity-70"
            >
              <svg className="w-7 h-7 xl:w-8 xl:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute -right-8 xl:-right-10 top-1/2 transform -translate-y-1/2 z-20
   text-black  p-4
   transition-all duration-200 hover:scale-110 hover:opacity-70"
            >
              <svg className="w-7 h-7 xl:w-8 xl:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Slide Counter - Desktop */}
            <div className="absolute top-4 right-8 bg-black/5 dark:bg-white/5 rounded-lg px-3 py-1 text-black  text-sm font-medium">
              {currentSlide + 1} / {slides.length}
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center mt-8 lg:mt-12 space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-200 ${index === currentSlide
                  ? 'bg-black dark:bg-white scale-125'
                  : 'bg-black/30 dark:bg-white/30 hover:bg-black/50 dark:hover:bg-white/50'
                }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );

};


// Contact Stepper Component
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    projectType: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      console.log('Submitting form data:', formData);

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setSubmitStatus('success');
        // Keep success message for 3 seconds, then reset to show form again
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 3000);
      } else {
        console.error('Submission error:', data);
        const errorMessage = data.error || data.details?.message || 'Failed to submit form';
        alert(`Error: ${errorMessage}\n\nPlease check the console for more details.`);
        setSubmitStatus('error');
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      alert(`Network Error: ${error.message}\n\nPlease check if the server is running and MongoDB is connected.`);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto mt-16 lg:mt-24 px-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
    >
      {/* Status Messages */}
      {submitStatus === 'success' && (
        <motion.div
          className="mb-8 p-4 bg-green-100 border border-green-500 rounded-lg text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-green-700 dark:text-green-300 font-medium">
            ✓ Message sent successfully! We'll get back to you within 24 hours.
          </p>
        </motion.div>
      )}

      {submitStatus === 'error' && (
        <motion.div
          className="mb-8 p-4 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-lg text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-red-700 dark:text-red-300 font-medium">
            ✗ Error sending message. Please try again or contact hatem directly.
          </p>
        </motion.div>
      )}

      {/* Two Column Layout - Mobile stacked, Desktop side by side */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-2 xl:gap-3 lg:justify-center lg;items-center">

        {/* Left Side - Header (Mobile: center, Desktop: left-aligned) */}
        <div className="text-center lg:text-left mb-6 lg:mb-0 lg:flex-0.95">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl  uppercase text-black dark:text-white mb-4 lg:mb-6">
            GET IN<br />TOUCH.
          </h2>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-black/70 dark:text-white/70 max-w-md mx-auto lg:mx-0">
            Let's prepare a masterpiece for you.
          </p>
        </div>

        {/* Right Side - Stepper Form */}
        <div className="lg:flex-1 lg:max-w-xl relative">
          {/* Loading Overlay */}
          {isSubmitting && (
            <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 border-4 border-black/20 border-t-black dark:border-white/20 dark:border-t-white rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-black dark:text-white">Sending...</p>
              </div>
            </div>
          )}

          <Stepper
            initialStep={1}
            onFinalStepCompleted={handleFormSubmit}
            stepCircleContainerClassName=""
            contentClassName="min-h-[180px]"
          >
            {/* Step 1: Personal Information */}
            <Step>
              <div className="space-y-4">
                <h3 className="text-lg  text-black mb-3">Personal Information</h3>

                <div className="space-y-2">
                  <label className="block text-sm  text-black  uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-0 py-3 bg-stone-100 border-0 border-b-2 border-black/20  
   text-black dark:text-white placeholder-black/50 
   focus:border-black dark:focus:border-white focus:outline-none transition-colors duration-300
   text-sm sm:text-base"
                    placeholder="haetooooooooooooooom"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-black  uppercase tracking-wider">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-0 py-3 bg-stone-100 border-0 border-b-2 border-black/20  
   text-black dark:text-white placeholder-black/50 
   focus:border-black dark:focus:border-white focus:outline-none transition-colors duration-300
   text-sm sm:text-base"
                    placeholder="email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-black  uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-0 py-3 bg-stone-100 border-0 border-b-2 border-black/20  
   text-black dark:text-white placeholder-black/50 
   focus:border-black dark:focus:border-white focus:outline-none transition-colors duration-300
   text-sm sm:text-base"
                    placeholder="+20 123456789"
                  />
                </div>
              </div>
            </Step>
            <Step>
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-full max-w-2xl mb-6">
                    <Image
                      src={hatemImage}
                      alt="Confirmation"
                      className="w-full h-auto rounded-2xl object-cover shadow-2xl"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold text-black dark:text-white">
                      Almost There!
                    </h3>
                    <p className="text-base text-black/70 dark:text-white/70 max-w-md mx-auto">
                      HIRE HIM!, If you didnt he knows you anyway cuz he know everyone who visit his website, GOTCHA!
                    </p>
                  </div>
                </div>
              </div>
            </Step>

            {/* Step 2: Project Details */}
            <Step>
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-black  mb-4">Project Details</h3>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-black  uppercase tracking-wider">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-0 py-3 bg-stone-100 border-0 border-b-2 border-black/20  
   text-black dark:text-white placeholder-black/50 
   focus:border-black dark:focus:border-white focus:outline-none transition-colors duration-300
   text-sm sm:text-base"
                    placeholder="Your Company"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-black  uppercase tracking-wider">
                    Project Type *
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => handleInputChange('projectType', e.target.value)}
                    className="w-full px-0 py-3 bg-stone-100 border-0 border-b-2 border-black/20  
   text-black dark:text-white 
   focus:border-black  focus:outline-none transition-colors duration-300
   text-sm sm:text-base"
                  >
                    <option value="" className="bg-white text-black/50">Select a type</option>
                    <option value="web-design" className="bg-white text-black">Web Design</option>
                    <option value="web-development" className="bg-white">Ai website/Automation</option>
                    <option value="branding" className="bg-white">Portfolio</option>
                    <option value="e-commerce" className="bg-white">E commerce </option>
                    <option value="other" className="bg-white">Custom</option>
                  </select>
                </div>
              </div>
            </Step>

            {/* Step 3: Visual Confirmation */}

          </Stepper>
        </div>

      </div>
    </motion.div>

  );

};

export default ClientAgreementPage; 