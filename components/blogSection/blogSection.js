import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import PostSection from "./postSection";
import Post from "../Post/post";
import CtaWhite from "../button/CtaWhite";
import { MaskText } from "../UI/MaskText";
import CtaOutline from "../button/CtaOutline";

const BlogSection = ({ post, featuredMedia, tags, translation }) => {
  const jsxPosts = post.map((p, i) => {
    const featuredMedia = p?.["_embedded"]?.["wp:featuredmedia"][0];
    return (
      // <PostSection post={p} featuredMedia={featuredMedia} key={i} id={p?.id} />
      <Post post={p} featuredMedia={featuredMedia} key={i} id={p?.id} />
    );
  });
  return (
    <div className="bg-[#fff8f4] min-h-[38vh] lg:min-h-[68vh] qhd:min-h-[76vh] 3xl:min-h-[80vh] w-full text-[#f1f1f1] flex items-center justify-center overflow-x-hidden py-20 qhd:py-32">
      <div className="grid w-11/12 qhd:max-w-[2304px] h-full grid-cols-1 gap-6 qhd:gap-10 mx-auto lg:justify-items-center lg:content-center">
        <div className="flex flex-col items-center gap-2 lg:text-center">
          <h2 className="text-base lg:text-xl qhd:text-[1.55rem] font-semibold px-3 lg:px-4 qhd:px-5 py-2 qhd:py-3 bg-[#CE9486]/20 rounded-full max-w-max tracking-wide">
            {translation?.subTitle}
          </h2>
          <MaskText>
            <h2 className="text-3xl md:text-5xl qhd:text-[4.4rem] 3xl:text-[100px] font-bold md:leading-none lg:leading-none qhd:leading-[4.9rem] mb-10 qhd:mb-14 text-principle">
              {translation?.title}
            </h2>
          </MaskText>
        </div>
        <div className="grid grid-cols-1 gap-4 qhd:gap-7 lg:grid-cols-3 lg:py-10">
          {jsxPosts}
        </div>
        <CtaOutline link="/blog">{translation?.button}</CtaOutline>
      </div>
    </div>
  );
};

export default BlogSection;
