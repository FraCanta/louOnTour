//pages/sitemap.xml.js
const headlessSite = "https://luisaquaglia-tourguide.com";
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
         <loc>https://luisaquaglia-tourguide.com/</loc>
       </url>
       <url>
         <loc>https://luisaquaglia-tourguide.com/en</loc>
       </url>
       <url>
         <loc>https://luisaquaglia-tourguide.com/blog</loc>
       </url>
       <url>
         <loc>https://luisaquaglia-tourguide.com/en/blog</loc>
       </url>
         <url>
         <loc>https://luisaquaglia-tourguide.com/chi-sono</loc>
       </url>
        <url>
         <loc>https://luisaquaglia-tourguide.com/en/chi-sono</loc>
       </url>
         <url>
         <loc>https://luisaquaglia-tourguide.com/contatti</loc>
       </url>
         <url>
         <loc>https://luisaquaglia-tourguide.com/en/contatti</loc>
       </url>
       <url>
       <loc>https://luisaquaglia-tourguide.com/tours-da-fare</loc>
     </url>
       <url>
       <loc>https://luisaquaglia-tourguide.com/en/tours-da-fare</loc>
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
      .map(({ id, slug, tags, date }) => {
        const receivedDate = new Date(date);
        const isoDate = receivedDate.toISOString();
        return `
      <url>
          <loc>${`${headlessSite}/posts/${slug}`}</loc>
          <lastmod>${`${isoDate}`}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.5</priority>
      </url>
    `;
      })
      .join("")}
      ${posts?.en
        .map(({ id, slug, tags, date }) => {
          const receivedDate = new Date(date);
          const isoDate = receivedDate.toISOString();
          return `
       <url>
           <loc>${`${headlessSite}/en/posts/${slug}`}</loc>
           <lastmod>${`${isoDate}`}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.5</priority>
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
  const resObj = await getPostsByLanguageAndBlogOwner();
  const sitemap = generateSiteMap(resObj);
  console.log(resObj);
  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
