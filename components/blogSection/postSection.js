import React from "react";
import Link from "next/link";
//to use Image with an external url, add some config on next.config.js
//for more info, check out these docs https://nextjs.org/docs/basic-features/image-optimization
import Siena from "../../public/assets/locationTour/siena/siena2.jpg";

import { getDate } from "../../utils/utils";
import Cta from "../button/button";

export default function PostSection({ post, featuredMedia }) {
  // console.log(post);
  return (
    <div className="card w-full lg:w-50 lg:h-[20rem]  shadow-xl mb-6 lg:mb-2 mr-4 bg-white text-black ">
      <div className="card-body !p-8  !justify-between">
        <div>
          <small className="badge badge-info badge-lg text-white text-xs">
            {getDate(post?.date)}
          </small>
        </div>
        <Link href={`/posts/${post?.slug}`}>
          <h5
            className="card-title text-[#2C395B]  hover:underline text-base"
            dangerouslySetInnerHTML={{ __html: post?.title?.rendered }}
          ></h5>
        </Link>
        <div
          dangerouslySetInnerHTML={{ __html: post?.excerpt?.rendered }}
          className="xl:text-[0.85rem] text-xs line-clamp2"
        ></div>
        {/* <div className="card-actions justify-end">
          <Link href={`/posts/${post?.slug}`} className="link">
            See more
          </Link>
        </div> */}
      </div>
    </div>
  );
}
