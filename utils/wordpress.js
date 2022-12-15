const BASE_URL = "https://louontour.it/wp-json/wp/v2";

export async function getPosts(lang) {
  //   const postsRes = await fetch(BASE_URL + "/posts?page=" + page);
  const postsRes = await fetch(BASE_URL + "/posts?_embed&per_page=100");
  const posts = await postsRes.json();
  const lngPost = posts.filter((p) => {
    if (!!lang) {
      return p?.tags?.includes(lang);
    } else {
      return p;
    }
  });
  const mainKeys = lngPost?.map((el) => {
    return {
      categories: el?.categories,
      content: { rendered: el?.content?.rendered },
      date: el?.date,
      excerpt: { rendered: el?.excerpt?.rendered },
      featured_media: el?.featured_media,
      _embedded: el["_embedded"],
      slug: el?.slug,
      title: { rendered: el?.title?.rendered },
      tags: el?.tags,
    };
  });
  return mainKeys;
}
// array di tutti i tags presenti
export async function getTags() {
  //   const postsRes = await fetch(BASE_URL + "/posts?page=" + page);
  const tagsRes = await fetch(BASE_URL + "/tags?per_page=100");
  const tags = await tagsRes.json();
  return tags;
}

// ricerca codice di un tag
export async function getTagId(tag) {
  //   const postsRes = await fetch(BASE_URL + "/posts?page=" + page);
  const tagsRes = await fetch(BASE_URL + "/tags?per_page=100");
  const tags = await tagsRes.json();
  const idLocale = (tags?.filter((el) => el?.name === tag))[0].id; //prendo l'id che corrisponde ad it nel database di wp
  return idLocale;
}

export async function getPost(slug) {
  const posts = await getPosts();
  const postArray = posts.filter((post) => post.slug == slug);
  const post = postArray.length > 0 ? postArray[0] : null;
  return post;
}

export async function getMedia() {
  const mediaRes = await fetch(BASE_URL + "/media");

  const media = await mediaRes.json();
  return media;
}

// /wp/v2/categories per le categorie
export async function getCategories(lang, onlyFull = true) {
  const categoriesRes = await fetch(BASE_URL + "/categories");
  const categories = await categoriesRes.json();
  const filteredCategories = categories?.filter(
    (el) => el?.description === lang
  );
  const fullCategories = onlyFull
    ? filteredCategories?.filter((el) => el?.count > 0)
    : filteredCategories;

  if (!!lang) {
    lang === "it" &&
      fullCategories.splice(0, 0, { id: 0, name: "Tutte le categorie" });
    lang === "en" &&
      fullCategories.splice(0, 0, { id: 0, name: "All categories" });
    return fullCategories;
  } else {
    return categories;
  }
}

// export async function getEvents() {
//   const eventsRes = await fetch(BASE_URL + "/categories");
//   const events = await eventsRes.json();
//   return events;
// }

// export async function getEvent(slug) {
//   const events = await getEvents();
//   const eventArray = events.filter((event) => event.slug == slug);
//   const event = eventArray.length > 0 ? eventArray[0] : null;
//   return event;
// }

export async function getSlugs(type) {
  let elements = [];
  //   switch (type) {
  //     case "posts":
  elements = await getPosts();
  //       break;
  //     case "events":
  //       elements = await getEvents();
  //       break;
  //   }
  const elementsIds = elements.map((element) => {
    return {
      params: {
        slug: element.slug,
      },
    };
  });
  return elementsIds;
}
