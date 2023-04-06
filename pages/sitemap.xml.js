//pages/sitemap.xml.js
const headlessSite = "https://louontour.it";
import LayoutTranslation from "../public/locales/layout.json";

import {
  getPosts,
  getTagId,
  getPostsByLanguageAndBlogOwner,
} from "../utils/wordpress";

function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">       
       <url>
         <loc>https://louontour.it/</loc>
       </url>
       <url>
         <loc>https://louontour.it/en</loc>
       </url>
       <url>
         <loc>https://louontour.it/blog</loc>
       </url>
       <url>
         <loc>https://louontour.it/blog/en</loc>
       </url>
         <url>
         <loc>https://louontour.it/chiSono</loc>
       </url>
        <url>
         <loc>https://louontour.it/en/chiSono</loc>
       </url>
         <url>
         <loc>https://louontour.it/contatti</loc>
       </url>
         <url>
         <loc>https://louontour.it/en/contatti</loc>
       </url>

${LayoutTranslation?.menu?.it?.map?.markers
  .map((el, i) => {
    return `
            <url>
             <loc>${`${headlessSite}/locations/${el?.title}`}</loc>
         </url>
           `;
  })
  .join("")}

  ${LayoutTranslation?.menu?.en?.map?.markers
    .map((el, i) => {
      return `
            <url>
             <loc>${`${headlessSite}/en/locations/${el?.title}`}</loc>
         </url>
           `;
    })
    .join("")}

       
       ${posts?.it
         .map(({ id, slug, tags }) => {
           return `
         <url>
             <loc>${`${headlessSite}/posts/${slug}`}</loc>
         </url>
       `;
         })
         .join("")}
         ${posts?.en
           .map(({ id, slug, tags }) => {
             return `
          <url>
              <loc>${`${headlessSite}/en/posts/${slug}`}</loc>
          </url>
        `;
           })
           .join("")}
     </urlset>
   `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  const resObj = await getPostsByLanguageAndBlogOwner("thalliondev");
  const sitemap = generateSiteMap(resObj);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
