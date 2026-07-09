const PHONE_REGEX =
  /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,5}\)?[\s.-]?)?\d(?:[\s.-]?\d){8,13}/i;

const EMAIL_REGEX =
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

const URL_REGEX =
  /\b(?:https?:\/\/|www\.|[a-zA-Z0-9-]+\.(?:com|net|org|io|co|in|app|dev|me|xyz))\b/i;

const UPI_REGEX =
  /\b[\w.-]{2,}@(upi|ybl|paytm|okaxis|okhdfcbank|okicici|oksbi)\b/i;

const SOCIAL_REGEX =
  /\b(?:whatsapp|wa\.me|telegram|t\.me|instagram|insta|facebook|fb|snapchat|discord|linkedin|signal)\b/i;

const CONTACT_PHRASES = [
  "call me",
  "text me",
  "message me",
  "contact me",
  "reach me",
  "ping me",
  "dm me",
  "email me",
  "mail me",
  "my number",
  "my phone",
  "my whatsapp",
  "whatsapp me",
  "telegram me",
  "search me on",
  "connect on",
  "outside the app",
  "meet outside",
  "share your number",
  "share your email",
];

export function validateMessage(message: string) {
  const text = message.trim().toLowerCase();

  if (!text) {
    return {
      valid: false,
      error: "Message cannot be empty.",
    };
  }

  if (text.length > 1000) {
    return {
      valid: false,
      error: "Message is too long.",
    };
  }

  if (PHONE_REGEX.test(text))
    return {
      valid: false,
      error: "Phone numbers are not allowed.",
    };

  if (EMAIL_REGEX.test(text))
    return {
      valid: false,
      error: "Email addresses are not allowed.",
    };

  if (URL_REGEX.test(text))
    return {
      valid: false,
      error: "Links are not allowed.",
    };

  if (UPI_REGEX.test(text))
    return {
      valid: false,
      error: "Payment information is not allowed.",
    };

  if (SOCIAL_REGEX.test(text))
    return {
      valid: false,
      error: "Social media information is not allowed.",
    };

  for (const phrase of CONTACT_PHRASES) {
    if (text.includes(phrase)) {
      return {
        valid: false,
        error:
          "Sharing personal contact information is not allowed.",
      };
    }
  }

  return {
    valid: true,
  };
}