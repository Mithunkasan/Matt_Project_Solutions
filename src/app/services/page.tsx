"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UtilityHeader } from "@/components/landing/tnpsc/UtilityHeader";
import { IdentityHeader } from "@/components/landing/tnpsc/IdentityHeader";
import { AnnouncementBar } from "@/components/landing/tnpsc/AnnouncementBar";
import { NavigationMenu } from "@/components/landing/tnpsc/NavigationMenu";
import { RedesignedFooter } from "@/components/landing/tnpsc/RedesignedFooter";
import { 
  GraduationCap, 
  Code, 
  Cpu, 
  Layers, 
  Activity, 
  Smartphone, 
  BookOpen, 
  Globe, 
  Palette, 
  Briefcase, 
  FileText, 
  Wrench, 
  Check, 
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function ServicesPage() {
  const [language, setLanguage] = useState<"en" | "ta">("en");
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [themeColor, setThemeColor] = useState<"blue" | "red" | "green" | "black" | "grey">("blue");


  const fontSizeClassMap = {
    small: "text-base",
    medium: "text-lg",
    large: "text-xl",
  };

  const containerStyleMap = {
    blue: "bg-slate-50 text-gray-900",
    red: "bg-slate-50 text-gray-900",
    green: "bg-slate-50 text-gray-900",
    black: "bg-neutral-950 text-yellow-400 dark",
    grey: "bg-slate-100 text-slate-900",
  };

  const textThemeMap = {
    blue: "text-[#12498b]",
    red: "text-[#b12222]",
    green: "text-[#1e6b3c]",
    black: "text-black dark:text-white",
    grey: "text-slate-700 dark:text-slate-300",
  };


  const accentBgThemeMap = {
    blue: "bg-[#e6effc] text-[#12498b]",
    red: "bg-[#fdebeb] text-[#b12222]",
    green: "bg-[#eaf7ee] text-[#1e6b3c]",
    black: "bg-neutral-800 text-yellow-400",
    grey: "bg-slate-100 text-slate-700",
  };

  const servicesList = [
    {
      title: "Academic Project Development",
      description: "We develop innovative and industry-oriented academic projects tailored to university guidelines and student requirements.",
      icon: <GraduationCap className="w-6 h-6" />,
      subItems: [
        { title: "Services Include", items: ["Mini Projects", "Final Year Projects", "IEEE Projects", "Non-IEEE Projects", "Real-Time Industry Projects", "Customized Academic Projects", "Live Project Development", "End-to-End Documentation Support"] }
      ]
    },
    {
      title: "Software Development Services",
      description: "We build modern, scalable, and secure software applications using the latest technologies.",
      icon: <Code className="w-6 h-6" />,
      subItems: [
        { title: "Technologies", items: ["Next.js", "React.js", "TypeScript", "Node.js", "Express.js", "Python", "Django", "Java", "Spring Boot", "PHP", "Laravel"] },
        { title: "Solutions", items: ["Web Applications", "Enterprise Software", "Admin Dashboards", "CRM Systems", "ERP Solutions", "Portfolio Websites", "Business Websites", "REST APIs"] }
      ]
    },
    {
      title: "AI & Machine Learning Projects",
      description: "Our AI solutions help students and organizations implement intelligent automation and predictive systems.",
      icon: <Cpu className="w-6 h-6" />,
      subItems: [
        { title: "Services", items: ["Machine Learning Models", "Deep Learning Projects", "Computer Vision", "NLP Applications", "Chatbots", "Recommendation Systems", "Predictive Analytics", "Data Classification", "Image Processing"] }
      ]
    },
    {
      title: "Blockchain Development",
      description: "We develop secure blockchain-based applications with decentralized architecture.",
      icon: <Layers className="w-6 h-6" />,
      subItems: [
        { title: "Solutions", items: ["Ethereum Smart Contracts", "Solidity Development", "Web3 Integration", "MetaMask Integration", "NFT Applications", "Decentralized Applications (DApps)", "Token Development", "Secure Authentication Systems"] }
      ]
    },
    {
      title: "IoT Solutions",
      description: "Design and implementation of Internet of Things projects for real-time monitoring and automation.",
      icon: <Activity className="w-6 h-6" />,
      subItems: [
        { title: "Services", items: ["Smart Healthcare", "Smart Agriculture", "Smart Home Automation", "Industrial IoT", "Sensor Integration", "Raspberry Pi Projects", "Arduino Projects", "ESP32 Development", "Cloud IoT Integration"] }
      ]
    },
    {
      title: "Mobile Application Development",
      description: "We create high-performance mobile applications with excellent user experience.",
      icon: <Smartphone className="w-6 h-6" />,
      subItems: [
        { title: "Platforms", items: ["Android Applications", "iOS Applications", "Flutter Apps", "React Native Apps", "Cross-Platform Solutions", "Mobile Backend APIs"] }
      ]
    },
    {
      title: "Research & Thesis Assistance",
      description: "Professional support for research scholars throughout their academic journey.",
      icon: <BookOpen className="w-6 h-6" />,
      subItems: [
        { title: "Services", items: ["Research Proposal Writing", "Literature Review", "Thesis Development", "Dissertation Writing", "Research Paper Writing", "Journal Paper Formatting", "Plagiarism Checking", "Grammar Review", "Publication Assistance"] }
      ]
    },
    {
      title: "Website Design & Development",
      description: "Professional website development services for startups, businesses, and educational institutions.",
      icon: <Globe className="w-6 h-6" />,
      subItems: [
        { title: "Website Types", items: ["Business Websites", "Educational Websites", "E-Commerce Platforms", "Portfolio Websites", "Landing Pages", "Hospital Management Systems", "School & College Portals", "Custom CMS Development"] }
      ]
    },
    {
      title: "UI/UX Design",
      description: "Beautiful and user-friendly interface design focused on usability and accessibility.",
      icon: <Palette className="w-6 h-6" />,
      subItems: [
        { title: "Services", items: ["Responsive UI Design", "Dashboard Design", "Wireframing", "Prototyping", "Mobile UI", "Web UI", "Accessibility Optimization", "Design System Creation"] }
      ]
    },
    {
      title: "Internship & Training Programs",
      description: "Industry-oriented training programs designed to improve practical skills.",
      icon: <Briefcase className="w-6 h-6" />,
      subItems: [
        { title: "Programs", items: ["Python Full Stack", "Java Full Stack", "MERN Stack", "MEAN Stack", "Data Science", "Artificial Intelligence", "Machine Learning", "Cloud Computing", "DevOps", "Blockchain", "UI/UX Design", "Aptitude & Interview Preparation"] }
      ]
    },
    {
      title: "Documentation Services",
      description: "Complete project documentation prepared according to university standards.",
      icon: <FileText className="w-6 h-6" />,
      subItems: [
        { title: "Includes", items: ["Synopsis", "Abstract", "UML Diagrams", "SRS Documentation", "Project Reports", "PPT Preparation", "Viva Questions & Answers", "User Manual", "Installation Guide"] }
      ]
    },
    {
      title: "Technical Support & Maintenance",
      description: "Continuous assistance even after project delivery.",
      icon: <Wrench className="w-6 h-6" />,
      subItems: [
        { title: "Support Includes", items: ["Bug Fixes", "Feature Enhancements", "Project Deployment", "Server Configuration", "Database Backup", "Performance Optimization", "Technical Consultation", "Source Code Explanation"] }
      ]
    }
  ];

  const whyChooseUs = [
    "Experienced Development Team",
    "Industry Standard Technologies",
    "100% Customized Solutions",
    "Affordable Pricing",
    "On-Time Delivery",
    "Secure & Scalable Development",
    "Regular Progress Updates",
    "Live Project Demonstrations",
    "Dedicated Technical Support",
    "Complete Documentation",
    "Internship & Placement Assistance",
    "Client Satisfaction Focus"
  ];

  const steps = [
    { title: "Requirement Analysis", desc: "Understand client requirements, objectives, and project scope." },
    { title: "Planning", desc: "Prepare project architecture, technology stack, and implementation roadmap." },
    { title: "Design", desc: "Develop UI/UX prototypes and database architecture." },
    { title: "Development", desc: "Implement frontend, backend, APIs, database, and required integrations." },
    { title: "Testing", desc: "Perform functionality, security, performance, and usability testing." },
    { title: "Documentation", desc: "Prepare complete reports, user manuals, and technical documentation." },
    { title: "Deployment", desc: "Deploy the application to the production environment." },
    { title: "Support", desc: "Provide continuous maintenance, updates, and technical assistance." }
  ];

  const technologies = [
    { title: "Frontend", items: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React.js", "Next.js", "Tailwind CSS", "Material UI"] },
    { title: "Backend", items: ["Node.js", "Express.js", "Python", "Django", "Java", "Spring Boot", "PHP", "Laravel"] },
    { title: "Database", items: ["PostgreSQL", "MySQL", "MongoDB", "Firebase"] },
    { title: "Cloud & DevOps", items: ["Git", "GitHub", "Docker", "Vercel", "Netlify", "AWS"] },
    { title: "Blockchain", items: ["Solidity", "Ethereum", "Web3.js", "Ethers.js", "MetaMask"] },
    { title: "AI & Data Science", items: ["TensorFlow", "PyTorch", "Scikit-learn", "OpenCV", "Pandas", "NumPy"] }
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-all duration-300 ${fontSizeClassMap[fontSize]} ${containerStyleMap[themeColor]}`}>
      <UtilityHeader
        language={language}
        setLanguage={setLanguage}
        fontSize={fontSize}
        setFontSize={setFontSize}
        themeColor={themeColor}
        setThemeColor={setThemeColor}
      />
      <IdentityHeader language={language} themeColor={themeColor} />
      <AnnouncementBar language={language} themeColor={themeColor} />
      <NavigationMenu language={language} themeColor={themeColor} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12 space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-4xl mx-auto py-6">
          <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${textThemeMap[themeColor]} leading-tight`}>
            Our Services
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
            At Matt Project Solutions, we provide end-to-end academic and technical project development services for diploma, undergraduate, postgraduate, and research scholars. Our experienced team delivers high-quality, customized solutions with continuous guidance from project selection to final submission.
          </p>
          <div className="h-1.5 w-24 bg-yellow-400 mx-auto rounded-full mt-4"></div>
        </section>

        {/* 12 Services Grid */}
        <section className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.map((service, sIdx) => (
              <div 
                key={sIdx} 
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`p-3 rounded-lg ${accentBgThemeMap[themeColor]} w-fit`}>
                    {service.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed text-justify">
                    {service.description}
                  </p>
                  
                  {service.subItems.map((sub, subIdx) => (
                    <div key={subIdx} className="pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 border-b pb-1">
                        {sub.title}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {sub.items.map((item, itemIdx) => (
                          <span 
                            key={itemIdx} 
                            className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-medium ${accentBgThemeMap[themeColor]}`}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xs space-y-8">
          <div className="text-center space-y-2">
            <h3 className={`text-2xl sm:text-3xl font-extrabold uppercase tracking-wider ${textThemeMap[themeColor]}`}>
              Why Choose Matt Project Solutions?
            </h3>
            <div className="h-1 w-20 bg-yellow-400 mx-auto rounded-full"></div>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyChooseUs.map((reason, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <span className={`p-0.5 rounded-full ${accentBgThemeMap[themeColor]} mt-1 flex-shrink-0`}>
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Our Development Process */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h3 className={`text-2xl sm:text-3xl font-extrabold uppercase tracking-wider ${textThemeMap[themeColor]}`}>
              Our Development Process
            </h3>
            <div className="h-1 w-20 bg-yellow-400 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-150 dark:border-gray-700 shadow-2xs relative flex flex-col justify-between"
              >
                <div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${accentBgThemeMap[themeColor]} w-fit mb-2 block`}>
                    Step {idx + 1}
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed text-justify">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technologies We Work With */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h3 className={`text-2xl sm:text-3xl font-extrabold uppercase tracking-wider ${textThemeMap[themeColor]}`}>
              Technologies We Work With
            </h3>
            <div className="h-1 w-20 bg-yellow-400 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xs space-y-4"
              >
                <h4 className="font-bold text-sm sm:text-base uppercase tracking-wider border-b pb-2 text-gray-900 dark:text-white flex items-center justify-between">
                  <span>{tech.title}</span>
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tech.items.map((item, itemIdx) => (
                    <span 
                      key={itemIdx} 
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${accentBgThemeMap[themeColor]}`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#12498b] to-[#12498b]/90 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h3 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-wide leading-tight">
                Transform Your Ideas into Innovative Solutions
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-200 leading-relaxed text-justify sm:text-center">
                Whether you&apos;re a student looking for academic project guidance, a researcher seeking publication support, or a business planning a digital solution, Matt Project Solutions is here to help. Our expert team is committed to delivering reliable, innovative, and high-quality solutions tailored to your goals. Contact us today to discuss your requirements and take the next step toward success.
              </p>
              <div className="pt-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center space-x-2 px-8 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-lg shadow-md transition-all hover:scale-103"
                >
                  <span>Contact Us Today</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <RedesignedFooter language={language} themeColor={themeColor} />
    </div>
  );
}
