/**
 * The work shown on the home page. Add a project here and it appears in the
 * grid; nothing else needs to change.
 */

export interface WorkShot {
  src: string;
  /** What this screen is: "Shop", "About". */
  label: string;
  /** Pixel size of the file, so the page can reserve the right space. */
  width: number;
  height: number;
}

export interface WorkProject {
  slug: string;
  name: string;
  /** One or two plain sentences about what it is and what was done. */
  description: string;
  /** Short facts shown beside the description. */
  facts: { label: string; value: string }[];
  url?: string;
  /** Longer account of the project, shown under the summary as titled parts. */
  story?: { title: string; text: string }[];
  /** Image used on the home page. Defaults to the first screen. */
  cover?: WorkShot;
  shots: WorkShot[];
}

/** Older screenshots that still need to be re-captured from the live sites. */
const legacy = (file: string, label: string, width = 1600, height = 1000): WorkShot => ({ src: `/images/${file}`, label, width, height });

export const work: WorkProject[] = [
  {
    slug: "healnote",
    name: "Healnote",
    description:
      "My own product: one medical record shared by two sides. Patients carry it in an iOS app, in Arabic and English. Clinics run their whole day on the web system, from the front desk to the consultation to the accounts. Healnote prepares every consult before it starts.",
    facts: [
      { label: "Role", value: "Founder, design and build" },
      { label: "Work", value: "iOS app for patients, web system for clinics" },
      { label: "Live", value: "healnote.health" },
    ],
    url: "https://healnote.health",
    story: [
      {
        title: "Why",
        text: "A patient's history is usually scattered: paper files in one clinic, a lab result in a chat, a prescription nobody can read. The doctor starts every visit by asking the same questions again. Healnote keeps the record in one place and puts it in front of the doctor before the patient sits down.",
      },
      {
        title: "For patients",
        text: "An iOS app, right to left in Arabic and left to right in English, with sign-in through Apple or Google. The record goes where the patient goes, and a visit booked in the app shows up in the clinic's queue marked as coming from the app.",
      },
      {
        title: "Reception",
        text: "The front desk sees the day as a live queue: upcoming from the app, waiting room, with the doctor, completed. A walk-in is checked in from one small form: find an existing patient or add a new one, assign a doctor or let the system choose, and mark the visit as first, follow-up or urgent.",
      },
      {
        title: "The consultation",
        text: "Each visit has its reason, diagnosis, prescriptions and SOAP notes on one page. Beside it, the Healnote Assistant reads the record and says what a careful colleague would: patterns worth worrying about, questions to ask, labs that are missing, and a recommended next step. It also says plainly when a record is too thin to draw anything from.",
      },
      {
        title: "The body, in 3D",
        text: "The patient file includes a full anatomical model. The doctor can fade the skin and switch systems on and off (skeleton, muscles, heart, arteries, veins, nerves and more) to show a patient exactly what is being talked about. Documents such as lab results and X-rays are uploaded to the same file.",
      },
      {
        title: "Running the clinic",
        text: "Owners get the business side too: profit and loss by month, with what was billed kept separate from what was actually collected and what is still owed; expenses; payroll; and profit targets set month by month and tracked against what was achieved. The statement says what its figures do not cover instead of showing a zero.",
      },
      {
        title: "Everything else",
        text: "Several branches under one account, doctors and staff with their own roles, appointments, analytics, WhatsApp reminders, printing, import of existing patient data, subscriptions, and a dark mode.",
      },
    ],
    shots: [
      { src: "/work/healnote/home.webp", label: "Home", width: 2400, height: 1156 },
      { src: "/work/healnote/statement.webp", label: "Statement", width: 2400, height: 1027 },
      { src: "/work/healnote/platforms.webp", label: "Web and iOS", width: 2400, height: 1121 },
      { src: "/work/healnote/stories.webp", label: "Stories", width: 2400, height: 1060 },
      { src: "/work/healnote/patient.webp", label: "Patient file, 3D anatomy", width: 2400, height: 1125 },
      { src: "/work/healnote/profit-loss.webp", label: "Profit and loss", width: 2400, height: 1118 },
      { src: "/work/healnote/targets.webp", label: "Profit targets", width: 2400, height: 1173 },
    ],
  },
  {
    slug: "jayash",
    name: "Jayash",
    description:
      "The online store for Jayash, a fashion house that makes each piece to order in limited, numbered editions. A quiet storefront that lets the photography lead: full-bleed campaign film on the home page, a shop with one or two columns, collections shown as lookbooks, and a returns flow.",
    facts: [
      { label: "Client", value: "Jayash Atelier" },
      { label: "Work", value: "E-commerce, design and build" },
      { label: "Live", value: "jayashatelier.com" },
    ],
    url: "https://jayashatelier.com",
    shots: [
      { src: "/work/jayash/home.webp", label: "Home", width: 2400, height: 1275 },
      { src: "/work/jayash/shop.webp", label: "Shop", width: 2400, height: 1289 },
      { src: "/work/jayash/collection.webp", label: "Collection", width: 2400, height: 1246 },
      { src: "/work/jayash/lookbook.webp", label: "Lookbook, W26 Paris", width: 2400, height: 1159 },
      { src: "/work/jayash/look.webp", label: "Look", width: 2400, height: 1156 },
      { src: "/work/jayash/about.webp", label: "About", width: 2400, height: 1090 },
      { src: "/work/jayash/returns.webp", label: "Return form", width: 2400, height: 1141 },
    ],
  },
  {
    slug: "unlimited",
    name: "Unlimited - Family",
    description:
      "One place for strength equipment and calisthenics. A dark, direct storefront for a brand that also trains people: a shop with search and categories, a cart, coaching applications in English and Arabic with interview booking, athlete reviews that appear once approved, and a full-screen menu.",
    facts: [
      { label: "Client", value: "Unlimited" },
      { label: "Work", value: "E-commerce and coaching" },
      { label: "Live", value: "unlimited-sw.com" },
    ],
    url: "https://unlimited-sw.com",
    cover: { src: "/work/unlimited/footer.webp", label: "Wordmark", width: 2400, height: 1089 },
    shots: [
      { src: "/work/unlimited/home.webp", label: "Home", width: 2400, height: 1247 },
      { src: "/work/unlimited/about.webp", label: "About", width: 2400, height: 1283 },
      { src: "/work/unlimited/shop.webp", label: "Shop", width: 2400, height: 1287 },
      { src: "/work/unlimited/apply.webp", label: "Apply to coach", width: 2400, height: 1228 },
      { src: "/work/unlimited/menu.webp", label: "Menu", width: 2400, height: 1227 },
      { src: "/work/unlimited/reviews.webp", label: "Reviews", width: 2400, height: 735 },
      { src: "/work/unlimited/footer.webp", label: "Footer", width: 2400, height: 1089 },
    ],
  },
  {
    slug: "deya",
    name: "Deya Couture",
    description:
      "The online store for Deya Couture, a modest-fashion label in Cairo. Wide white pages, a fine serif for names and prices, and photography given half the screen: a home page that opens on the collection, a product page with colour and size, a shop with filters in Arabic, a contact form and a newsletter.",
    facts: [
      { label: "Client", value: "Deya Couture" },
      { label: "Work", value: "E-commerce" },
      { label: "Live", value: "deyacouture.com" },
    ],
    url: "https://deyacouture.com",
    cover: { src: "/work/deya/footer.webp", label: "Wordmark", width: 2400, height: 839 },
    shots: [
      { src: "/work/deya/home.webp", label: "Home", width: 2400, height: 1199 },
      { src: "/work/deya/products.webp", label: "Products", width: 2400, height: 1178 },
      { src: "/work/deya/product.webp", label: "Product", width: 2400, height: 1272 },
      { src: "/work/deya/contact.webp", label: "Contact", width: 2400, height: 1269 },
      { src: "/work/deya/footer.webp", label: "Footer", width: 2400, height: 839 },
    ],
  },
  {
    slug: "giaro",
    name: "Giaro",
    description:
      "The online store for Giaro, a food brand selling dates, nuts, coffee, olive oil and sweets. Built in Arabic and English, right to left and left to right: a home page that moves through the products, a catalog of categories, a shop with offers and filters, and product film woven between the sections.",
    facts: [
      { label: "Client", value: "Giaro" },
      { label: "Work", value: "E-commerce, Arabic and English" },
      { label: "Live", value: "giaromart.com" },
    ],
    url: "https://www.giaromart.com/ar",
    shots: [
      { src: "/work/giaro/home.webp", label: "Home", width: 2400, height: 1266 },
      { src: "/work/giaro/catalog.webp", label: "Catalog", width: 2400, height: 941 },
      { src: "/work/giaro/shop.webp", label: "Shop, Arabic", width: 2400, height: 1052 },
      { src: "/work/giaro/statement.webp", label: "Statement", width: 2400, height: 1077 },
      { src: "/work/giaro/showcase.webp", label: "Showcase", width: 2400, height: 1146 },
      { src: "/work/giaro/film.webp", label: "Film", width: 2400, height: 958 },
      { src: "/work/giaro/shopping.webp", label: "Shopping", width: 2400, height: 1122 },
    ],
  },
  {
    slug: "ocasoo",
    name: "Ocasoo",
    description:
      "The online store for Ocasoo, a streetwear label. Plain and fast, in English and Arabic: a full-screen opening, new arrivals, a cart, and a checkout built for Egypt, with governorate and city, shipping worked out from the address, promo codes and a button that finds your location.",
    facts: [
      { label: "Client", value: "Ocasoo" },
      { label: "Work", value: "E-commerce, English and Arabic" },
      { label: "Live", value: "ocasoo.com" },
    ],
    url: "https://ocasoo.com/en",
    cover: { src: "/work/ocasoo/footer.webp", label: "Wordmark", width: 2400, height: 843 },
    shots: [
      { src: "/work/ocasoo/home.webp", label: "Home", width: 2400, height: 1181 },
      { src: "/work/ocasoo/arrivals.webp", label: "New arrivals", width: 2400, height: 1049 },
      { src: "/work/ocasoo/cart.webp", label: "Cart", width: 2400, height: 1113 },
      { src: "/work/ocasoo/checkout.webp", label: "Checkout", width: 2400, height: 1074 },
      { src: "/work/ocasoo/contact.webp", label: "Contact", width: 2400, height: 1070 },
      { src: "/work/ocasoo/footer.webp", label: "Footer", width: 2400, height: 843 },
    ],
  },
  {
    slug: "target",
    name: "Target Team",
    description:
      "The site for Target Team, a well-known student organisation at Mansoura University that runs charity work, community service and events. One calm blue from top to bottom: an opening that announces recruitment, who they are and what they stand for, photographs of the team, and an application form that replaces the usual spreadsheet link.",
    facts: [
      { label: "Client", value: "Target Team, Mansoura University" },
      { label: "Work", value: "Website and recruitment form" },
      { label: "Live", value: "target-psi-eight.vercel.app" },
    ],
    url: "https://target-psi-eight.vercel.app/",
    shots: [
      { src: "/work/target/home.webp", label: "Home", width: 2400, height: 1227 },
      { src: "/work/target/about.webp", label: "About", width: 2400, height: 1229 },
      { src: "/work/target/gallery.webp", label: "Gallery", width: 2400, height: 888 },
      { src: "/work/target/apply.webp", label: "Application", width: 2400, height: 1267 },
      { src: "/work/target/menu.webp", label: "Menu", width: 2400, height: 1216 },
      { src: "/work/target/footer.webp", label: "Footer", width: 2400, height: 1241 },
    ],
  },
  {
    slug: "warda",
    name: "Warda",
    description:
      "A fully custom online store for Warda the Florist, a boutique flower shop in Giza. Built from nothing rather than on a template: a home page that opens with a flower drawing itself in one line on paper, numbered categories, latest arrivals, a bouquet builder, a shopping bag that slides in beside the shop, and a checkout made for Egypt with governorate, area and landmark, a button that finds your location, and promo codes.",
    facts: [
      { label: "Client", value: "Warda the Florist" },
      { label: "Work", value: "Custom e-commerce, design and build" },
      { label: "Live", value: "shopwarda.com" },
    ],
    url: "https://shopwarda.com",
    cover: { src: "/work/warda/categories.webp", label: "Boxes", width: 2400, height: 1088 },
    shots: [
      { src: "/work/warda/home.webp", label: "Home", width: 2400, height: 1276 },
      { src: "/work/warda/categories.webp", label: "Categories", width: 2400, height: 1088 },
      { src: "/work/warda/arrivals.webp", label: "Latest arrivals", width: 2400, height: 1086 },
      { src: "/work/warda/bag.webp", label: "Shopping bag", width: 2400, height: 1268 },
      { src: "/work/warda/checkout.webp", label: "Checkout", width: 2400, height: 1084 },
      { src: "/work/warda/footer.webp", label: "Footer", width: 2400, height: 962 },
    ],
  },
  {
    slug: "ne-coach",
    name: "NE Coach",
    description: "A coach's practice turned digital: clients subscribe and get coaching through live chat, powered by TalkJS.",
    facts: [
      { label: "Work", value: "Coaching platform" },
      { label: "Live", value: "nader-emad.vercel.app" },
    ],
    url: "https://nader-emad.vercel.app/",
    shots: [
      legacy("NaderOne-image.png", "Home"),
      legacy("NaderTwo-image.png", "Screen 2"),
      legacy("NaderThree-image.png", "Screen 3"),
      legacy("NaderFour-image.png", "Screen 4"),
    ],
  },
  {
    slug: "farag",
    name: "Farag",
    description: "A brand identity and site for a photography studio, built on minimalist principles with Three.js, GSAP and Motion.",
    facts: [
      { label: "Work", value: "Photography, branding" },
      { label: "Live", value: "https://faragg.vercel.app/" },
    ],
    url: "https://faragg.vercel.app/",
    shots: [
      legacy("FaragOne-image.png", "Home"),
      legacy("FaragTwo-image.png", "Screen 2"),
      legacy("FaragThree-image.png", "Screen 3"),
      legacy("FaragFour-image.png", "Screen 4"),
      legacy("FaragFive-image.png", "Screen 5"),
      legacy("FaragSix-image.png", "Screen 6"),
    ],
  },
];

/** Screens saved by this project come in two widths; the browser picks the one it needs. */
export function srcSet(shot: WorkShot): string | undefined {
  return shot.src.startsWith("/work/") ? `${shot.src.replace(/\.webp$/, "-1200.webp")} 1200w, ${shot.src} ${shot.width}w` : undefined;
}
