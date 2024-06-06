import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import PostSection from "./postSection";
import Post from "../Post/post";
import CtaWhite from "../button/CtaWhite";
import { MaskText } from "../UI/MaskText";

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
      <div className="grid   grid-cols-1 w-11/12 mx-auto  lg:justify-items-center lg:content-center  h-full gap-6">
        <div className="lg:text-center">
          <h3 className="text-[#FE6847] text-xl 3xl:text-4xl font-bold">
            {translation?.subTitle}
          </h3>
          <MaskText>
            <h2 className="text-4xl md:text-[64px] 3xl:text-[100px] font-bold  md:leading-none lg:leading-none mb-10 text-white">
              {translation?.title}
            </h2>
          </MaskText>
        </div>
        <div className="grid grid-cols-1  lg:grid-cols-4 gap-6 lg:py-10">
          {jsxPosts}
        </div>
        <div className="">
          <CtaWhite link="/blog">{translation?.button}</CtaWhite>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
