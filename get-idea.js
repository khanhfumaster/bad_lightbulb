const axios = require('axios');
const jsonfile = require('jsonfile')

const fetchDataFromReddit = async (cursor) => {
  console.log('Fetching.', { cursor });
  let response;

  let url = 'https://www.reddit.com/r/Lightbulb/.json?count=25';

  if (cursor) {
      url = url + `&after=${cursor}`;
  }

  try {
      response = await axios.get(url)
  } catch (error) {
      console.log('Failed to fetch data from reddit.', { error: error.message });
      return;
  }

  const data = response.data.data;

  return {
      posts: data.children,
      nextCursor: data.after
  }
}

const getIdeas = async (numOfPages = 1) => {
  const ideas = [];

  let cursor;
  let done = false;
  for (let i = 0; i < numOfPages; i++ ) {

      if (!done) {
          const data = await fetchDataFromReddit(cursor);
          
          data.posts.forEach((post) => {
              if (post.data && post.data.url) {

                  const idea = post.data.title;

                  ideas.push(idea);
              }
          });
          
          if (!data.nextCursor) {
              done = true;
          } else {
              cursor = data.nextCursor;
          }
      }
  }

  return ideas;

}

getIdeas(1000)
  .then(ideas => {
    const file = './ideas.json'
    jsonfile.writeFile(file, ideas, function (err) {
        if (err) {
            console.log('Failed to write data.', { error: err });
        }
    });
  })