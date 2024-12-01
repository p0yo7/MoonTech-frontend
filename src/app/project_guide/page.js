"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import neorisPlanetImage from "../assets/neoris-planet.png"; // Imagen de transición Neoris Planet
import "./globals.css"; // Estilos específicos

const ProjectPage = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(1);
  const [showTransition, setShowTransition] = useState(false);

  // Array con las 26 imágenes de las slides
  const slides = [
    { id: 1, image: require('../assets/slide1.png'), showSkip: true },
    { id: 2, image: require('../assets/slide2.png'), showSkip: false },
    { id: 3, image: require('../assets/slide3.png'), showSkip: false },
    { id: 4, image: require('../assets/slide4.png'), showSkip: false },
    { id: 5, image: require('../assets/slide5.png'), showSkip: false },
    { id: 6, image: require('../assets/slide6.png'), showSkip: false },
    { id: 7, image: require('../assets/slide7.png'), showSkip: false },
    { id: 8, image: require('../assets/slide8.png'), showSkip: false },
    { id: 9, image: require('../assets/slide9.png'), showSkip: false },
    { id: 10, image: require('../assets/slide10.png'), showSkip: false },
    { id: 11, image: require('../assets/slide11.png'), showSkip: false },
    { id: 12, image: require('../assets/slide12.png'), showSkip: false },
    { id: 13, image: require('../assets/slide13.png'), showSkip: false },
    { id: 14, image: require('../assets/slide14.png'), showSkip: false },
    { id: 15, image: require('../assets/slide15.png'), showSkip: false },
    { id: 16, image: require('../assets/slide16.png'), showSkip: false },
    { id: 17, image: require('../assets/slide17.png'), showSkip: false },
    { id: 18, image: require('../assets/slide18.png'), showSkip: false },
    { id: 19, image: require('../assets/slide19.png'), showSkip: false },
    { id: 20, image: require('../assets/slide20.png'), showSkip: false },
    { id: 21, image: require('../assets/slide21.png'), showSkip: false },
    { id: 22, image: require('../assets/slide22.png'), showSkip: false },
    { id: 23, image: require('../assets/slide23.png'), showSkip: false },
    { id: 24, image: require('../assets/slide24.png'), showSkip: false },
    { id: 24, image: require('../assets/slide25.png'), showSkip: false },
    { id: 26, image: require('../assets/slide26.png'), showSkip: false },
  ];

  const handleContinue = () => {
    if (currentSlide < slides.length) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.push("/menu");
    }
  };

  const handleSkipToWork = () => {
    setShowTransition(true);
    setTimeout(() => {
      router.push("/menu");
    }, 5000); // Mostrar imagen de transición durante 5 segundos
  };

  useEffect(() => {
    if (showTransition) {
      const timer = setTimeout(() => setShowTransition(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showTransition]);

  return (
    <div className="project-page-container">
      {showTransition ? (
        <div className="transition-slide">
          <Image
            src={neorisPlanetImage}
            alt="Neoris Planet Transition"
            className="transition-image"
          />
        </div>
      ) : (
        <div className="slide">
          <Image
            src={slides[currentSlide - 1].image}
            alt={`Slide ${currentSlide}`}
            className="slide-image"
          />
          <div className="buttons-container">
            {slides[currentSlide - 1].showSkip && (
              <button className="skip-button" onClick={handleSkipToWork}>
                Skip to Work
              </button>
            )}
            <button className="continue-button" onClick={handleContinue}>
              {currentSlide === slides.length ? "Claim Reward" : "Continue"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;

