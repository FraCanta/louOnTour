import Link from "next/link";
import Image from "next/image";
//to use Image with an external url, add some config on next.config.js
//for more info, check out these docs https://nextjs.org/docs/basic-features/image-optimization
import Siena from "../../public/assets/locationTour/siena/siena1.jpg";

import { getDate } from "../../utils/utils";
import Cta from "../button/button";

export default function Post({ post, featuredMedia }) {
  console.log(post);
  return (
    <div className="card w-full lg:w-96  shadow-xl">
      <Link href={`/posts/${post?.slug}`}>
        <figure>
          <Image
            src={
              featuredMedia?.["media_details"]?.sizes?.medium?.["source_url"] ||
              Siena
            }
            width={240}
            height={250}
            alt={featuredMedia?.["alt_text"] || "LouOnTour image"}
            className="w-auto h-[250px] object-contain rounded-t-lg"
            priority
          />
        </figure>
      </Link>

      <div className="card-body">
        <div className="py-2">
          <small className="badge badge-info badge-lg text-white">
            {getDate(post?.date)}
          </small>
        </div>
        <Link href={`/posts/${post?.slug}`}>
          <h5
            className="card-title text-black pb-2 hover:underline"
            dangerouslySetInnerHTML={{ __html: post?.title?.rendered }}
          ></h5>
        </Link>
        <p dangerouslySetInnerHTML={{ __html: post?.excerpt?.rendered }}></p>
        <div className="card-actions justify-end">
          <Link href={`/posts/${post?.slug}`}>
            <Cta>See more</Cta>
          </Link>
        </div>
      </div>
    </div>
  );
}
