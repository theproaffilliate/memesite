import PDFDocument from 'pdfkit';
import fs from 'fs';

// Create a document
const doc = new PDFDocument({ margin: 50 });

// Pipe its output somewhere, like to a file or HTTP response
doc.pipe(fs.createWriteStream('MEMEiD_Investor_Pitch_Deck.pdf'));

// Helper for consistent styling
const addSectionTitle = (title: string) => {
  doc.moveDown(1.5);
  doc.font('Helvetica-Bold').fontSize(18).text(title, { underline: true });
  doc.moveDown(0.5);
};

const addBullet = (text: string) => {
  doc.font('Helvetica').fontSize(12).text(`• ${text}`, { indent: 20, align: 'justify' });
  doc.moveDown(0.2);
};

const addParagraph = (text: string) => {
  doc.font('Helvetica').fontSize(12).text(text, { align: 'justify', lineGap: 2 });
  doc.moveDown(0.5);
};

// --- CONTENT ---

// Title Page
doc.font('Helvetica-Bold').fontSize(30).text('MEMEiD', { align: 'center' });
doc.moveDown(0.5);
doc.fontSize(20).text('The Future of Video Memes', { align: 'center' });
doc.moveDown(2);
doc.fontSize(12).text('Investor Pitch Deck - 2026', { align: 'center' });
doc.moveDown(3);

// Executive Summary
addSectionTitle('Executive Summary');
addParagraph(
  'MEMEiD is the premier destination for discovering, creating, and downloading high-quality video memes. We are building the infrastructure for the next generation of internet culture, solving the fragmentation in the meme ecosystem by providing a centralized, high-performance platform.'
);

// Current Status
addSectionTitle('Current Traction & Features');
addParagraph('Our MVP is live and gaining traction with a robust feature set:');
addBullet('Fully functional Video Meme Upload & Trimming tools.');
addBullet('High-speed, watermark-free downloads.');
addBullet('Advanced Search, Tagging, and Categorization.');
addBullet('User Authentication & Personalized Profiles.');
addBullet('Social features including Bookmarking and Sharing.');

// Future Integrations
addSectionTitle('Future Integrations & Roadmap');
addParagraph('To solidify our market position, we are developing cutting-edge integrations:');
addBullet('Direct Social Sharing: One-click posting to TikTok, Instagram Reels, and X (Twitter) APIs.');
addBullet('In-Browser Meme Studio: Advanced video editing tools including text overlays, motion tracking, and "deep-fry" effects.');
addBullet('AI-Powered Generation: Generative AI tools to create memes from text prompts or remix existing templates.');
addBullet('Mobile Application: Native iOS and Android apps for on-the-go meme discovery and creation.');
addBullet('Browser Extensions: "One-click save" extension to grab video memes from any website directly to your MEMEiD library.');

// Monetization
addSectionTitle('Monetization Strategy');
addParagraph('We have identified multiple high-value revenue streams:');
addBullet('Freemium Subscription (MEMEiD Pro): Monthly subscription offering 4K downloads, faster speeds, zero ads, and exclusive editing tools.');
addBullet('Creator Marketplace: A platform for top meme creators to sell exclusive templates, sticker packs, and assets.');
addBullet('API Licensing: Enterprise API access for marketing agencies, bots, and content platforms requiring a meme feed.');
addBullet('Merchandise Store: Print-on-demand integration for viral meme merchandise.');

// Sponsorship Enhancements
addSectionTitle('Sponsorship & Brand Partnerships');
addParagraph('As our user base grows, we unlock significant value for brand partners:');
addBullet('Sponsored Challenges: Brands sponsor weekly/monthly meme contests with cash prizes, driving engagement.');
addBullet('Branded Categories: Dedicated, curated feeds for movie releases, game launches, or product campaigns.');
addBullet('Native Advertising: Non-intrusive, meme-style sponsored content integrated into the discovery feed.');
addBullet('Creator Fund: Revenue sharing with top contributors to incentivize high-quality content production.');

// Conclusion
doc.moveDown(2);
addSectionTitle('The Ask');
addParagraph(
  'We are seeking investment to scale our infrastructure, expand our engineering team, and accelerate the development of our mobile and AI capabilities. Join us in defining the future of digital expression.'
);

doc.moveDown(2);
doc.font('Helvetica-Oblique').fontSize(10).text('Confidential - For Investor Review Only', { align: 'center' });

// Finalize PDF file
doc.end();

console.log('PDF generated successfully: MEMEiD_Investor_Pitch_Deck.pdf');
