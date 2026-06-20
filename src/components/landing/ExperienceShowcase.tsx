"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";

export function ExperienceShowcase() {
  return (
    <section className="bg-white dark:bg-gray-950 flex flex-col items-center justify-center overflow-hidden py-10">
      <ContainerScroll
        titleComponent={
          <>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
               Engineering Excellence <br />
              <span className="text-4xl md:text-[6rem] font-extrabold mt-1 leading-none text-[#12498b] dark:text-blue-400">
                Starts Here.
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mt-6 mb-10">
              From concept to documentation, we provide the ultimate platform for 
              students to master the latest technologies and deliver grade-A projects.
            </p>
          </>
        }
      >
        <div className="relative h-full w-full bg-slate-900 overflow-hidden">
             {/* Mock Dashboard / Project Showcase */}
            <Image
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" 
                alt="Projects Showcase"
                fill
                className="object-cover object-top"
                draggable={false}
            />
            {/* Overlay features */}
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="max-w-md">
                        <h3 className="text-2xl md:text-3xl font-bold mb-2">Build. Innovative. Scale.</h3>
                        <p className="text-sm md:text-base text-gray-300">
                            Our solutions cover Web, AI, ML, Python, Java, Blockchain, and IoT.
                            Join 5000+ successful students across Tamil Nadu.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="px-6 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
                            <span className="font-bold">100% Success</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </ContainerScroll>
    </section>
  );
}
