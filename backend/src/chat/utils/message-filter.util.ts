import { ForbiddenException } from '@nestjs/common';

const PHONE_REGEX =
  /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,5}\)?[\s.-]?)?\d(?:[\s.-]?\d){8,13}/;

const EMAIL_REGEX =
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

const URL_REGEX =
  /\b(?:https?:\/\/|www\.|[a-zA-Z0-9-]+\.(?:com|net|org|io|co|in|app|dev|me|xyz))\b/i;

const UPI_REGEX =
  /\b[\w.-]{2,}@(upi|ybl|ibl|paytm|okaxis|okicici|okhdfcbank|oksbi|apl|axl)\b/i;

const SOCIAL_REGEX =
  /\b(?:whatsapp|wa\.me|telegram|t\.me|instagram|insta|ig|facebook|fb|messenger|snapchat|snap|discord|linkedin|signal|twitter|x\.com)\b/i;

const QR_REGEX =
  /\b(?:qr|qr code|scan qr|scan the qr|barcode)\b/i;

const IFSC_REGEX =
  /\b[A-Z]{4}0[A-Z0-9]{6}\b/i;

const PAN_REGEX =
  /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/i;

const AADHAAR_REGEX =
  /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/;

const BANK_ACCOUNT_REGEX =
  /\b\d{9,18}\b/;

const CONTACT_PHRASES = [
  'call me',
  'text me',
  'message me',
  'contact me',
  'reach me',
  'ping me',
  'dm me',
  'direct message',
  'email me',
  'mail me',
  'my number',
  'my phone',
  'my whatsapp',
  'whatsapp me',
  'telegram me',
  'search me on',
  'connect on',
  'outside the app',
  'continue on whatsapp',
  'lets talk outside',
  "let's talk outside",
  'meet outside',
  'share your number',
  'share your email',
  'give me your number',
  'give me your email',
  'bank account',
  'account number',
  'acc no',
  'ifsc',
  'upi',
  'google pay',
  'phonepe',
  'paytm',
  'gpay',
];

const WORD_NUMBERS: Record<string, string> = {
  zero: '0',
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
};

function normalize(text: string): string {
  let normalized = text.toLowerCase();

  normalized = normalized.replace(/\bat\b/g, '@');
  normalized = normalized.replace(/\bdot\b/g, '.');

  for (const [word, digit] of Object.entries(WORD_NUMBERS)) {
    normalized = normalized.replace(
      new RegExp(word, 'g'),
      digit,
    );
  }

  normalized = normalized.replace(/\s+/g, ' ').trim();

  return normalized;
}

function containsMixedPhone(text: string): boolean {
  const compact = text.replace(/[^a-z0-9]/gi, '');

  return /\d[a-z]+\d|\d+[a-z]+\d+/i.test(compact);
}

export function validateMessage(message: string): void {
  const text = normalize(message);

  if (!text) {
    throw new ForbiddenException(
      'Message cannot be empty.',
    );
  }

  if (text.length > 1000) {
    throw new ForbiddenException(
      'Message is too long.',
    );
  }

  if (PHONE_REGEX.test(text))
    throw new ForbiddenException(
      'Sharing phone numbers is not allowed.',
    );

  if (containsMixedPhone(text))
    throw new ForbiddenException(
      'Sharing phone numbers is not allowed.',
    );

  if (EMAIL_REGEX.test(text))
    throw new ForbiddenException(
      'Sharing email addresses is not allowed.',
    );

  if (URL_REGEX.test(text))
    throw new ForbiddenException(
      'Sharing links is not allowed.',
    );

  if (UPI_REGEX.test(text))
    throw new ForbiddenException(
      'Sharing payment information is not allowed.',
    );

  if (SOCIAL_REGEX.test(text))
    throw new ForbiddenException(
      'Sharing social media information is not allowed.',
    );

  if (QR_REGEX.test(text))
    throw new ForbiddenException(
      'Sharing QR codes is not allowed.',
    );

  if (BANK_ACCOUNT_REGEX.test(text))
    throw new ForbiddenException(
      'Sharing bank account numbers is not allowed.',
    );

  if (IFSC_REGEX.test(text))
    throw new ForbiddenException(
      'Sharing IFSC codes is not allowed.',
    );

  if (PAN_REGEX.test(text))
    throw new ForbiddenException(
      'Sharing PAN details is not allowed.',
    );

  if (AADHAAR_REGEX.test(text))
    throw new ForbiddenException(
      'Sharing Aadhaar numbers is not allowed.',
    );

  for (const phrase of CONTACT_PHRASES) {
    if (text.includes(phrase)) {
      throw new ForbiddenException(
        'Sharing personal contact information is not allowed.',
      );
    }
  }
}