const axios = require('axios');
const jsonfile = require('jsonfile')
const _ = require('lodash');

const fetchDataFromReddit = async (subreddit, cursor) => {
  console.log('Fetching.', { cursor });
  let response;

  let url = `https://www.reddit.com/r/${subreddit}/.json?count=25`;

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

const getIdeas = async (subreddit, numOfPages = 1) => {
  const ideas = [];

  let cursor;
  let done = false;
  for (let i = 0; i < numOfPages; i++ ) {

      if (!done) {
          const data = await fetchDataFromReddit(subreddit, cursor);
          
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

const promises = [
  getIdeas('Lightbulb', 1000), 
  getIdeas('shittyideas', 1000),
  getIdeas('INEEEEDIT', 1000),
  getIdeas('CrazyIdeas', 1000),
  getIdeas('MyTheoryIs', 1000)
];
  

Promise.all(promises)
  .then(ideasValues => {
    const ideas = _.flatten(ideasValues);
    const file = './ideas.json'

    console.log('Writing ideas.json', { length: ideas.length })

    jsonfile.writeFile(file, ideas, function (err) {
        if (err) {
            console.log('Failed to write data.', { error: err });
        }
    });
  })