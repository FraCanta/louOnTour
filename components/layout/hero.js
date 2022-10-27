import React from "react";

const Hero = () => {
  return (
    <main>
      <section className="text-center h-screen flex flex-col items-center hero">
        <div className="title">
          <h2 className="text-[4rem] font-medium text-[#D93280]">
            Tuscan Experience
          </h2>
          <h1 className="text-[15.625rem] font-bold tracking-tighter text-white">
            Lou On Tour{" "}
          </h1>
        </div>

        <p className="w-3/4 mx-auto text-white">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illo
          necessitatibus ipsam, assumenda, modi nam quibusdam error excepturi
          fugit reprehenderit ad earum facilis eveniet? Dignissimos laboriosam
          assumenda ipsum corporis, eius nam!
        </p>
        <button className="text-white">GET STARTED</button>
      </section>
    </main>
  );
};

export default Hero;
