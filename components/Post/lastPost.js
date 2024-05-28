import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getDate } from "../../utils/utils";
const LastPost = ({ lastPost, category }) => {
  console.log(lastPost);
  return (
    <>
      <Link
        href={`/posts/${lastPost[0].slug}`}
        title={`${lastPost[0].title?.rendered}`}
      >
        <figure className="w-full before:content-{} before: inline  before:absolute before:left-0 before:right-0 before:top-0 before:z-10 before:h-full before:w-full before:bg-third/90 before:opacity-80">
          <Image
            className="w-full h-[70vw] xl:h-[30vw] object-cover rounded-[5px] relative"
            src={
              lastPost?.[0]["_embedded"]?.["wp:featuredmedia"][0][
                "media_details"
              ]?.sizes?.full?.["source_url"]
            }
            width={300}
            height={300}
            alt={lastPost?.["alt_text"]}
          />
        </figure>
        <div className="absolute bottom-0 left-0 font-bold p-6 z-20 xl:w-[60%] flex flex-col gap-2 xl:gap-6">
          <h2
            dangerouslySetInnerHTML={{ __html: lastPost?.[0].title?.rendered }}
            className="text-white text-[5.5vw] xl:text-[2.5vw] leading-[1.4] "
          ></h2>
          <small className=" text-white text-[3vw] xl:text-[1.2vw]">
            {getDate(lastPost[0]?.date)}
          </small>
        </div>
      </Link>
    </>
  );
};

export default LastPost;
