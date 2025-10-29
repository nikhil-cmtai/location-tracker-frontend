"use client"
import React from "react"
import Image from "next/image"
import Link from "next/link"


const vehicleImages = [
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
  "/images/4.jpeg",
  "/images/5.jpg",
  "/images/6.jpg",
  "/images/7.jpg",
  "/images/8.jpg",
  "/images/9.jpg",
  "/images/10.png",
  "/images/11.jpg",
  "/images/12.jpg",
  "/images/13.jpg",
  "/images/14.png",
  "/images/15.jpg",
  "/images/16.jpg",
  "/images/17.jpg",
  "/images/18.jpg",
  "/images/19.png",
  "/images/20.jpg",
  "/images/21.jpg",
  "/images/22.jpg",
  "/images/23.jpg",
  "/images/24.png",
  "/images/25.png",
  "/images/26.jpg",
  "/images/27.png"
]

export default function VehicleMarquee() {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-white to-yellow-50 overflow-hidden relative">
      {/* Enhanced heading with better typography and animation */}
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-4 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500">
            Track Any Vehicle
          </span>
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto text-lg">
          Our advanced tracking system works with almost every vehicle on the road
        </p>
      </div>

      {/* Marquee container with relative positioning */}
      <div className="relative w-full overflow-hidden">


        {/* Marquee animation */}
        <div
          className="marquee flex items-center gap-8 w-max animate-marquee hover:[animation-play-state:paused] transition-all duration-300"
          style={{ animationDuration: "90s", animationTimingFunction: "linear", animationIterationCount: "infinite" }}
        >
          {vehicleImages.concat(vehicleImages).map((img, idx) => (
            <div key={img + idx} className="flex flex-col items-center group">
              <div className="relative">
                <Image
                  src={img || "/placeholder.svg"}
                  alt="Vehicle"
                  width={192}
                  height={138}
                  className={`w-38 h-28 md:w-48 md:h-32 rounded-2xl border-4  group-hover:scale-110  transition-all duration-300
                    ${img.includes('bike') || img.includes('activa') ? 'object-fit' : 'object-contain'}`}
                  loading="lazy"
                />
                {/* Glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl blur opacity-0 group-hover:opacity-70 transition duration-300 -z-10"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-6 left-1/4 w-24 h-24 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 right-1/3 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Call to action button */}
      <div className="flex justify-center mt-12">
        <Link href="/login">
          <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-full shadow-lg hover:shadow-orange-300/50 transition-all duration-300 transform hover:-translate-y-1">
            Start Tracking Now
          </button>
        </Link>
      </div>

      <style jsx>{`
        .marquee {
          animation-name: marqueeScroll;
        }
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
