import type { ComplianceHighlight, LegalDocument, LegalDocumentSlug } from '../types/compliance';

export const providerDetails = {
  companyName: 'TravelTrust GmbH (placeholder)',
  supportEmail: 'privacy@traveltrust.app',
  dpoEmail: 'dpo@traveltrust.app',
  postalAddress: 'Musterstrasse 1, 60311 Frankfurt am Main, Germany',
  retentionSummary:
    'Identity, booking, and safety records should be retained only as long as needed for operations, fraud prevention, legal obligations, and user support.',
};

export const complianceHighlights: ComplianceHighlight[] = [
  {
    title: 'Data minimization',
    description: 'Only collect identity, booking, safety, and payment data that is necessary to operate the marketplace.',
  },
  {
    title: 'User rights',
    description: 'Users should be able to request access, export, correction, and deletion of their personal data.',
  },
  {
    title: 'Permission hygiene',
    description: 'Location should stay foreground-only unless you add a real background use case and legal basis.',
  },
];

export const legalDocuments: Record<LegalDocumentSlug, LegalDocument> = {
  'privacy-notice': {
    slug: 'privacy-notice',
    title: 'Privacy Notice',
    summary: 'How TravelTrust collects, uses, and protects personal data for riders, travelers, and helpers.',
    sections: [
      {
        heading: 'What we collect',
        body: [
          'We collect account details such as name, email, phone number, city, profile image, and trust verification status.',
          'We process trip, booking, payment-status, trust, and safety signals such as ride history, cancellations, incident reports, and support requests.',
          'We request foreground location only when needed to match rides, set pickup points, or support travel assistance.',
        ],
      },
      {
        heading: 'Why we process it',
        body: [
          'We use your data to provide the service, secure accounts, prevent fraud, investigate incidents, and comply with legal obligations.',
          'Marketing communication should remain optional and separate from the core service agreement.',
        ],
      },
      {
        heading: 'Your rights in the EU',
        body: [
          'Users may request access, correction, export, restriction, objection, and deletion where applicable under GDPR.',
          'Before launch, replace the placeholder support and DPO contact details with your real legal contacts and complaint handling process.',
        ],
      },
    ],
  },
  'terms-of-service': {
    slug: 'terms-of-service',
    title: 'Terms of Service',
    summary: 'Core marketplace rules for using TravelTrust as a rider, traveler, or helper.',
    sections: [
      {
        heading: 'Account responsibilities',
        body: [
          'Users must provide accurate personal information, maintain secure credentials, and avoid impersonation.',
          'TravelTrust may suspend or restrict accounts with fraud, abuse, unsafe conduct, or repeated policy violations.',
        ],
      },
      {
        heading: 'Marketplace conduct',
        body: [
          'Riders, travelers, and helpers must behave respectfully, follow pickup instructions, and avoid discriminatory or abusive conduct.',
          'No-shows, repeated cancellations, payment abuse, and unsafe transport behavior may trigger account review or removal.',
        ],
      },
      {
        heading: 'Safety and enforcement',
        body: [
          'Users must report emergencies and safety issues immediately through in-app support or emergency services where necessary.',
          'TravelTrust may retain incident evidence and trust data for investigations, charge disputes, and compliance obligations.',
        ],
      },
    ],
  },
  'community-rules': {
    slug: 'community-rules',
    title: 'Community Rules',
    summary: 'Behavioral expectations that help keep the community safe and trustworthy.',
    sections: [
      {
        heading: 'Respect and safety',
        body: [
          'Treat every rider, traveler, and helper with dignity regardless of nationality, religion, gender, disability, or background.',
          'Do not request cash side-payments, harassment, or off-platform identity documents outside approved trust workflows.',
        ],
      },
      {
        heading: 'Trust and authenticity',
        body: [
          'Only create one personal account unless TravelTrust explicitly approves a business or operator account.',
          'Do not falsify verification, reviews, routes, emergency contacts, or support incidents.',
        ],
      },
      {
        heading: 'Escalation',
        body: [
          'Serious incidents, identity mismatches, or repeated abuse may lead to manual review, temporary freeze, or permanent removal.',
        ],
      },
    ],
  },
  'provider-details': {
    slug: 'provider-details',
    title: 'Provider Details',
    summary: 'Contact and accountability information that should be finalized before EU/Germany launch.',
    sections: [
      {
        heading: 'Company contact',
        body: [
          `Company: ${providerDetails.companyName}`,
          `Postal address: ${providerDetails.postalAddress}`,
          `Privacy contact: ${providerDetails.supportEmail}`,
          `Data protection contact: ${providerDetails.dpoEmail}`,
        ],
      },
      {
        heading: 'Launch reminder',
        body: [
          'Replace all placeholder company, privacy, and DPO details with your actual legal entity data before release.',
          'For Germany, ensure your provider identification and complaint contact details match your business registration and public support channels.',
        ],
      },
      {
        heading: 'Retention and records',
        body: [providerDetails.retentionSummary],
      },
    ],
  },
};
