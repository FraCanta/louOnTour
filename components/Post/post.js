import Link from "next/link";
import Image from "next/image";
//to use Image with an external url, add some config on next.config.js
//for more info, check out these docs https://nextjs.org/docs/basic-features/image-optimization

import { getDate } from "../../utils/utils";
import Cta from "../button/button";

export default function Post({ post, featuredMedia }) {
  return (
    <div className="card w-full lg:w-96  shadow-xl">
      <Link href={`/posts/${post.slug}`}>
        <figure>
          <Image
            src={featuredMedia?.["media_details"]?.sizes.medium?.["source_url"]}
            width={250}
            height={250}
            alt={featuredMedia?.["alt_text"]}
            className="w-full h-[250px] object-cover rounded-t-lg"
            priority
          />
        </figure>
      </Link>

      <div className="card-body">
        <h5
          className="card-title text-black"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        ></h5>
        <p dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}></p>
        <p>
          <small className="text-muted">On {getDate(post.modified)}</small>
        </p>
        <div className="card-actions justify-end">
          <Link href={`/posts/${post.slug}`}>
            {" "}
            <Cta>See more</Cta>
          </Link>
        </div>
      </div>
    </div>
  );
}
