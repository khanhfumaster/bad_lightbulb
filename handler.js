import Markov from 'markov-strings';
import Twit from 'twit';
import ideasData from './ideas.json';
import config from './config';

const T = new Twit(config);

const options = {
  maxLength: 140,
  minWords: 10,
  minScore: 25,
  checker: sentence => {
    return sentence.endsWith('.'); // I want my tweets to end with a dot.
  }
};

const getRandomIdea = (ideas) => {
  const markov = new Markov(ideas, options);
  markov.buildCorpusSync();
  return markov.generateSentenceSync(); 
}

// eslint-disable-next-line import/prefer-default-export
export const run = (event, context, callback) => {
  try {
    const result = getRandomIdea(ideasData);

    T.post('statuses/update', 
      { status: result.string }, 
      function(err, data, response) {
        console.log({err, data})
      });

  } catch (e) {
    callback(e);
  }
};
