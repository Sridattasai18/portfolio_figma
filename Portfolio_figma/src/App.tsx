import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import profileImage from "figma:asset/88de022e7aeb497afec6d49bb5cff8d99993a847.png";

// Letter-by-letter animation component
function AnimatedText({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const letters = Array.from(text);
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: delay },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={child}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Parallax section wrapper
function ParallaxSection({ children, id, className = "" }: { children: React.ReactNode; id?: string; className?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <motion.section ref={ref} id={id} className={className} style={{ y }}>
      {children}
    </motion.section>
  );
}

function Navigation() {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About me' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contacts', label: 'Contacts' }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = navItems.map(item => item.id);
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#1f1f1f]/95 backdrop-blur-md shadow-lg' : 'bg-[#1f1f1f]/90 backdrop-blur-sm'
      } border-b border-white/10`}
      role="navigation" 
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="flex justify-between items-center">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-12" role="menubar">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => scrollToSection(item.id)}
                className={`relative font-['Inter',_sans-serif] text-base transition-colors duration-200 ${
                  activeSection === item.id ? 'text-[#f8f7f9]' : 'text-[#f8f7f9]/70 hover:text-[#f8f7f9]'
                }`}
                aria-current={activeSection === item.id ? 'page' : undefined}
                role="menuitem"
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#f8f7f9]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
          
          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:hidden text-[#f8f7f9] p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
          
          {/* Social Icons */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden lg:flex items-center gap-6"
          >
            <div className="h-11 w-px bg-[#f8f7f9]/30" />
            <div className="flex gap-6">
              <SocialIcon type="linkedin" />
              <SocialIcon type="github" />
            </div>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4"
          >
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left py-3 px-4 font-['Inter',_sans-serif] transition-colors duration-200 ${
                  activeSection === item.id ? 'text-[#f8f7f9] bg-white/5' : 'text-[#f8f7f9]/70 hover:text-[#f8f7f9] hover:bg-white/5'
                }`}
              >
                {item.label}
              </motion.button>
            ))}
            <div className="flex gap-4 mt-4 px-4">
              <SocialIcon type="linkedin" />
              <SocialIcon type="github" />
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

function SocialIcon({ type }: { type: 'linkedin' | 'github' }) {
  const getPath = () => {
    if (type === 'linkedin') {
      return (
        <path
          d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      );
    } else {
      return (
        <path
          d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4M9 19c-5 1.5-5-2.5-7-3l2-1"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      );
    }
  };

  const handleClick = () => {
    if (type === 'linkedin') {
      window.open('https://www.linkedin.com/in/kaligotla-sri-datta-sai-vithal-01bb2a321', '_blank');
    } else {
      window.open('https://github.com/Sridattasai18', '_blank');
    }
  };

  return (
    <motion.button 
      onClick={handleClick}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      className="text-[#f8f7f9] hover:text-[#f8f7f9]/80 transition-colors duration-200"
      aria-label={`Visit ${type} profile`}
    >
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        {getPath()}
      </svg>
    </motion.button>
  );
}

function HeroSection() {
  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen relative flex items-center justify-center overflow-hidden pt-20 lg:pt-0">
      {/* Enhanced Background blur effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[905px] h-[897px]">
          <motion.div 
            className="absolute inset-0 opacity-10"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <svg className="w-full h-full" viewBox="0 0 1417 1409">
              <defs>
                <filter id="blur" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
                  <feGaussianBlur stdDeviation="128" />
                </filter>
              </defs>
              <ellipse
                cx="708.5"
                cy="704.5"
                rx="452.5"
                ry="448.5"
                fill="#f8f7f9"
                filter="url(#blur)"
              />
            </svg>
          </motion.div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left content */}
        <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-3 lg:space-y-4"
          >
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="font-['Inter',_sans-serif] text-lg sm:text-xl text-[#f8f7f9]/80"
            >
              Hi, I'm
            </motion.h2>
            <h1 className="font-['Inter',_sans-serif] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] text-[#f8f7f9]">
              <AnimatedText text="Kaligotla Sri Datta" delay={0.5} />
              <br />
              <AnimatedText text="Sai Vithal" delay={0.9} />
            </h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="font-['Inter',_sans-serif] text-lg sm:text-xl lg:text-2xl text-[rgba(248,247,249,0.7)] mt-4"
            >
              Web Developer and UI UX
            </motion.p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="flex gap-3 sm:gap-4 flex-wrap"
          >
            <motion.button 
              onClick={scrollToProjects}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative group px-6 sm:px-8 py-3 sm:py-4 rounded-full overflow-hidden bg-gradient-to-r from-[#f8f7f9] to-[#d0cfd3] shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <span className="relative z-10 font-['Inter',_sans-serif] text-base sm:text-lg text-[#1f1f1f]">
                View My Projects
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white to-[#f8f7f9]"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            <motion.a
              href="mailto:kaligotlasridattasai18@gmail.com"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative group px-6 sm:px-8 py-3 sm:py-4 rounded-full border-2 border-[#f8f7f9] backdrop-blur-sm hover:bg-[#f8f7f9]/10 transition-all duration-300"
            >
              <span className="font-['Inter',_sans-serif] text-base sm:text-lg text-[#f8f7f9]">
                Contact Me
              </span>
            </motion.a>
          </motion.div>
        </div>

        {/* Right content - Profile image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative order-1 lg:order-2"
        >
          <div className="flex justify-center items-start pt-8 lg:pt-0">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ duration: 0.3 }}
              className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] lg:w-[400px] lg:h-[400px] xl:w-[450px] xl:h-[450px]"
            >
              {/* Animated ring around image */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#f8f7f9]/20"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <div 
                className="w-full h-full rounded-full bg-cover bg-no-repeat shadow-2xl relative overflow-hidden"
                style={{ 
                  backgroundImage: `url('${profileImage}')`,
                  backgroundPosition: 'center 30%',
                  backgroundSize: 'cover'
                }}
                role="img"
                aria-label="Professional portrait of Kaligotla Sri Datta Sai Vithal"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-[#f8f7f9]/30 rounded-full flex justify-center pt-2"
        >
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 bg-[#f8f7f9]/50 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1 
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-['Inter',_sans-serif] text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-[#f8f7f9] mb-8 lg:mb-12"
        >
          About me
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl"
        >
          <p className="font-['Inter',_sans-serif] text-lg sm:text-xl lg:text-2xl text-[rgba(248,247,249,0.5)] leading-[1.6]">
            I am a Computer Science student specializing in Artificial Intelligence and Data Science with strong skills in Python, Java, Web Development, and Data Analytics. I am passionate about problem-solving, building real-world projects, and continuous learning. My work spans across full-stack development, machine learning, and productivity-focused apps.
          </p>
        </motion.div>

        {/* Education */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 lg:mt-16"
        >
          <h3 className="font-['Inter',_sans-serif] text-xl sm:text-2xl text-[#f8f7f9] mb-6 lg:mb-8">
            EDUCATION
          </h3>
          <div className="max-w-4xl space-y-6 lg:space-y-8">
            {[
              {
                title: "B.Tech CSE (AI & DS) — Vishnu Institute of Technology, Bhimavaram",
                details: "GPA: 8.09 | Expected 2027"
              },
              {
                title: "Intermediate (MPC) — Sri Chaitanya College, Chittoor",
                details: "85.1% | 2023"
              },
              {
                title: "SSC — Apollo EM High School, Palakollu",
                details: "92% | 2021"
              }
            ].map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ x: 10 }}
                className="border-l-2 border-[#f8f7f9]/20 pl-6 hover:border-[#f8f7f9]/50 transition-colors duration-300"
              >
                <h4 className="font-['Inter',_sans-serif] text-lg sm:text-xl lg:text-2xl text-[rgba(248,247,249,0.8)] mb-1">
                  {edu.title}
                </h4>
                <p className="font-['Inter',_sans-serif] text-base sm:text-lg lg:text-xl text-[rgba(248,247,249,0.5)]">
                  {edu.details}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const skillCategories = [
    {
      title: "Programming",
      skills: ["C", "Python", "Java"]
    },
    {
      title: "Frontend",
      skills: ["HTML", "CSS", "JavaScript"]
    },
    {
      title: "Frameworks & Libraries",
      skills: ["React", "Tailwind CSS", "Flutter", "NumPy", "Pandas"]
    },
    {
      title: "Design Tools",
      skills: ["Figma", "Canva"]
    },
    {
      title: "Other Tools",
      skills: ["Tableau", "MS Excel", "PowerPoint", "Word"]
    },
    {
      title: "Soft Skills",
      skills: ["Teamwork", "Adaptability", "Time Management"]
    },
    {
      title: "Interests",
      skills: ["Web Development", "Data Science", "AI/ML", "UI/UX"]
    }
  ];

  return (
    <section id="skills" className="py-12 sm:py-16 lg:py-20 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1 
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-['Inter',_sans-serif] text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-[#f8f7f9] mb-8 lg:mb-12"
        >
          Skills
        </motion.h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {skillCategories.map((category, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="space-y-4"
            >
              <h3 className="font-['Inter',_sans-serif] text-xl sm:text-2xl text-[#f8f7f9]">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skillIndex}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: index * 0.1 + skillIndex * 0.05 }}
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(248, 247, 249, 0.15)', y: -2 }}
                    className="bg-[#f8f7f9]/10 border border-[#f8f7f9]/20 px-3 py-2 rounded-lg font-['Inter',_sans-serif] text-sm sm:text-base text-[rgba(248,247,249,0.7)] cursor-default transition-all duration-200"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceItem({ title, period, description, index }: { title: string; period: string; description: string; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="max-w-4xl relative group"
    >
      <motion.div 
        whileHover={{ x: 10 }}
        className="border-l-4 border-[#f8f7f9]/30 pl-6 lg:pl-8 hover:border-[#f8f7f9]/60 transition-colors duration-300"
      >
        <h4 className="font-['Inter',_sans-serif] text-lg sm:text-xl lg:text-2xl text-[rgba(248,247,249,0.8)] mb-1">
          {title}
        </h4>
        <p className="font-['Inter',_sans-serif] text-base sm:text-lg lg:text-xl text-[rgba(248,247,249,0.5)] mb-3">
          {period}
        </p>
        <p className="font-['Inter',_sans-serif] text-base sm:text-lg lg:text-xl text-[rgba(248,247,249,0.5)] leading-[1.6]">
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
}

function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const projects = [
    {
      title: "Personal Portfolio Website",
      tech: "React, Tailwind CSS",
      description: "A modern, responsive portfolio website featuring reusable components and clean UI/UX design. Built to showcase projects, skills, and achievements with smooth navigation and dark theme aesthetics."
    },
    {
      title: "CineMate – Movie Wishlist Tracker",
      tech: "Node.js, Firebase Auth, Firebase Realtime DB, HTML, CSS, JS",
      description: "A comprehensive movie tracking application with secure user authentication and cross-device synchronization. Features include wishlist management, movie discovery, and real-time data updates across devices."
    },
    {
      title: "AgriVision – Crop Recommendation System",
      tech: "Python (ML Model), Flask backend",
      description: "An intelligent agricultural solution that provides smart crop suggestions using machine learning algorithms. Built with Python for data processing and Flask for backend services, with plans for future mobile app integration."
    },
    {
      title: "Brick – Productivity & Habit Tracker",
      tech: "React, TypeScript, Tailwind CSS, Radix UI",
      description: "A comprehensive productivity application combining task management with habit tracking. Features an intuitive dashboard for monitoring progress, setting goals, and maintaining productive routines."
    }
  ];

  return (
    <section id="projects" className="py-12 sm:py-16 lg:py-20 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1 
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-['Inter',_sans-serif] text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-[#f8f7f9] mb-8 lg:mb-12"
        >
          Projects
        </motion.h1>
        
        <div className="space-y-6 lg:space-y-8">
          {projects.map((project, index) => (
            <ProjectItem
              key={index}
              index={index}
              title={project.title}
              tech={project.tech}
              description={project.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectItem({ title, tech, description, index }: { title: string; tech: string; description: string; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="max-w-4xl relative group"
    >
      <motion.div 
        whileHover={{ x: 10 }}
        className="pl-6 lg:pl-8 relative"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
          whileHover={{ scale: 1.5 }}
          className="absolute left-[-9px] top-[12px] w-[15px] h-[15px] bg-white/80 rounded-full backdrop-blur-sm" 
          style={{ filter: 'blur(0.5px)' }} 
        />
        <h3 className="font-['Inter',_sans-serif] text-lg sm:text-xl lg:text-2xl text-[rgba(248,247,249,0.8)] mb-1">
          {title}
        </h3>
        <p className="font-['Inter',_sans-serif] text-base sm:text-lg lg:text-xl text-[rgba(248,247,249,0.5)] mb-3">
          Tech: {tech}
        </p>
        <p className="font-['Inter',_sans-serif] text-base sm:text-lg lg:text-xl text-[rgba(248,247,249,0.5)] leading-[1.6]">
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
}

function ExperienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="py-12 sm:py-16 lg:py-20 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1 
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-['Inter',_sans-serif] text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-[#f8f7f9] mb-8 lg:mb-12"
        >
          Experience
        </motion.h1>
        
        <div className="max-w-4xl">
          <ExperienceItem
            index={0}
            title="DATA SCIENCE INTERN"
            period="Smartbridge — 2 months"
            description="Built comprehensive dashboards using Tableau for data visualization and analysis. Performed data cleaning, preprocessing, and exploratory data analysis on large datasets. Created insightful visualizations and reports that provided actionable business insights. Collaborated with cross-functional teams to understand data requirements and deliver analytical solutions."
          />
        </div>
      </div>
    </section>
  );
}

function ContactsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const contacts = [
    {
      label: "Email",
      value: "kaligotlasridattasai18@gmail.com",
      href: "mailto:kaligotlasridattasai18@gmail.com"
    },
    {
      label: "LinkedIn",
      value: "www.linkedin.com/in/kaligotla-sri-datta-sai-vithal-01bb2a321",
      href: "https://www.linkedin.com/in/kaligotla-sri-datta-sai-vithal-01bb2a321"
    },
    {
      label: "GitHub",
      value: "https://github.com/Sridattasai18",
      href: "https://github.com/Sridattasai18"
    }
  ];

  return (
    <section id="contacts" className="py-12 sm:py-16 lg:py-20 relative" role="contentinfo" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1 
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-['Inter',_sans-serif] text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-[#f8f7f9] mb-8 lg:mb-12"
        >
          Contacts
        </motion.h1>
        
        <address className="space-y-4 lg:space-y-6 max-w-4xl not-italic">
          {contacts.map((contact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <span className="font-['Inter',_sans-serif] text-lg sm:text-xl lg:text-2xl text-[rgba(248,247,249,0.8)]">
                {contact.label} - 
              </span>
              <motion.a 
                href={contact.href}
                target={contact.label !== "Email" ? "_blank" : undefined}
                rel={contact.label !== "Email" ? "noopener noreferrer" : undefined}
                whileHover={{ x: 5, color: 'rgba(248, 247, 249, 1)' }}
                className="font-['Inter',_sans-serif] text-lg sm:text-xl lg:text-2xl text-[rgba(248,247,249,0.5)] hover:text-[#f8f7f9] transition-colors duration-200 inline-block break-all"
              >
                {contact.value}
              </motion.a>
            </motion.div>
          ))}
        </address>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 lg:mt-16 pt-8 border-t border-white/10"
        >
          <p className="text-center font-['Inter',_sans-serif] text-sm sm:text-base text-[rgba(248,247,249,0.4)]">
            © {new Date().getFullYear()} Kaligotla Sri Datta Sai Vithal. All rights reserved.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="bg-[#1f1f1f] min-h-screen text-white">
      <Navigation />
      <main role="main">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactsSection />
      </main>
    </div>
  );
}
