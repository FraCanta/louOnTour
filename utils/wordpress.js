const BASE_URL = "https://louontour.it/wp-json/wp/v2";

export async function getPosts() {
  //   const postsRes = await fetch(BASE_URL + "/posts?page=" + page);
  const postsRes = await fetch(BASE_URL + "/posts?_embed&per_page=40");

  const posts = await postsRes.json();
  return posts;
}
export async function getTags() {
  //   const postsRes = await fetch(BASE_URL + "/posts?page=" + page);
  const tagsRes = await fetch(BASE_URL + "/tags?per_page=100");

  const tags = await tagsRes.json();
  return tags;
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
export async function getCategories() {
  const categoriesRes = await fetch(BASE_URL + "/categories");
  const categories = await categoriesRes.json();
  return categories;
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
