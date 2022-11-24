import React, { useState } from "react";
import ReactCurvedText from "react-curved-text";

const ContactForm = () => {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [form, setForm] = useState("");

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (inputs.name && inputs.email && inputs.message) {
      setForm({ state: "loading" });
      try {
        const res = await fetch(`api/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputs),
        });

        const { error } = await res.json();

        if (error) {
          setForm({
            state: "error",
            message: error,
          });
          return;
        }

        setForm({
          state: "Fatto",
          message:
            "Il tuo messaggio è stato inviato. Grazie per averci contattato!",
        });
        setInputs({
          name: "",
          email: "",
          message: "",
        });
      } catch (error) {
        setForm({
          state: "Errore ",
          message: "Qualcosa è andato storto",
        });
      }
    }
  };
  return (
    <div className="w-full 2xl:w-4/5 container mx-auto py-10">
      <div className="h-[700px] w-full bgForm overflow-x-hidden">
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
          <form
            className=" w-full xl:w-[580px] xl:h-[565px] border border-[#FE6847] bg-white z-10 p-10 "
            onSubmit={(e) => onSubmitForm(e)}
          >
            <p className="ml-20 text-[#232F37] font-bold">
              Scrivimi quale tour hai scelto e ti contatterò presto!
            </p>
            <div className="mt-4">
              <label htmlFor="name" className="input_name mb-2 ">
                Nome
              </label>
              <input
                id="name"
                type="text"
                value={inputs.name}
                onChange={handleChange}
                className="inputField w-full p-3 bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block mt-2"
                placeholder="write your name"
                required
              />{" "}
            </div>
            <div className="mt-4">
              <label htmlFor="email">E-mail </label>
              <input
                id="email"
                type="email"
                value={inputs.email}
                onChange={handleChange}
                className="inputField w-full p-3 bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block mt-2"
                placeholder="esempio@email.com"
                required
              />
            </div>
            <div className="mt-4">
              <label htmlFor="message">Messaggio</label>
              <textarea
                id="message"
                type="text"
                value={inputs.message}
                onChange={handleChange}
                className="inputField w-full p-3 bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block mt-2"
                rows="5"
                required
              />
            </div>

            <input
              type="submit"
              className="bg-[#FE6847] p-3 mt-4 text-white border border-[#FE6847] rounded-xl hover:scale-105"
            />
            {form.state === "loading" ? (
              <div>Invio in corso....</div>
            ) : form.state === "error" ? (
              <div>{form.message}</div>
            ) : (
              form.state === "success" && (
                <div>Inviato correttamente, grazie per averci contattato.</div>
              )
            )}
          </form>
          <div className="block absolute -left-[60px] lg:left-[42%] top-[0%] rotate_text z-10">
            <ReactCurvedText
              width={180}
              height={180}
              cx={90}
              cy={90}
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
