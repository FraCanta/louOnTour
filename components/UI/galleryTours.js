import React from "react";
import Image from "next/image";
import Lou from "../../public/assets/lou.jpg";

const GalleryTours = ({ city }) => {
  return (
    <div className="min-h-[50vh] ">
      <div className="container w-full md:w-4/5 mx-auto md:pt-2 h-full">
        <section className="galeria">
          <h2>Gallery</h2>
          <div className="item">
            <a href="#imagem1">
              <Image src={Lou} alt="" />
            </a>
          </div>
          <div className="item">
            <a href="#imagem2">
              <Image src={Lou} alt="" />
            </a>
          </div>
          <div className="item">
            <a href="#imagem3">
              <Image src={Lou} alt="" />
            </a>
          </div>
        </section>

        <div className="lightboxes">
          <div className="lightbox" id="imagem1">
            <a href="#" className="fechar">
              &times;
            </a>
            <div className="conteudo">
              <Image src={Lou} alt="" />
              <p>Foto 1</p>
            </div>
          </div>
          <div className="lightbox" id="imagem2">
            <a href="#" className="fechar">
              &times;
            </a>
            <div className="conteudo">
              <Image src={Lou} alt="" />
              <p>Foto 2</p>
            </div>
          </div>
          <div className="lightbox" id="imagem3">
            <a href="#" className="fechar">
              &times;
            </a>
            <div className="conteudo">
              <Image src={Lou} alt="" />
              <p>Foto 3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryTours;
