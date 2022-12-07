import Link from "next/link";
import Image from "next/image";
//to use Image with an external url, add some config on next.config.js
//for more info, check out these docs https://nextjs.org/docs/basic-features/image-optimization

import { getDate } from "../../utils/utils";

export default function Post({ post, featuredMedia }) {
  return (
    <div className="card w-96 ">
      <div>
        <div>
          <Link href={`/posts/${post.slug}`}>
            <figure>
              <Image
                src={
                  featuredMedia?.["media_details"]?.sizes.medium?.["source_url"]
                }
                width={250}
                height={250}
                alt={featuredMedia?.["alt_text"]}
              />
            </figure>
          </Link>
        </div>
        <div className="card-body">
          <h5 className="card-title">{post.title.rendered}</h5>
          <div
            className="card-text"
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
          ></div>
          <p className="card-text">
            <small className="text-muted">On {getDate(post.modified)}</small>
          </p>
          <Link href={`/posts/${post.slug}`}>See more</Link>
        </div>
      </div>
    </div>
  );
}
