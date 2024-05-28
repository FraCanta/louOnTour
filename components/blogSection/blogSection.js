import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import PostSection from "./postSection";
import Post from "../Post/post";

const BlogSection = ({ post, featuredMedia, tags, translation }) => {
  const jsxPosts = post.map((p, i) => {
    const featuredMedia = p?.["_embedded"]?.["wp:featuredmedia"][0];
    return (
      // <PostSection post={p} featuredMedia={featuredMedia} key={i} id={p?.id} />
      <Post post={p} featuredMedia={featuredMedia} key={i} id={p?.id} />
    );
  });
  return (
    <div className="hero min-h-[38vh] lg:min-h-[68vh] 3xl:min-h-[80vh]  w-full   text-[#f1f1f1] flex items-center  overflow-x-hidden py-20 !grain !bg-[#2C395B]">
      <div className="grid   grid-cols-1 gap-6  justify-items-center content-center  h-full ">
        <div className="text-center">
          <h3 className="text-[#FE6847] text-xl 3xl:text-4xl font-bold">
            {translation?.subTitle}
          </h3>
          <h2 className="text-4xl md:text-[64px] 3xl:text-[100px] font-medium  md:leading-none lg:leading-none mb-10 text-white">
            {translation?.title}
          </h2>
        </div>
        <div className="grid grid-cols-1  lg:grid-cols-4 gap-4 w-11/12  mx-auto">
          {jsxPosts}
        </div>
        <Link
          href="/blog"
          className="flex gap-2 items-center max-w-max text-center text-[#2c395b] lg:text-[21.57px] font-bold leading-snug py-4 px-6 2xl:py-2 2xl:px-6 fxl:py-4 fxl:px-6 3xl:py-6 3xl:px-8 2xl:text-[1.2rem] fxl:text-2xl 3xl:text-3xl rounded-md border-2 bg-white"
        >
          {translation?.button}
          <Icon icon="bi:arrow-right" />
        </Link>
      </div>
    </div>
  );
};

export default BlogSection;
