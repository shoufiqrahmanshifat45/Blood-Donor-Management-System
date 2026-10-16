import { redPulseLogoBase64 } from '../assets/logoBase64';

export const BRAND = {
  name: 'RedPulse',
  officialName: 'RedPulse',
  portalName: 'RedPulse Portal',
  managementTitle: 'RedPulse Management Portal',
  memberPortalTitle: 'RedPulse Member Portal',
  tagline: 'Connecting Donors & Saving Lives',
  heroHeadline: 'Every Beat Saves a Life',
  heroSubheadline: 'Your blood donation creates an instant lifeline. Connect directly with voluntary donors and medical requisitions in real-time across Bangladesh.',
  logoUrl: '/logo.png',
  logoBase64: redPulseLogoBase64,
  organizationEmailDomain: 'redpulse.org',
  supportEmail: 'support@redpulse.org',
  copyright: `© ${new Date().getFullYear()} RedPulse. All rights reserved.`,
} as const;

export default BRAND;
