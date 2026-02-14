/**
 * Extract meaningful keywords from step description for image search
 */
export function extractSearchQuery(description: string): string {
  // Remove common task words and keep meaningful nouns/verbs
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'your', 'this', 'that', 'it', 'is', 'are', 'was', 'were'];
  
  // Clean and split the description
  const cleanDesc = description
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .trim();
  
  const words = cleanDesc.split(/\s+/);
  
  // Filter and get meaningful words
  const meaningfulWords = words
    .filter(word => word.length > 3 && !commonWords.includes(word))
    .slice(0, 3); // Take first 3 meaningful words
  
  // Map common task-related words to better visual concepts
  const visualMapping: Record<string, string> = {
    'email': 'typing computer',
    'write': 'writing desk',
    'call': 'phone call',
    'clean': 'organized space',
    'organize': 'organized desk',
    'read': 'reading book',
    'research': 'studying laptop',
    'create': 'creative workspace',
    'plan': 'planning notebook',
    'exercise': 'fitness workout',
    'cook': 'cooking kitchen',
    'study': 'studying desk',
    'meeting': 'office meeting',
    'review': 'analyzing document',
    'document': 'paperwork desk',
    'file': 'organized files',
  };
  
  // Check if any word has a visual mapping
  for (const word of meaningfulWords) {
    if (visualMapping[word]) {
      return visualMapping[word];
    }
  }
  
  // If we have meaningful words, use them
  if (meaningfulWords.length > 0) {
    return meaningfulWords.join(' ');
  }
  
  // Default fallback for generic productivity
  return 'focus productivity workspace';
}
