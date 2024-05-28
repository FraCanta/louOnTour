import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getDate } from "../../utils/utils";
const RecentPostCol = ({ post, featuredMedia }) => {
  return (
    <div className="w-full flex gap-2">
      <div className="relative w-1/3 aspect-video ">
        <Link href={`/posts/${post?.slug}`}>
          <Image
            src={featuredMedia?.["media_details"]?.sizes?.full?.["source_url"]}
            alt={featuredMedia?.["alt_text"] || "thalliondev image"}
            fill
            className="object-cover w-full h-full"
            priority
            quality={70}
          />
        </Link>
      </div>
      <div className="w-full flex flex-col ">
        <small className=" text-principle py-2 fxl:text-base">
          {getDate(post?.date)}
        </small>
        <Link href={`/posts/${post?.slug}`} title={`${post?.title?.rendered}`}>
          <p
            className="font-bold text-principle capitalize text-[1.4rem] lg:text-3xl leading-[1.8rem] xl:text-lg fxl:text-3xl 3xl:text-4xl py-2"
            dangerouslySetInnerHTML={{ __html: post?.title?.rendered }}
          ></p>
        </Link>
      </div>
    </div>
  );
};

export default RecentPostCol;
