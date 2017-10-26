import Markov from 'markov-strings';
import twit from 'twit';
import ideasData from './ideas.json'; 

const getRandomIdea = (ideas) => {
  const markov = new Markov(ideas);
  markov.buildCorpusSync();
  return markov.generateSentenceSync(); 
}

const T = new Twit({
   
})

// eslint-disable-next-line import/prefer-default-export
export const run = (event, context, callback) => {
  try {
    const result = getRandomIdea(ideasData);
    callback(result);
  } catch (e) {
    callback(e);
  }
};
