import {Profanity, ProfanityOptions} from "@2toad/profanity"

const options = new ProfanityOptions();
options.wholeWord = false;

const profanity = new Profanity(options);

export default profanity;