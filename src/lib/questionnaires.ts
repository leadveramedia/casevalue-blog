// Category to questionnaire URL mapping
// Maps blog categories to casevalue.law case type questionnaires
// URL format: https://casevalue.law/#case/{caseType}/0
const categoryQuestionnaireMap: Record<string, string> = {
  // Motor vehicle / auto accidents
  'motor-vehicle': 'https://casevalue.law/#case/motor/0',
  'auto-accident': 'https://casevalue.law/#case/motor/0',
  'car-accident': 'https://casevalue.law/#case/motor/0',

  // Medical malpractice
  'medical-malpractice': 'https://casevalue.law/#case/medical/0',
  'medical': 'https://casevalue.law/#case/medical/0',

  // Premises liability
  'premises-liability': 'https://casevalue.law/#case/premises/0',
  'slip-and-fall': 'https://casevalue.law/#case/premises/0',

  // Product liability
  'product-liability': 'https://casevalue.law/#case/product/0',
  'defective-product': 'https://casevalue.law/#case/product/0',

  // Wrongful death
  'wrongful-death': 'https://casevalue.law/#case/wrongful_death/0',

  // Dog bites
  'dog-bite': 'https://casevalue.law/#case/dog_bite/0',
  'dog-bites': 'https://casevalue.law/#case/dog_bite/0',
  'animal-attack': 'https://casevalue.law/#case/dog_bite/0',

  // Employment / wrongful termination
  'wrongful-termination': 'https://casevalue.law/#case/wrongful_term/0',
  'employment': 'https://casevalue.law/#case/wrongful_term/0',
  'employment-law': 'https://casevalue.law/#case/wrongful_term/0',

  // Wage and hour
  'wage-hour': 'https://casevalue.law/#case/wage/0',
  'wage-theft': 'https://casevalue.law/#case/wage/0',
  'unpaid-wages': 'https://casevalue.law/#case/wage/0',

  // Class action
  'class-action': 'https://casevalue.law/#case/class_action/0',
  'mass-tort': 'https://casevalue.law/#case/class_action/0',

  // Insurance bad faith
  'insurance': 'https://casevalue.law/#case/insurance/0',
  'insurance-bad-faith': 'https://casevalue.law/#case/insurance/0',

  // Disability
  'disability': 'https://casevalue.law/#case/disability/0',
  'disability-discrimination': 'https://casevalue.law/#case/disability/0',

  // Professional malpractice
  'professional-malpractice': 'https://casevalue.law/#case/professional/0',
  'legal-malpractice': 'https://casevalue.law/#case/professional/0',

  // Civil rights
  'civil-rights': 'https://casevalue.law/#case/civil_rights/0',
  'discrimination': 'https://casevalue.law/#case/civil_rights/0',

  // Intellectual property
  'intellectual-property': 'https://casevalue.law/#case/ip/0',
  'ip': 'https://casevalue.law/#case/ip/0',
  'trademark': 'https://casevalue.law/#case/ip/0',
  'copyright': 'https://casevalue.law/#case/ip/0',
  'patent': 'https://casevalue.law/#case/ip/0',

  // General personal injury (default to motor as most common)
  'personal-injury': 'https://casevalue.law/#case/motor/0',
  'consumer-rights': 'https://casevalue.law/#case/class_action/0',
};

// Default URL goes to the main case selection page
const DEFAULT_QUESTIONNAIRE_URL = 'https://casevalue.law/';

/**
 * Get the questionnaire URL for a given set of categories.
 * Returns the first matching category's questionnaire URL,
 * or a default URL if no match is found.
 */
export function getQuestionnaireUrl(categories?: string[]): string {
  if (!categories || categories.length === 0) {
    return DEFAULT_QUESTIONNAIRE_URL;
  }

  for (const category of categories) {
    const url = categoryQuestionnaireMap[category];
    if (url) {
      return url;
    }
  }

  return DEFAULT_QUESTIONNAIRE_URL;
}

/**
 * Get a human-readable category name for display in CTAs
 */
export function getCategoryDisplayName(categories?: string[]): string | null {
  if (!categories || categories.length === 0) {
    return null;
  }

  const category = categories[0];
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
