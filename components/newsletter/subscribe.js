import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import React, { useState } from "react";

const Subscribe = ({ translation }) => {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");
  const [errorMsg, setErrorMsg] = useState(null);

  const subscribe = async (e) => {
    e.preventDefault();

    setErrorMsg(null);
    setState("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setState("success");
        setEmail("");
      } else {
        const errorData = await response.json();
        setErrorMsg(errorData.error || "Errore imprevisto");
        setState("error");
      }
    } catch (e) {
      setErrorMsg("An error occurred while subscribing.");
      setState("error");
    }
  };

  return (
    <div className=" text-[#2c395b] w-full lg:w-4/5">
      <h2 className="mb-4 text-4xl font-bold lg:text-6xl">
        What&apos;s your email?
      </h2>
      <p className="mb-6 text-xl text-para">{translation?.paragrafo}</p>
      <form onSubmit={subscribe} className="flex flex-wrap">
        <div className="w-4/5 mb-4 mr-2 lg:w-3/4">
          <input
            required
            id="email-input"
            name="email"
            type="email"
            placeholder="name@email.it"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="">
          <button
            disabled={state === "Loading"}
            type="submit"
            className={`w-full p-1 font-bold text-white border-[#C9573C] border rounded-sm ${
              state === "Loading" ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {state === "Loading" ? (
              "Loading..."
            ) : (
              <Icon
                icon="stash:arrow-right-light"
                width="24px"
                height="24px"
                className="text-principle"
              />
            )}
          </button>
        </div>
      </form>
      <p className="mt-2 text-[11px] text-para/80">
        Niente spam. Solo contenuti esclusivi e aggiornamenti sui tour. Puoi
        cancellarti quando vuoi. Leggi la
        <Link
          href="https://www.iubenda.com/privacy-policy/15052201"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 underline"
        >
          Privacy Policy
        </Link>{" "}
        per saperne di più.
      </p>
      {state === "Error" && <p className="py-4 text-red-600">{errorMsg}</p>}
      {state === "Success" && (
        <p className="py-4 text-green-600">
          Awesome, you&apos;ve been subscribed!
        </p>
      )}
    </div>
  );
};

export default Subscribe;
