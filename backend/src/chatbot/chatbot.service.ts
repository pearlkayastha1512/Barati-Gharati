
// import {
//   BadRequestException,
//   Injectable,
//   InternalServerErrorException,
// } from '@nestjs/common';

// import { GoogleGenAI } from '@google/genai';
// import Groq from 'groq-sdk';

// import { PrismaService } from '../prisma/prisma.service';

// const CUSTOMER_INSTRUCTION = `You are a wedding planning assistant for couples on a wedding planning platform.
// Help with budgeting tips, checklist guidance, and advice on choosing vendors (photographers, caterers, decorators, DJs, makeup artists, venues).
// Keep responses short, warm, and practical — 3-4 sentences max unless the user asks for detail.

// When a user asks you to find or search for vendors:
// - If they haven't mentioned a specific category, ask which category they're interested in (use the "Available vendor categories" list from the data below) before listing anything.
// - Once a category is known (either stated by the user or from the data provided), list only 3-4 vendor names from that category as a starting point — do not dump the entire list at once.
// - After listing a few, ask if they'd like to see the full list of vendors in that category, or narrow down by location or price instead.
// - Only show vendors and packages that actually appear in the data provided below — never invent names.

// Only answer questions related to wedding planning or this platform. If asked about anything else, politely decline and redirect to wedding planning topics.
// You may be given real data below relevant to the question. Always use this data to answer specific questions accurately. If the answer isn't in the data provided, say you don't have that information — never guess or make up numbers, vendor names, or prices.`;

// const VENDOR_INSTRUCTION = `You are a business assistant for wedding vendors on a wedding planning platform.
// Help vendors write portfolio descriptions, structure and price service packages, respond professionally to leads, and get more bookings.
// Keep responses short, practical, and business-focused — 3-4 sentences max unless the user asks for detail.
// Only answer questions related to running their wedding vendor business or this platform. If asked about anything else, politely decline and redirect.
// You may be given real data below relevant to the question. Always use this data to answer specific questions accurately. If the answer isn't in the data provided, say you don't have that information — never guess or make up numbers, vendor names, or prices.`;

// const SUPPORTED_AUDIO_FORMATS = [
//   'mp3',
//   'mp4',
//   'mpeg',
//   'mpga',
//   'm4a',
//   'wav',
//   'webm',
// ];

// const TOPIC_KEYWORDS: Record<string, string[]> = {
//   budget: [
//     'budget',
//     'expense',
//     'expenses',
//     'spending',
//     'how much have i spent',
//     'remaining budget',
//   ],

//   bookings: [
//     'booking',
//     'book',
//     'my booking',
//     'event date',
//     'confirmed',
//     'cancel my',
//     'booking status',
//   ],

//   vendors_packages: [
//     'vendor',
//     'vendors',
//     'photographer',
//     'photography',
//     'caterer',
//     'catering',
//     'decorator',
//     'decoration',
//     'dj',
//     'makeup',
//     'venue',
//     'venues',
//     'mehendi',
//     'mehndi',
//     'band',
//     'package',
//     'packages',
//     'price',
//     'pricing',
//     'cost',
//     'find me',
//     'search',
//     'category',
//     'categories',
//     'how much does',
//     'show me',
//     'suggest',
//     'recommend',
//     'options',
//     'available',
//     'list',
//     'who can',
//     'best',
//   ],

//   leads: [
//     'lead',
//     'leads',
//     'inquiry',
//     'inquiries',
//     'new request',
//   ],
// };

// const SITE_CONTENT_KEYWORDS: Record<string, string[]> = {
//   'about-us': [
//     'about',
//     'who are you',
//     'company',
//     'about this platform',
//     'who runs',
//   ],

//   'privacy-policy': [
//     'privacy',
//     'data policy',
//     'personal data',
//     'gdpr',
//   ],

//   terms: [
//     'terms',
//     'terms and conditions',
//     'terms of service',
//     'legal',
//   ],

//   faq: [
//     'faq',
//     'how do i',
//     'how to',
//     'how can i',
//   ],

//   pricing: [
//     'pricing',
//     'subscription',
//     'fees',
//     'how much does it cost to',
//   ],
// };

// export interface VendorSuggestion {
//   id: string;
//   businessName: string;
//   category: string;
// }

// @Injectable()
// export class ChatbotService {
//   /**
//    * Gemini is now used for normal text chat.
//    */
//   private gemini: GoogleGenAI;

//   /**
//    * Groq is temporarily kept for voice transcription.
//    * We will remove this after migrating voice to Gemini.
//    */
//   private groq: Groq;

//   constructor(private prisma: PrismaService) {
//     this.gemini = new GoogleGenAI({
//       apiKey: process.env.GEMINI_API_KEY,
//     });

//     this.groq = new Groq({
//       apiKey: process.env.GROQ_API_KEY,
//     });
//   }

//   private formatDecimal(val: any): string {
//     return `₹${Number(val).toLocaleString('en-IN')}`;
//   }

//   private escapeRegex(str: string): string {
//     return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//   }

//   private matchTopics(message: string): string[] {
//     const lower = message.toLowerCase();

//     return Object.entries(TOPIC_KEYWORDS)
//       .filter(([, keywords]) =>
//         keywords.some((kw) => lower.includes(kw)),
//       )
//       .map(([topic]) => topic);
//   }

//   private matchSiteContentSlugs(message: string): string[] {
//     const lower = message.toLowerCase();

//     return Object.entries(SITE_CONTENT_KEYWORDS)
//       .filter(([, keywords]) =>
//         keywords.some((kw) => lower.includes(kw)),
//       )
//       .map(([slug]) => slug);
//   }

//   // ---------- BUDGET ----------

//   private async getBudgetContext(
//     userId: string,
//   ): Promise<string> {
//     const budget =
//       await this.prisma.budget.findUnique({
//         where: { userId },
//         include: {
//           expenses: {
//             orderBy: { date: 'desc' },
//             take: 15,
//           },
//         },
//       });

//     if (!budget) {
//       return 'This user has not created a budget yet.';
//     }

//     // Total spent is aggregated over ALL expenses.
//     const { _sum } =
//       await this.prisma.expense.aggregate({
//         where: {
//           budgetId: budget.id,
//         },
//         _sum: {
//           amount: true,
//         },
//       });

//     const spent = Number(
//       _sum.amount ?? 0,
//     );

//     const remaining =
//       Number(budget.totalBudget) - spent;

//     const expenseList =
//       budget.expenses
//         .map(
//           (e) =>
//             `- ${e.title} (${e.category}): ${this.formatDecimal(
//               e.amount,
//             )}${e.note ? ` — ${e.note}` : ''}`,
//         )
//         .join('\n') ||
//       'No expenses logged yet.';

//     return `Budget:
// Total budget: ${this.formatDecimal(
//       budget.totalBudget,
//     )}
// Spent so far: ${this.formatDecimal(spent)}
// Remaining: ${this.formatDecimal(remaining)}

// Recent expenses:
// ${expenseList}`;
//   }

//   // ---------- BOOKINGS ----------

//   private async getBookingsContext(
//     userId: string,
//     role: string,
//   ): Promise<string> {
//     if (role?.toUpperCase() === 'VENDOR') {
//       const vendor =
//         await this.prisma.vendor.findUnique({
//           where: { userId },
//           select: { id: true },
//         });

//       if (!vendor) {
//         return 'This vendor has not completed their profile yet.';
//       }

//       const bookings =
//         await this.prisma.booking.findMany({
//           where: {
//             vendorId: vendor.id,
//           },
//           take: 10,
//           orderBy: {
//             createdAt: 'desc',
//           },
//           select: {
//             status: true,
//             eventDate: true,
//             totalAmount: true,
//             paymentStatus: true,
//             package: {
//               select: {
//                 title: true,
//               },
//             },
//           },
//         });

//       const list =
//         bookings
//           .map(
//             (b) =>
//               `- "${b.package.title}", ${b.eventDate.toDateString()}, status: ${b.status}, payment: ${b.paymentStatus}, amount: ${this.formatDecimal(
//                 b.totalAmount,
//               )}`,
//           )
//           .join('\n') ||
//         'No bookings yet.';

//       return `This vendor's bookings:\n${list}`;
//     }

//     const bookings =
//       await this.prisma.booking.findMany({
//         where: {
//           userId,
//         },
//         take: 10,
//         orderBy: {
//           createdAt: 'desc',
//         },
//         select: {
//           status: true,
//           eventDate: true,
//           totalAmount: true,
//           paymentStatus: true,

//           vendor: {
//             select: {
//               businessName: true,
//             },
//           },

//           package: {
//             select: {
//               title: true,
//             },
//           },
//         },
//       });

//     const list =
//       bookings
//         .map(
//           (b) =>
//             `- "${b.package.title}" with ${b.vendor.businessName}, ${b.eventDate.toDateString()}, status: ${b.status}, payment: ${b.paymentStatus}, amount: ${this.formatDecimal(
//               b.totalAmount,
//             )}`,
//         )
//         .join('\n') ||
//       'No bookings yet.';

//     return `This user's bookings:\n${list}`;
//   }

//   // ---------- VENDORS / PACKAGES ----------

//   private async getVendorsPackagesContext(
//     message: string,
//   ): Promise<{
//     text: string;
//     vendors: VendorSuggestion[];
//   }> {
//     const lower = message.toLowerCase();

//     const allCategories =
//       await this.prisma.category.findMany({
//         select: {
//           id: true,
//           name: true,
//         },
//       });

//     const matchedCategory =
//       allCategories.find((c) => {
//         const nameLower =
//           c.name.toLowerCase();

//         const singular =
//           nameLower.replace(/s$/, '');

//         const pattern = new RegExp(
//           `\\b${this.escapeRegex(
//             singular,
//           )}s?\\b`,
//           'i',
//         );

//         return pattern.test(lower);
//       });

//     const categoryWhere =
//       matchedCategory
//         ? {
//             categoryId:
//               matchedCategory.id,
//           }
//         : {};

//     const [
//       categories,
//       vendors,
//       packages,
//     ] = await Promise.all([
//       this.prisma.category.findMany({
//         take: 30,
//         select: {
//           name: true,
//         },
//       }),

//       this.prisma.vendor.findMany({
//         take: matchedCategory
//           ? 50
//           : 25,

//         where: categoryWhere,

//         orderBy: {
//           createdAt: 'desc',
//         },

//         select: {
//           id: true,
//           businessName: true,
//           address: true,

//           category: {
//             select: {
//               name: true,
//             },
//           },
//         },
//       }),

//       this.prisma.package.findMany({
//         take: matchedCategory
//           ? 50
//           : 30,

//         where: categoryWhere,

//         orderBy: {
//           createdAt: 'desc',
//         },

//         select: {
//           title: true,
//           price: true,
//           inclusions: true,

//           vendor: {
//             select: {
//               id: true,
//               businessName: true,
//             },
//           },

//           category: {
//             select: {
//               name: true,
//             },
//           },
//         },
//       }),
//     ]);

//     const categoryList =
//       categories
//         .map((c) => c.name)
//         .join(', ');

//     const vendorList =
//       vendors
//         .map(
//           (v) =>
//             `- ${v.businessName} (${
//               v.category?.name ??
//               'Uncategorized'
//             })${
//               v.address
//                 ? `, ${v.address}`
//                 : ''
//             }`,
//         )
//         .join('\n') ||
//       (matchedCategory
//         ? `No vendors found in the "${matchedCategory.name}" category.`
//         : 'No vendors found.');

//     const packageList =
//       packages
//         .map(
//           (p) =>
//             `- "${p.title}" by ${
//               p.vendor.businessName
//             } (${p.category.name}) — ${this.formatDecimal(
//               p.price,
//             )}${
//               p.inclusions?.length
//                 ? `, includes: ${p.inclusions.join(
//                     ', ',
//                   )}`
//                 : ''
//             }`,
//         )
//         .join('\n') ||
//       (matchedCategory
//         ? `No packages found in the "${matchedCategory.name}" category.`
//         : 'No packages found.');

//     const text = `Available categories: ${categoryList}

// Vendors${
//       matchedCategory
//         ? ` in the "${matchedCategory.name}" category`
//         : ' on the platform (sample)'
//     }:
// ${vendorList}

// Packages${
//       matchedCategory
//         ? ` in the "${matchedCategory.name}" category`
//         : ' available (sample)'
//     }:
// ${packageList}`;

//     // Build deduped vendor list.
//     const vendorMap =
//       new Map<
//         string,
//         VendorSuggestion
//       >();

//     vendors.forEach((v) =>
//       vendorMap.set(v.id, {
//         id: v.id,
//         businessName:
//           v.businessName,
//         category:
//           v.category?.name ??
//           'Uncategorized',
//       }),
//     );

//     packages.forEach((p) =>
//       vendorMap.set(
//         p.vendor.id,
//         {
//           id: p.vendor.id,
//           businessName:
//             p.vendor.businessName,
//           category:
//             p.category.name,
//         },
//       ),
//     );

//     return {
//       text,
//       vendors: Array.from(
//         vendorMap.values(),
//       ).slice(0, 8),
//     };
//   }

//   // ---------- LEADS ----------

//   private async getLeadsContext(
//     userId: string,
//     role: string,
//   ): Promise<string> {
//     if (
//       role?.toUpperCase() !==
//       'VENDOR'
//     ) {
//       return '';
//     }

//     const vendor =
//       await this.prisma.vendor.findUnique({
//         where: { userId },
//         select: { id: true },
//       });

//     if (!vendor) {
//       return 'This vendor has not completed their profile yet.';
//     }

//     const leads =
//       await this.prisma.lead.findMany({
//         where: {
//           vendorId: vendor.id,
//         },
//         take: 10,
//         orderBy: {
//           createdAt: 'desc',
//         },
//         select: {
//           name: true,
//           status: true,
//           eventDate: true,
//           guestCount: true,
//           message: true,
//         },
//       });

//     const list =
//       leads
//         .map(
//           (l) =>
//             `- ${l.name}, event on ${l.eventDate.toDateString()}, guests: ${l.guestCount}, status: ${l.status}`,
//         )
//         .join('\n') ||
//       'No leads yet.';

//     return `This vendor's leads:\n${list}`;
//   }

//   // ---------- SITE CONTENT ----------

//   private async getSiteContentContext(
//     slugs: string[],
//   ): Promise<string> {
//     if (slugs.length === 0) {
//       return '';
//     }

//     const pages =
//       await this.prisma.siteContent.findMany(
//         {
//           where: {
//             slug: {
//               in: slugs,
//             },
//           },
//         },
//       );

//     if (pages.length === 0) {
//       return '';
//     }

//     return `Platform information (answer using only this content for these topics):
// ${pages
//   .map(
//     (p) =>
//       `--- ${p.title} ---\n${p.content}`,
//   )
//   .join('\n\n')}`;
//   }

//   // ---------- CONTEXT BUILDER ----------

//   private async buildContext(
//     userId: string,
//     role: string,
//     message: string,
//   ): Promise<{
//     text: string;
//     suggestedVendors: VendorSuggestion[];
//   }> {
//     const topics =
//       this.matchTopics(message);

//     const siteSlugs =
//       this.matchSiteContentSlugs(
//         message,
//       );

//     const sections: string[] = [];

//     let suggestedVendors: VendorSuggestion[] =
//       [];

//     if (
//       role?.toUpperCase() !==
//       'VENDOR'
//     ) {
//       if (
//         topics.includes('budget')
//       ) {
//         sections.push(
//           await this.getBudgetContext(
//             userId,
//           ),
//         );
//       }

//       if (
//         topics.includes('bookings')
//       ) {
//         sections.push(
//           await this.getBookingsContext(
//             userId,
//             role,
//           ),
//         );
//       }
//     } else {
//       sections.push(
//         await this.getBookingsContext(
//           userId,
//           role,
//         ),
//       );

//       const leadsCtx =
//         await this.getLeadsContext(
//           userId,
//           role,
//         );

//       if (leadsCtx) {
//         sections.push(leadsCtx);
//       }
//     }

//     if (
//       topics.includes(
//         'vendors_packages',
//       )
//     ) {
//       const {
//         text,
//         vendors,
//       } =
//         await this.getVendorsPackagesContext(
//           message,
//         );

//       sections.push(text);

//       suggestedVendors =
//         vendors;
//     } else {
//       const categories =
//         await this.prisma.category.findMany(
//           {
//             take: 30,
//             select: {
//               name: true,
//             },
//           },
//         );

//       if (categories.length > 0) {
//         sections.push(
//           `Available vendor categories on this platform: ${categories
//             .map((c) => c.name)
//             .join(', ')}.`,
//         );
//       }
//     }

//     if (siteSlugs.length > 0) {
//       const siteCtx =
//         await this.getSiteContentContext(
//           siteSlugs,
//         );

//       if (siteCtx) {
//         sections.push(siteCtx);
//       }
//     }

//     return {
//       text: sections.join(
//         '\n\n',
//       ),
//       suggestedVendors,
//     };
//   }

//   // ---------- PUBLIC METHODS ----------

//   async sendMessage(
//     userId: string,
//     role: string,
//     content: string,
//   ) {
//     const recent =
//       await this.prisma.chatMessage.findMany(
//         {
//           where: {
//             userId,
//           },
//           orderBy: {
//             createdAt: 'desc',
//           },
//           take: 19,
//         },
//       );

//     const history =
//       recent.reverse();

//     await this.prisma.chatMessage.create(
//       {
//         data: {
//           userId,
//           role: 'USER',
//           content,
//         },
//       },
//     );

//     const {
//       text: dataContext,
//       suggestedVendors,
//     } =
//       await this.buildContext(
//         userId,
//         role,
//         content,
//       );

//     const baseInstruction =
//       role?.toUpperCase() ===
//       'VENDOR'
//         ? VENDOR_INSTRUCTION
//         : CUSTOMER_INSTRUCTION;

//     const systemContent =
//       dataContext
//         ? `${baseInstruction}\n\n${dataContext}`
//         : baseInstruction;

//     const messages = [
//       {
//         role: 'system' as const,
//         content: systemContent,
//       },

//       ...history.map((m) => ({
//         role:
//           m.role === 'USER'
//             ? ('user' as const)
//             : ('assistant' as const),

//         content: m.content,
//       })),

//       {
//         role: 'user' as const,
//         content,
//       },
//     ];

//     let replyText: string;

//     try {
//       /*
//        * Gemini replacement for the previous Groq
//        * chat.completions.create() call.
//        *
//        * System instruction is passed separately.
//        */
//       const systemMessage =
//         messages.find(
//           (message) =>
//             message.role ===
//             'system',
//         )?.content ??
//         '';

//       const conversation =
//         messages
//           .filter(
//             (message) =>
//               message.role !==
//               'system',
//           )
//           .map((message) => ({
//             role:
//               message.role ===
//               'assistant'
//                 ? 'model'
//                 : 'user',

//             parts: [
//               {
//                 text: message.content,
//               },
//             ],
//           }));

//       const response =
//         await this.gemini.models.generateContent(
//           {
//             model:
//               'gemini-3.6-flash',

//             contents:
//               conversation,

//             config: {
//               systemInstruction:
//                 systemMessage,

//               maxOutputTokens: 1024,
//             },
//           },
//         );

//       replyText =
//         response.text ??
//         "Sorry, I couldn't generate a response. Please try again.";
//     } catch (error) {
//       console.error(
//         'Gemini API error:',
//         error,
//       );

//       throw new InternalServerErrorException(
//         'AI service is currently unavailable. Please try again later.',
//       );
//     }

//     await this.prisma.chatMessage.create(
//       {
//         data: {
//           userId,
//           role: 'ASSISTANT',
//           content: replyText,
//         },
//       },
//     );

//     return {
//       reply: replyText,
//       vendors: suggestedVendors,
//     };
//   }

//   // ---------- VOICE ----------
//   //
//   // TEMPORARY:
//   // Voice still uses Groq Whisper.
//   // We will migrate this to Gemini separately.

//   async transcribeAndRespond(
//     userId: string,
//     role: string,
//     audioBuffer: Buffer,
//     mimeType: string,
//   ) {
//     // Strip codec params such as:
//     // audio/webm;codecs=opus
//     const format =
//       mimeType
//         .split('/')[1]
//         ?.split(';')[0];

//     if (
//       !format ||
//       !SUPPORTED_AUDIO_FORMATS.includes(
//         format,
//       )
//     ) {
//       throw new BadRequestException(
//         `Unsupported audio format: ${
//           format ?? mimeType
//         }. Supported formats: ${SUPPORTED_AUDIO_FORMATS.join(
//           ', ',
//         )}`,
//       );
//     }

//     let transcript: string;

//     try {
//       /*
//        * TEMPORARY:
//        * Keep Groq Whisper for voice until
//        * we migrate voice to Gemini.
//        */
//       const transcription =
//         await this.groq.audio.transcriptions.create(
//           {
//             file: new File(
//               [
//                 new Uint8Array(
//                   audioBuffer,
//                 ),
//               ],
//               `audio.${format}`,
//               {
//                 type: mimeType,
//               },
//             ),

//             model:
//               'whisper-large-v3',

//             response_format:
//               'text',
//           },
//         );

//       transcript =
//         transcription
//           .toString()
//           .trim();
//     } catch (error) {
//       console.error(
//         'Voice transcription error:',
//         error,
//       );

//       throw new InternalServerErrorException(
//         'Audio transcription failed. Please try again.',
//       );
//     }

//     if (!transcript) {
//       throw new BadRequestException(
//         'Could not transcribe audio. Please speak clearly and try again.',
//       );
//     }

//     const result =
//       await this.sendMessage(
//         userId,
//         role,
//         transcript,
//       );

//     return {
//       transcript,
//       reply: result.reply,
//       vendors: result.vendors,
//     };
//   }

//   // ---------- HISTORY ----------

//   async getHistory(
//     userId: string,
//   ) {
//     return this.prisma.chatMessage.findMany(
//       {
//         where: {
//           userId,
//         },
//         orderBy: {
//           createdAt: 'asc',
//         },
//       },
//     );
//   }
// }


import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { GoogleGenAI } from '@google/genai';

import { PrismaService } from '../prisma/prisma.service';

const CUSTOMER_INSTRUCTION = `You are a wedding planning assistant for couples on a wedding planning platform.
Help with budgeting tips, checklist guidance, and advice on choosing vendors (photographers, caterers, decorators, DJs, makeup artists, venues).
Keep responses short, warm, and practical — 3-4 sentences max unless the user asks for detail.

When a user asks you to find or search for vendors:
- If they haven't mentioned a specific category, ask which category they're interested in (use the "Available vendor categories" list from the data below) before listing anything.
- Once a category is known (either stated by the user or from the data provided), list only 3-4 vendor names from that category as a starting point — do not dump the entire list at once.
- After listing a few, ask if they'd like to see the full list of vendors in that category, or narrow down by location or price instead.
- Only show vendors and packages that actually appear in the data provided below — never invent names.

Only answer questions related to wedding planning or this platform. If asked about anything else, politely decline and redirect to wedding planning topics.
You may be given real data below relevant to the question. Always use this data to answer specific questions accurately. If the answer isn't in the data provided, say you don't have that information — never guess or make up numbers, vendor names, or prices.`;

const VENDOR_INSTRUCTION = `You are a business assistant for wedding vendors on a wedding planning platform.
Help vendors write portfolio descriptions, structure and price service packages, respond professionally to leads, and get more bookings.
Keep responses short, practical, and business-focused — 3-4 sentences max unless the user asks for detail.
Only answer questions related to running their wedding vendor business or this platform. If asked about anything else, politely decline and redirect.
You may be given real data below relevant to the question. Always use this data to answer specific questions accurately. If the answer isn't in the data provided, say you don't have that information — never guess or make up numbers, vendor names, or prices.`;

const SUPPORTED_AUDIO_FORMATS = [
  'mp3',
  'mp4',
  'mpeg',
  'mpga',
  'm4a',
  'wav',
  'webm',
];

const SUPPORTED_AUDIO_MIME_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/mp4',
  'audio/wav',
  'audio/webm',
  'audio/ogg',
  'audio/x-m4a',
  'audio/m4a',
];

const TOPIC_KEYWORDS: Record<string, string[]> = {
  budget: [
    'budget',
    'expense',
    'expenses',
    'spending',
    'how much have i spent',
    'remaining budget',
  ],

  bookings: [
    'booking',
    'book',
    'my booking',
    'event date',
    'confirmed',
    'cancel my',
    'booking status',
  ],

  vendors_packages: [
    'vendor',
    'vendors',
    'photographer',
    'photography',
    'caterer',
    'catering',
    'decorator',
    'decoration',
    'dj',
    'makeup',
    'venue',
    'venues',
    'mehendi',
    'mehndi',
    'band',
    'package',
    'packages',
    'price',
    'pricing',
    'cost',
    'find me',
    'search',
    'category',
    'categories',
    'how much does',
    'show me',
    'suggest',
    'recommend',
    'options',
    'available',
    'list',
    'who can',
    'best',
  ],

  leads: [
    'lead',
    'leads',
    'inquiry',
    'inquiries',
    'new request',
  ],
};

const SITE_CONTENT_KEYWORDS: Record<string, string[]> = {
  'about-us': [
    'about',
    'who are you',
    'company',
    'about this platform',
    'who runs',
  ],

  'privacy-policy': [
    'privacy',
    'data policy',
    'personal data',
    'gdpr',
  ],

  terms: [
    'terms',
    'terms and conditions',
    'terms of service',
    'legal',
  ],

  faq: [
    'faq',
    'how do i',
    'how to',
    'how can i',
  ],

  pricing: [
    'pricing',
    'subscription',
    'fees',
    'how much does it cost to',
  ],
};

export interface VendorSuggestion {
  id: string;
  businessName: string;
  category: string;
}

@Injectable()
export class ChatbotService {
  private gemini: GoogleGenAI;

  constructor(private prisma: PrismaService) {
    this.gemini = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  private formatDecimal(val: any): string {
    return `₹${Number(val).toLocaleString('en-IN')}`;
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private matchTopics(message: string): string[] {
    const lower = message.toLowerCase();

    return Object.entries(TOPIC_KEYWORDS)
      .filter(([, keywords]) =>
        keywords.some((kw) => lower.includes(kw)),
      )
      .map(([topic]) => topic);
  }

  private matchSiteContentSlugs(message: string): string[] {
    const lower = message.toLowerCase();

    return Object.entries(SITE_CONTENT_KEYWORDS)
      .filter(([, keywords]) =>
        keywords.some((kw) => lower.includes(kw)),
      )
      .map(([slug]) => slug);
  }

  // ---------- BUDGET ----------

  private async getBudgetContext(
    userId: string,
  ): Promise<string> {
    const budget =
      await this.prisma.budget.findUnique({
        where: { userId },
        include: {
          expenses: {
            orderBy: { date: 'desc' },
            take: 15,
          },
        },
      });

    if (!budget) {
      return 'This user has not created a budget yet.';
    }

    // Total spent is aggregated over ALL expenses.
    const { _sum } =
      await this.prisma.expense.aggregate({
        where: {
          budgetId: budget.id,
        },
        _sum: {
          amount: true,
        },
      });

    const spent = Number(
      _sum.amount ?? 0,
    );

    const remaining =
      Number(budget.totalBudget) - spent;

    const expenseList =
      budget.expenses
        .map(
          (e) =>
            `- ${e.title} (${e.category}): ${this.formatDecimal(
              e.amount,
            )}${e.note ? ` — ${e.note}` : ''}`,
        )
        .join('\n') ||
      'No expenses logged yet.';

    return `Budget:
Total budget: ${this.formatDecimal(
      budget.totalBudget,
)}
Spent so far: ${this.formatDecimal(spent)}
Remaining: ${this.formatDecimal(remaining)}

Recent expenses:
${expenseList}`;
  }

  // ---------- BOOKINGS ----------

  private async getBookingsContext(
    userId: string,
    role: string,
  ): Promise<string> {
    if (role?.toUpperCase() === 'VENDOR') {
      const vendor =
        await this.prisma.vendor.findUnique({
          where: { userId },
          select: { id: true },
        });

      if (!vendor) {
        return 'This vendor has not completed their profile yet.';
      }

      const bookings =
        await this.prisma.booking.findMany({
          where: {
            vendorId: vendor.id,
          },
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            status: true,
            eventDate: true,
            totalAmount: true,
            paymentStatus: true,
            package: {
              select: {
                title: true,
              },
            },
          },
        });

      const list =
        bookings
          .map(
            (b) =>
              `- "${b.package.title}", ${b.eventDate.toDateString()}, status: ${b.status}, payment: ${b.paymentStatus}, amount: ${this.formatDecimal(
                b.totalAmount,
              )}`,
          )
          .join('\n') ||
        'No bookings yet.';

      return `This vendor's bookings:\n${list}`;
    }

    const bookings =
      await this.prisma.booking.findMany({
        where: {
          userId,
        },
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          status: true,
          eventDate: true,
          totalAmount: true,
          paymentStatus: true,

          vendor: {
            select: {
              businessName: true,
            },
          },

          package: {
            select: {
              title: true,
            },
          },
        },
      });

    const list =
      bookings
        .map(
          (b) =>
            `- "${b.package.title}" with ${b.vendor.businessName}, ${b.eventDate.toDateString()}, status: ${b.status}, payment: ${b.paymentStatus}, amount: ${this.formatDecimal(
              b.totalAmount,
            )}`,
        )
        .join('\n') ||
      'No bookings yet.';

    return `This user's bookings:\n${list}`;
  }

  // ---------- VENDORS / PACKAGES ----------

  private async getVendorsPackagesContext(
    message: string,
  ): Promise<{
    text: string;
    vendors: VendorSuggestion[];
  }> {
    const lower = message.toLowerCase();

    const allCategories =
      await this.prisma.category.findMany({
        select: {
          id: true,
          name: true,
        },
      });

    const matchedCategory =
      allCategories.find((c) => {
        const nameLower =
          c.name.toLowerCase();

        const singular =
          nameLower.replace(/s$/, '');

        const pattern = new RegExp(
          `\\b${this.escapeRegex(
            singular,
          )}s?\\b`,
          'i',
        );

        return pattern.test(lower);
      });

    const categoryWhere =
      matchedCategory
        ? {
            categoryId:
              matchedCategory.id,
          }
        : {};

    const [
      categories,
      vendors,
      packages,
    ] = await Promise.all([
      this.prisma.category.findMany({
        take: 30,
        select: {
          name: true,
        },
      }),

      this.prisma.vendor.findMany({
        take: matchedCategory
          ? 50
          : 25,

        where: categoryWhere,

        orderBy: {
          createdAt: 'desc',
        },

        select: {
          id: true,
          businessName: true,
          address: true,

          category: {
            select: {
              name: true,
            },
          },
        },
      }),

      this.prisma.package.findMany({
        take: matchedCategory
          ? 50
          : 30,

        where: categoryWhere,

        orderBy: {
          createdAt: 'desc',
        },

        select: {
          title: true,
          price: true,
          inclusions: true,

          vendor: {
            select: {
              id: true,
              businessName: true,
            },
          },

          category: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    const categoryList =
      categories
        .map((c) => c.name)
        .join(', ');

    const vendorList =
      vendors
        .map(
          (v) =>
            `- ${v.businessName} (${
              v.category?.name ??
              'Uncategorized'
            })${
              v.address
                ? `, ${v.address}`
                : ''
            }`,
        )
        .join('\n') ||
      (matchedCategory
        ? `No vendors found in the "${matchedCategory.name}" category.`
        : 'No vendors found.');

    const packageList =
      packages
        .map(
          (p) =>
            `- "${p.title}" by ${
              p.vendor.businessName
            } (${p.category.name}) — ${this.formatDecimal(
              p.price,
            )}${
              p.inclusions?.length
                ? `, includes: ${p.inclusions.join(
                    ', ',
                  )}`
                : ''
            }`,
        )
        .join('\n') ||
      (matchedCategory
        ? `No packages found in the "${matchedCategory.name}" category.`
        : 'No packages found.');

    const text = `Available categories: ${categoryList}

Vendors${
      matchedCategory
        ? ` in the "${matchedCategory.name}" category`
        : ' on the platform (sample)'
    }:
${vendorList}

Packages${
      matchedCategory
        ? ` in the "${matchedCategory.name}" category`
        : ' available (sample)'
    }:
${packageList}`;

    // Build deduped vendor list.
    const vendorMap =
      new Map<
        string,
        VendorSuggestion
      >();

    vendors.forEach((v) =>
      vendorMap.set(v.id, {
        id: v.id,
        businessName:
          v.businessName,
        category:
          v.category?.name ??
          'Uncategorized',
      }),
    );

    packages.forEach((p) =>
      vendorMap.set(
        p.vendor.id,
        {
          id: p.vendor.id,
          businessName:
            p.vendor.businessName,
          category:
            p.category.name,
        },
      ),
    );

    return {
      text,
      vendors: Array.from(
        vendorMap.values(),
      ).slice(0, 8),
    };
  }

  // ---------- LEADS ----------

  private async getLeadsContext(
    userId: string,
    role: string,
  ): Promise<string> {
    if (
      role?.toUpperCase() !==
      'VENDOR'
    ) {
      return '';
    }

    const vendor =
      await this.prisma.vendor.findUnique({
        where: { userId },
        select: { id: true },
      });

    if (!vendor) {
      return 'This vendor has not completed their profile yet.';
    }

    const leads =
      await this.prisma.lead.findMany({
        where: {
          vendorId: vendor.id,
        },
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          name: true,
          status: true,
          eventDate: true,
          guestCount: true,
          message: true,
        },
      });

    const list =
      leads
        .map(
          (l) =>
            `- ${l.name}, event on ${l.eventDate.toDateString()}, guests: ${l.guestCount}, status: ${l.status}`,
        )
        .join('\n') ||
      'No leads yet.';

    return `This vendor's leads:\n${list}`;
  }

  // ---------- SITE CONTENT ----------

  private async getSiteContentContext(
    slugs: string[],
  ): Promise<string> {
    if (slugs.length === 0) {
      return '';
    }

    const pages =
      await this.prisma.siteContent.findMany({
        where: {
          slug: {
            in: slugs,
          },
        },
      });

    if (pages.length === 0) {
      return '';
    }

    return `Platform information (answer using only this content for these topics):
${pages
  .map(
    (p) =>
      `--- ${p.title} ---\n${p.content}`,
  )
  .join('\n\n')}`;
  }

  // ---------- CONTEXT BUILDER ----------

  private async buildContext(
    userId: string,
    role: string,
    message: string,
  ): Promise<{
    text: string;
    suggestedVendors: VendorSuggestion[];
  }> {
    const topics =
      this.matchTopics(message);

    const siteSlugs =
      this.matchSiteContentSlugs(
        message,
      );

    const sections: string[] = [];

    let suggestedVendors: VendorSuggestion[] =
      [];

    if (
      role?.toUpperCase() !==
      'VENDOR'
    ) {
      if (
        topics.includes('budget')
      ) {
        sections.push(
          await this.getBudgetContext(
            userId,
          ),
        );
      }

      if (
        topics.includes('bookings')
      ) {
        sections.push(
          await this.getBookingsContext(
            userId,
            role,
          ),
        );
      }
    } else {
      sections.push(
        await this.getBookingsContext(
          userId,
          role,
        ),
      );

      const leadsCtx =
        await this.getLeadsContext(
          userId,
          role,
        );

      if (leadsCtx) {
        sections.push(leadsCtx);
      }
    }

    if (
      topics.includes(
        'vendors_packages',
      )
    ) {
      const {
        text,
        vendors,
      } =
        await this.getVendorsPackagesContext(
          message,
        );

      sections.push(text);

      suggestedVendors =
        vendors;
    } else {
      const categories =
        await this.prisma.category.findMany(
          {
            take: 30,
            select: {
              name: true,
            },
          },
        );

      if (categories.length > 0) {
        sections.push(
          `Available vendor categories on this platform: ${categories
            .map((c) => c.name)
            .join(', ')}.`,
        );
      }
    }

    if (siteSlugs.length > 0) {
      const siteCtx =
        await this.getSiteContentContext(
          siteSlugs,
        );

      if (siteCtx) {
        sections.push(siteCtx);
      }
    }

    return {
      text: sections.join(
        '\n\n',
      ),
      suggestedVendors,
    };
  }

  // ---------- PUBLIC METHODS ----------

  async sendMessage(
    userId: string,
    role: string,
    content: string,
  ) {
    const recent =
      await this.prisma.chatMessage.findMany(
        {
          where: {
            userId,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 19,
        },
      );

    const history =
      recent.reverse();

    await this.prisma.chatMessage.create(
      {
        data: {
          userId,
          role: 'USER',
          content,
        },
      },
    );

    const {
      text: dataContext,
      suggestedVendors,
    } =
      await this.buildContext(
        userId,
        role,
        content,
      );

    const baseInstruction =
      role?.toUpperCase() ===
      'VENDOR'
        ? VENDOR_INSTRUCTION
        : CUSTOMER_INSTRUCTION;

    const systemContent =
      dataContext
        ? `${baseInstruction}\n\n${dataContext}`
        : baseInstruction;

    const messages = [
      {
        role: 'system' as const,
        content: systemContent,
      },

      ...history.map((m) => ({
        role:
          m.role === 'USER'
            ? ('user' as const)
            : ('assistant' as const),

        content: m.content,
      })),

      {
        role: 'user' as const,
        content,
      },
    ];

    let replyText: string;

    try {
      const systemMessage =
        messages.find(
          (message) =>
            message.role ===
            'system',
        )?.content ??
        '';

      const conversation =
        messages
          .filter(
            (message) =>
              message.role !==
              'system',
          )
          .map((message) => ({
            role:
              message.role ===
              'assistant'
                ? 'model'
                : 'user',

            parts: [
              {
                text: message.content,
              },
            ],
          }));

      const response =
        await this.gemini.models.generateContent(
          {
            model:
              'gemini-3.6-flash',

            contents:
              conversation,

            config: {
              systemInstruction:
                systemMessage,

              maxOutputTokens: 1024,
            },
          },
        );

      replyText =
        response.text ??
        "Sorry, I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error(
        'Gemini API error:',
        error,
      );

      throw new InternalServerErrorException(
        'AI service is currently unavailable. Please try again later.',
      );
    }

    await this.prisma.chatMessage.create(
      {
        data: {
          userId,
          role: 'ASSISTANT',
          content: replyText,
        },
      },
    );

    return {
      reply: replyText,
      vendors: suggestedVendors,
    };
  }

  // ---------- VOICE ----------

  /**
   * Transcribes the uploaded audio using Gemini
   * and then sends the transcript through the
   * normal chatbot flow.
   */
  async transcribeAndRespond(
    userId: string,
    role: string,
    audioBuffer: Buffer,
    mimeType: string,
  ) {
    const normalizedMimeType =
      mimeType
        .split(';')[0]
        .trim()
        .toLowerCase();

    /*
     * Keep this check aligned with the
     * ChatbotController allowed MIME types.
     */
    if (
      !SUPPORTED_AUDIO_MIME_TYPES.includes(
        normalizedMimeType,
      )
    ) {
      throw new BadRequestException(
        `Unsupported audio format: ${normalizedMimeType}. Supported formats: ${SUPPORTED_AUDIO_MIME_TYPES.join(
          ', ',
        )}`,
      );
    }

    if (
      !audioBuffer ||
      audioBuffer.length === 0
    ) {
      throw new BadRequestException(
        'Audio file is empty. Please record your message again.',
      );
    }

    const format =
      normalizedMimeType.split('/')[1];

    if (
      !format ||
      !SUPPORTED_AUDIO_FORMATS.includes(
        format,
      )
    ) {
      throw new BadRequestException(
        `Unsupported audio format: ${
          format ?? normalizedMimeType
        }. Supported formats: ${SUPPORTED_AUDIO_FORMATS.join(
          ', ',
        )}`,
      );
    }

    let transcript: string;

    try {
      /*
       * Gemini receives the audio directly.
       *
       * We convert the Buffer to base64 because
       * Gemini's inlineData expects base64 encoded data.
       */
      const response =
        await this.gemini.models.generateContent(
          {
            model:
              'gemini-3.6-flash',

            contents: [
              {
                role: 'user',

                parts: [
                  {
                    inlineData: {
                      mimeType:
                        normalizedMimeType,
                      data: audioBuffer.toString(
                        'base64',
                      ),
                    },
                  },

                  {
                    text: `
Transcribe this audio exactly as spoken.

Return ONLY the transcription.
Do not add explanations.
Do not summarize.
Do not add quotation marks.
Preserve the meaning and wording of the speaker.
`,
                  },
                ],
              },
            ],

            config: {
              temperature: 0,
              maxOutputTokens: 1024,
            },
          },
        );

      transcript =
        response.text?.trim() ?? '';
    } catch (error) {
      console.error(
        'Gemini voice transcription error:',
        error,
      );

      throw new InternalServerErrorException(
        'Audio transcription failed. Please try again.',
      );
    }

    if (!transcript) {
      throw new BadRequestException(
        'Could not transcribe audio. Please speak clearly and try again.',
      );
    }

    /*
     * Send the transcript through the existing
     * chatbot flow.
     *
     * This keeps all existing functionality:
     * - Budget context
     * - Booking context
     * - Vendor/package search
     * - Leads
     * - Site content
     * - Chat history
     * - Gemini response generation
     */
    const result =
      await this.sendMessage(
        userId,
        role,
        transcript,
      );

    return {
      transcript,
      reply: result.reply,
      vendors: result.vendors,
    };
  }

  // ---------- HISTORY ----------

  async getHistory(
    userId: string,
  ) {
    return this.prisma.chatMessage.findMany(
      {
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    );
  }
}