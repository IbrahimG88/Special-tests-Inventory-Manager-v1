import React, { useState, useEffect } from "react";
import Image from "next/image";
import anime from "animejs";

const SplashScreen = ({ finishLoading }) => {
  const [isMounted, setIsMounted] = useState(false);
  const animate = () => {
    const loader = anime.timeline({
      complete: () => finishLoading(),
    });

    loader
      .add({
        targets: "#logo",
        delay: 0,
        scale: 1,
        duration: 500,
        easing: "easeInOutExpo",
      })
      .add({
        targets: "#logo",
        delay: 100,
        scale: 1.25,
        duration: 500,
        easing: "easeInOutExpo",
      })
      .add({
        targets: "#logo",
        delay: 1000,
        scale: 0,
        duration: 500,
        easing: "easeInOutExpo",
      });
  };

  useEffect(() => {
    setIsMounted(true);
    animate();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="w-64 h-64 relative">
        <Image src="/splash.jpg" width={700} height={700} alt="Logo" priority />
      </div>
    </div>
  );
};

export default SplashScreen;
