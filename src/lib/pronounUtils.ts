export function cleanFirstPersonPronouns(text: string): string {
  if (!text) return text;
  let cleaned = text;

  // 1. Remove leading introductory pronoun phrases
  cleaned = cleaned.replace(/^(I was responsible for|Responsible for|I was in charge of|In charge of|In my role, I|In this role, I|My responsibilities included|In my position, I|I have been responsible for|I am responsible for)\s+/gi, '');

  // 2. Convert bullet start "I <verb>" or "We <verb>" -> "<Verb>"
  cleaned = cleaned.replace(/(^|[\.\;\:\•\-\n]\s*)I\s+([a-zA-Z]+)/g, (_match, prefix, verb) => {
    const capitalizedVerb = verb.charAt(0).toUpperCase() + verb.slice(1);
    return `${prefix}${capitalizedVerb}`;
  });

  cleaned = cleaned.replace(/(^|[\.\;\:\•\-\n]\s*)We\s+([a-zA-Z]+)/g, (_match, prefix, verb) => {
    const capitalizedVerb = verb.charAt(0).toUpperCase() + verb.slice(1);
    return `${prefix}${capitalizedVerb}`;
  });

  // 3. Rephrase mid-sentence pronouns
  cleaned = cleaned.replace(/\bwhere I\b/gi, 'where');
  cleaned = cleaned.replace(/\band I\b/gi, 'and');
  cleaned = cleaned.replace(/\bwhich I\b/gi, 'which');
  cleaned = cleaned.replace(/\bme and my team\b/gi, 'the team');
  cleaned = cleaned.replace(/\bmy team and I\b/gi, 'the team');
  cleaned = cleaned.replace(/\bmy team\b/gi, 'the team');
  cleaned = cleaned.replace(/\bour team\b/gi, 'the team');
  cleaned = cleaned.replace(/\bmy\b/gi, 'the');
  cleaned = cleaned.replace(/\bour\b/gi, 'the');
  cleaned = cleaned.replace(/\bme\b/gi, 'the team');
  cleaned = cleaned.replace(/\bI\b/g, '');

  // Clean formatting
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  return cleaned;
}

export function detectFirstPersonPronouns(text: string): string[] {
  if (!text) return [];
  const matches = text.match(/\b(i|me|my|we|our)\b/gi) || [];
  const unique = Array.from(new Set(matches.map((m) => m.toLowerCase())));
  return unique;
}
