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
  {
    title: 'Identity verification',
    description:
      'Government ID verification is required before marketplace access. Document numbers and copies should never be displayed in the app after submission.',
  },
  {
    title: 'Contact privacy',
    description:
      'Names, phone numbers, email addresses, and exact meeting locations remain private until the required booking, payment, and confirmation conditions are met.',
  },
  {
    title: 'Safety and payments',
    description:
      'Report safety concerns through Support. Payment and payout records should be handled by the payment provider and retained only as required for support, fraud prevention, and law.',
  },
];

export const regionalPrivacyRights: ComplianceHighlight[] = [
  {
    title: 'European Union and EEA',
    description:
      'GDPR rights can include access, correction, deletion, restriction, objection, portability, consent withdrawal, and a complaint to the relevant supervisory authority.',
  },
  {
    title: 'United Kingdom',
    description:
      'UK users receive equivalent information and data-rights handling under UK data-protection law, including the ability to raise a concern with the ICO.',
  },
  {
    title: 'United States',
    description:
      'US privacy rights vary by state. Where applicable, users can request access, correction, deletion, and opt out of covered sale, sharing, or targeted-advertising activities.',
  },
  {
    title: 'Australia and other regions',
    description:
      'Users can request access or correction and receive notice about collection, use, overseas transfers, security, retention, and complaint handling. Local rights may provide additional protections.',
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
          'We process trip, booking, payment-status, trust, and safety signals such as ride history, cancellations, incident reports, and support requests. Government identity documents must be handled only through a private verification workflow.',
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
        heading: 'Contact and payment privacy',
        body: [
          'Names, phone numbers, email addresses, and exact meeting locations are not shown in public listings. They are released only after the marketplace conditions shown at booking are fulfilled.',
          'Payment card data is processed by the payment provider, not stored by TravelTrust. Service fees, payouts, refunds, and disputes are handled under the applicable payment and marketplace terms.',
        ],
      },
      {
        heading: 'Regional privacy rights',
        body: [
          'EU and EEA users may have GDPR rights including access, correction, export, restriction, objection, deletion, and consent withdrawal. UK users have similar rights under UK data-protection law.',
          'US, Australian, and other regional rights vary. The Compliance Center provides account controls and a contact route for access, correction, deletion, and applicable opt-out requests.',
          'Before launch, replace the placeholder support and DPO contact details with your real legal contacts and complaint handling process for each market where TravelTrust operates.',
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
