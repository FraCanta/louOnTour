import React from "react";
import ReactCurvedText from "react-curved-text";
import Cta from "../button/button";

const ContactForm = () => {
  return (
    <div className="w-full lg:w-4/5 container mx-auto py-10">
      <div className="h-[700px] w-full bgForm">
        <div className="layerForm1"></div>
        <div className="layerForm2"></div>
        <div className="layerForm3"></div>
        <div className="layerForm4"></div>
        <div className="layerForm5"></div>
        <div className="layerForm6"></div>
        <div className="layerForm7"></div>
        <div className="layerForm8"></div>
        <div className="layerForm9"></div>
        <div className="layerForm10"></div>
        <div className="layerForm11"></div>
        <div className="layerForm12"></div>
        <div className="layerForm13"></div>
        <div className="layerForm14"></div>
        <div className="layerForm15"></div>

        <div className="flex-none lg:flex-1"></div>
        <div className="flex-none w-11/12 mx-auto lg:flex-1 flex items-center">
          <form className="lg:w-[580px] lg:h-[565px] border border-red-700 bg-white z-10 p-10">
            <p className="ml-20 text-[#232F37]">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam
              voluptate mollitia sequi amet neque exercitationem.
            </p>
            <p type="Name:" className="input_name">
              <input placeholder="Write your name here.."></input>
            </p>
            <p type="Email:" className="input_name">
              <input placeholder="Let us know how to contact you back.."></input>
            </p>

            <textarea
              rows="4"
              cols="50"
              name="comment"
              form="usrform"
              type="Message..."
              className="mb-6"
            >
              Write here
            </textarea>
            <Cta>Send Message</Cta>
          </form>
          <div className="block absolute left-[0] lg:left-[52%] top-[14%] -translate-x-1/2  -translate-y-1/2 rotate_text z-10">
            <ReactCurvedText
              width={250}
              height={250}
              cx={120}
              cy={120}
              rx={80}
              ry={80}
              text="Lou On Tour . Lou On Tour . Lou On Tour . Lou On Tour.  "
              textProps={{ style: { fontSize: 25, fill: "#232F37" } }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
