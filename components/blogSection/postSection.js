import React from "react";
import Link from "next/link";
import Image from "next/image";
//to use Image with an external url, add some config on next.config.js
//for more info, check out these docs https://nextjs.org/docs/basic-features/image-optimization
import Siena from "../../public/assets/locationTour/siena/siena2.jpg";

import { getDate } from "../../utils/utils";
import Cta from "../button/button";

export default function PostSection({ post, featuredMedia }) {
  // console.log(post);
  return (
    <div className="card w-full lg:w-50 lg:h-[20rem]  shadow-xl mb-6 lg:mb-2 mr-4 bg-white text-black ">
      {/* <Link href={`/posts/${post?.slug}`}>
        <figure>
          <Image
            src={
              featuredMedia?.["media_details"]?.sizes?.medium?.["source_url"] ||
              Siena
            }
            width={1000}
            height={1000}
            alt={featuredMedia?.["alt_text"] || "LouOnTour image"}
            className="w-full h-[250px] object-cover rounded-t-lg"
            priority
          />
        </figure>
      </Link> */}

      <div className="card-body !p-4">
        <div>
          <small className="badge badge-info badge-lg text-white text-xs">
            {getDate(post?.date)}
          </small>
        </div>
        <Link href={`/posts/${post?.slug}`}>
          <h5
            className="card-title text-black pb-2 hover:underline text-base"
            dangerouslySetInnerHTML={{ __html: post?.title?.rendered }}
          ></h5>
        </Link>
        <div
          dangerouslySetInnerHTML={{ __html: post?.excerpt?.rendered }}
          className="text-sm"
        ></div>
        <div className="card-actions justify-end">
          <Link href={`/posts/${post?.slug}`} className="link">
            See more
          </Link>
        </div>
      </div>
    </div>
  );
}
