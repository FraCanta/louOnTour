import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import PostSection from "./postSection";

const BlogSection = ({ post, featuredMedia, tags }) => {
  const jsxPosts = post.map((p, i) => {
    const featuredMedia = p?.["_embedded"]?.["wp:featuredmedia"][0];
    return (
      <PostSection post={p} featuredMedia={featuredMedia} key={i} id={p?.id} />
    );
  });
  return (
    <div className="hero min-h-[38vh] lg:min-h-[68vh] 3xl:min-h-[80vh]  w-full   text-[#f1f1f1] flex items-center  overflow-x-hidden py-20 !grain !bg-[#2C395B]">
      <div className="grid  md:gap-14 xl:gap-18 grid-cols-1  justify-items-center content-center w-11/12 2xl:w-4/5 mx-auto h-full ">
        <div className="text-center">
          <h4 className="text-[#FE6847] text-xl 3xl:text-4xl font-bold">
            Blog
          </h4>
          <h2 className="text-4xl md:text-[64px] 3xl:text-[100px] font-medium  md:leading-none lg:leading-none mb-10">
            Ultime News
          </h2>
          <p className="text-base sm:text-lg 2xl:text-xl fxl:text-2xl 3xl:text-3xl   mb-8 ">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Adipisci
            eligendi, aspernatur aperiam itaque perspiciatis vero consectetur
            rerum quae, illum ducimus quos ipsum placeat saepe illo laboriosam
            modi laborum nobis facere.{" "}
          </p>
        </div>
        <div className="flex w-full flex-col lg:flex-row">{jsxPosts}</div>
        <Link href="/blog">
          <div>
            <button className="flex items-center justify-between px-4 w-[9.875rem] h-[3.375rem] rounded-lg relative text-[#FE6847]  font-[600] shadow-3xl border border-2 border-[#FE6847] hover:transition-all hover:bg-white hover:border-white hover:scale-110 uppercase">
              Leggi altri
              <Icon icon="bi:arrow-right" />
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BlogSection;
