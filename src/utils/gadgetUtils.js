// Arrays for generating codenames
const adjectives = [
  'Shadow', 'Phantom', 'Ghost', 'Silent', 'Midnight', 'Stealth', 'Covert', 
  'Raven', 'Dark', 'Crimson', 'Azure', 'Golden', 'Emerald', 'Whisper', 
  'Thunder', 'Razor', 'Swift', 'Nimble', 'Deadly', 'Hidden'
];

const nouns = [
  'Eagle', 'Hawk', 'Wolf', 'Cobra', 'Viper', 'Phoenix', 'Dragon', 'Panther', 
  'Tiger', 'Falcon', 'Raven', 'Specter', 'Sentinel', 'Guardian', 'Kraken', 
  'Reaper', 'Arrow', 'Blade', 'Shadow', 'Nightingale'
];

/**
 * Generate a random mission success probability percentage
 * @returns {number} A random percentage between 50-99
 */
const generateMissionSuccessProbability = () => {
  return Math.floor(Math.random() * 50) + 50; // Generate between 50-99%
};

/**
 * Generate a unique codename for a gadget
 * @returns {string} A codename in the format "The {Adjective} {Noun}"
 */
const generateCodename = () => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `The ${adjective} ${noun}`;
};

/**
 * Generate a confirmation code for self-destruct sequence
 * @returns {string} A random 6-character alphanumeric code
 */
const generateConfirmationCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

module.exports = {
  generateMissionSuccessProbability,
  generateCodename,
  generateConfirmationCode
};