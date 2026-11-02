export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  category: string;
  collection: 'Knitwear' | 'Outerwear' | 'Tailoring' | 'The Weekend';
  badge?: string;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  description: string;
  details: string[];
  fabric: string;
  care: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  stock: Record<string, number>; // size -> count
  images: string[];
  pairsWellWithIds?: string[];
}

export const CATEGORIES = [
  { id: 'all', name: 'All Collection', count: 14, icon: 'Sparkles' },
  { id: 'new', name: 'New Arrivals', count: 5, icon: 'Clock' },
  { id: 'bestsellers', name: 'Best Sellers', count: 4, icon: 'Flame' },
  { id: 'jackets', name: 'Jackets', count: 3, icon: 'Shield' },
  { id: 'polos', name: 'Polos', count: 2, icon: 'Shirt' },
  { id: 'sweaters', name: 'Sweaters', count: 2, icon: 'Layers' },
  { id: 'sweatshirts', name: 'Sweatshirts', count: 2, icon: 'Feather' },
  { id: 't-shirts', name: 'T-Shirts', count: 2, icon: 'Smile' },
  { id: 'trousers', name: 'Trousers', count: 2, icon: 'Scissors' },
  { id: 'shorts', name: 'Shorts', count: 1, icon: 'Sun' },
  { id: 'accessories', name: 'Accessories', count: 2, icon: 'Compass' },
] as const;

export const COLLECTIONS = [
  {
    id: 'Outerwear',
    name: 'Outerwear',
    tagline: 'Quiet protection against the elements',
    count: 3,
    image: 'https://avignonusa.com/wp-content/uploads/2026/09/collar-jacket.webp',
  },
  {
    id: 'Knitwear',
    name: 'Knitwear',
    tagline: 'Tactile warmth, honest European yarns',
    count: 4,
    image: 'https://avignonusa.com/wp-content/uploads/2026/09/textured-knit-polo.webp',
  },
  {
    id: 'Tailoring',
    name: 'Tailoring',
    tagline: 'Architectural drape with relaxed ease',
    count: 3,
    image: 'https://avignonusa.com/wp-content/uploads/2026/09/pleated-trouser.webp',
  },
  {
    id: 'The Weekend',
    name: 'The Weekend',
    tagline: 'Unstructured comfort for slower days',
    count: 4,
    image: 'https://avignonusa.com/wp-content/uploads/2026/09/crewneck-sweatshirt.webp',
  },
] as const;

export const PRODUCTS: Product[] = [
  {
    id: 'collar-jacket',
    slug: 'collar-jacket',
    title: 'Collar Jacket',
    subtitle: 'Brushed Cotton Flannel · Antique Hardware',
    price: 168,
    category: 'Jackets',
    collection: 'Outerwear',
    badge: 'Signature',
    isBestSeller: true,
    isFeatured: true,
    description:
      'A considered everyday outerwear essential — clean lines, quiet details and a relaxed, modern fit. Cut from dense double-faced brushed cotton with custom antique silver hardware and French interior bound seams.',
    details: [
      'Relaxed straight silhouette designed for effortless layering',
      'Heavyweight 420 GSM brushed double-faced cotton canvas',
      'Dual welt chest pockets with concealed YKK antique silver zipper',
      'Hand-finished interior horn button cuffs',
      'Pre-washed for a lived-in drape that softens with every wear',
    ],
    fabric: '100% Heavyweight Organic Brushed Cotton',
    care: 'Dry clean recommended or machine wash cold gentle, hang dry in shade',
    colors: [
      { name: 'Washed Charcoal', hex: '#26282B' },
      { name: 'Espresso', hex: '#3B2F2F' },
      { name: 'Raw Olive', hex: '#4A4F44' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { S: 5, M: 2, L: 8, XL: 4, XXL: 1 },
    images: [
      'https://avignonusa.com/wp-content/uploads/2026/09/collar-jacket.webp',
      '/src/assets/images/campaign_fw26_atelier_1793406475469.jpg',
    ],
    pairsWellWithIds: ['pleated-trouser', 'textured-knit-polo', 'cardholder'],
  },
  {
    id: 'textured-knit-polo',
    slug: 'textured-knit-polo',
    title: 'Textured Knit Polo',
    subtitle: 'Open-Stitch Mako Cotton · Riviera Collar',
    price: 68,
    category: 'Polos',
    collection: 'Knitwear',
    badge: 'Trending',
    isNewArrival: true,
    isFeatured: true,
    isTrending: true,
    description:
      'A textured open-knit polo inspired by mid-century French Riviera tailoring with modern American ease. Crafted from breathable open-stitch organic combed cotton with Australian mother-of-pearl button placket.',
    details: [
      'Artisanal open-stitch chevron mesh texture for supreme breathability',
      'Naturally cooling long-staple combed cotton',
      'Seamless ribbed point collar and clean ribbed cuffs',
      'Tailored fit through torso with slight taper',
    ],
    fabric: '100% Long-Staple Combed Organic Cotton',
    care: 'Hand wash cold or gentle machine cycle in laundry bag; dry flat',
    colors: [
      { name: 'Chalk Cream', hex: '#EAE6DF' },
      { name: 'Slate Navy', hex: '#1E2530' },
      { name: 'Washed Black', hex: '#1C1C1E' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: { XS: 3, S: 7, M: 12, L: 6, XL: 2 },
    images: [
      'https://avignonusa.com/wp-content/uploads/2026/09/textured-knit-polo.webp',
      'https://avignonusa.com/wp-content/uploads/2026/10/Ribbed-Polo-Minimalist-Fashion-Ad.webp',
    ],
    pairsWellWithIds: ['pleated-trouser', 'collar-jacket', 'relaxed-shorts'],
  },
  {
    id: 'pleated-trouser',
    slug: 'pleated-trouser',
    title: 'Pleated Trouser',
    subtitle: 'Double Reverse Pleat · Fluid Wool-Blend',
    price: 84,
    category: 'Trousers',
    collection: 'Tailoring',
    badge: 'Core Icon',
    isBestSeller: true,
    isFeatured: true,
    description:
      'Double reverse front pleats cut from a mid-weight wrinkle-resistant wool-blend flannel. Tailored through the seat with a relaxed, architectural straight-leg drape that stacks cleanly over loafers or minimal sneakers.',
    details: [
      'Deep double front reverse pleats for dimensional movement',
      'Interior curtain waistband with rubberized shirt-stay grip',
      'Hidden coin pocket and cleanly jetted rear button pockets',
      'Pre-cuffed hem with 2-inch allowance for tailor alterations',
    ],
    fabric: '65% Italian Fine Wool, 30% Lyocell, 5% Elastane',
    care: 'Dry clean only. Steam between wears to maintain clean crease lines',
    colors: [
      { name: 'Deep Charcoal', hex: '#2F3136' },
      { name: 'Sand Khaki', hex: '#A39988' },
      { name: 'Midnight Navy', hex: '#1A1E29' },
    ],
    sizes: ['28', '30', '32', '34', '36'],
    stock: { '28': 3, '30': 6, '32': 9, '34': 5, '36': 2 },
    images: [
      'https://avignonusa.com/wp-content/uploads/2026/09/pleated-trouser.webp',
      '/src/assets/images/editorial_onboarding_look_1793406475024.jpg',
    ],
    pairsWellWithIds: ['collar-jacket', 'textured-knit-polo', 'fuzzy-cardigan'],
  },
  {
    id: 'fuzzy-cardigan',
    slug: 'fuzzy-cardigan',
    title: 'Fuzzy Cardigan',
    subtitle: 'Mohair-Alpaca Blend · Dropped Shoulder',
    price: 92,
    category: 'Sweaters',
    collection: 'Knitwear',
    badge: 'Limited',
    isNewArrival: true,
    isTrending: true,
    description:
      'Brushed mohair-alpaca blend with substantial warmth and a plush tactile hand. Finished with genuine horn buttons and dropped shoulder seams for an effortless silhouette.',
    details: [
      'Cloud-soft brushed surface texture with zero itch guarantee',
      'Custom dark natural horn buttons',
      'Ribbed deep V-neckline designed to showcase t-shirts or knit polos',
      'Reinforced placket for longevity',
    ],
    fabric: '40% Kid Mohair, 35% Baby Alpaca, 25% Polyamide core',
    care: 'Hand wash cold with wool detergent; lay flat on towel to dry',
    colors: [
      { name: 'Oatmeal Melange', hex: '#D2C8BA' },
      { name: 'Moss Green', hex: '#4B5340' },
      { name: 'Ink Noir', hex: '#161719' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: { S: 2, M: 4, L: 3, XL: 1 },
    images: [
      'https://avignonusa.com/wp-content/uploads/2026/09/fuzzy-cardigan.webp',
      '/src/assets/images/editorial_onboarding_look_1793406475024.jpg',
    ],
    pairsWellWithIds: ['pleated-trouser', 'crewneck-sweatshirt', 'cardholder'],
  },
  {
    id: 'crewneck-sweatshirt',
    slug: 'crewneck-sweatshirt',
    title: 'Crewneck Sweatshirt',
    subtitle: '500 GSM Loopback Terry · Gusseted',
    price: 78,
    category: 'Sweatshirts',
    collection: 'The Weekend',
    badge: 'Core',
    isBestSeller: true,
    description:
      '500 GSM loopback French terry milled exclusively for Avignon USA. Pre-shrunk with ribbed side gussets, V-notch collar insert, and flatlock stitch reinforcement.',
    details: [
      'Substantial 500 GSM heavyweight French terry cotton',
      'Side rib inserts for athletic stretch and recovery',
      'Classic heritage triangle V-insert at collar',
      'Pre-washed with organic enzyme softeners for vintage hand-feel',
    ],
    fabric: '100% Combed Heavyweight French Cotton Terry',
    care: 'Machine wash cold with like colors, tumble dry low or line dry',
    colors: [
      { name: 'Heather Grey', hex: '#9E9E9E' },
      { name: 'Vintage Black', hex: '#232325' },
      { name: 'Natural Ecru', hex: '#ECE8DF' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { S: 8, M: 14, L: 11, XL: 6, XXL: 3 },
    images: [
      'https://avignonusa.com/wp-content/uploads/2026/09/crewneck-sweatshirt.webp',
    ],
    pairsWellWithIds: ['utility-pant', 'relaxed-shorts', 'collar-jacket'],
  },
  {
    id: 'overshirt-jacket',
    slug: 'overshirt-jacket',
    title: 'Overshirt Jacket',
    subtitle: 'Italian Cotton Moleskin · Side Pockets',
    price: 128,
    category: 'Jackets',
    collection: 'Outerwear',
    badge: 'FW 2026',
    isNewArrival: true,
    description:
      'Heavyweight moleskin overshirt designed to bridge the gap between indoor layering and outdoor warmth. Features dual patch chest pockets with hidden side seam hand-warmers.',
    details: [
      'Italian cotton moleskin with brushed suede-like finish',
      'Dual top-entry chest pockets with flap closure',
      'Discreet integrated side entry hand-warmer pockets',
      'Structured collar that stands neatly when buttoned',
    ],
    fabric: '100% Heavy Cotton Moleskin (380 GSM)',
    care: 'Machine wash cold inside-out, hang dry',
    colors: [
      { name: 'Tobacco Brown', hex: '#5E4331' },
      { name: 'Washed Olive', hex: '#3E4438' },
      { name: 'Black Coal', hex: '#18191B' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: { S: 4, M: 7, L: 5, XL: 2 },
    images: [
      'https://avignonusa.com/wp-content/uploads/2026/09/overshirt-jacket.webp',
      '/src/assets/images/campaign_fw26_atelier_1793406475469.jpg',
    ],
    pairsWellWithIds: ['pleated-trouser', 'textured-knit-polo', 'half-zip-knit'],
  },
  {
    id: 'puffer-jacket',
    slug: 'puffer-jacket',
    title: 'Puffer Jacket',
    subtitle: '750-Fill Down · Matte Japanese Ripstop',
    price: 188,
    category: 'Jackets',
    collection: 'Outerwear',
    badge: 'Sub-Zero',
    isFeatured: true,
    description:
      'Architectural channel-quilted down jacket with water-repellent Japanese ripstop shell. Filled with 750-fill certified goose down for extreme warmth with featherweight comfort.',
    details: [
      'Water-repellent DWR Japanese micro-ripstop shell',
      '750-fill Responsible Down Standard (RDS) certified insulation',
      'Fleece-lined storm pockets and interior storm cuffs',
      'Dual two-way YKK waterproof front zipper',
    ],
    fabric: 'Outer: 100% Recycled Japanese Ripstop Nylon; Fill: 90/10 White Goose Down',
    care: 'Specialist down clean or machine wash cold gentle with down wash, tumble dry low with dryer balls',
    colors: [
      { name: 'Matte Black', hex: '#111215' },
      { name: 'Fog Grey', hex: '#6D7278' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { S: 3, M: 5, L: 4, XL: 3, XXL: 1 },
    images: [
      'https://avignonusa.com/wp-content/uploads/2026/09/puffer-jacket.webp',
      'https://avignonusa.com/wp-content/uploads/2026/10/Minimalist-Puffer-Jacket-Editorial.webp',
    ],
    pairsWellWithIds: ['pleated-trouser', 'crewneck-sweatshirt', 'utility-pant'],
  },
  {
    id: 'half-zip-knit',
    slug: 'half-zip-knit',
    title: 'Half-Zip Knit Sweater',
    subtitle: 'Brioche Rib Knit · Swiss RiRi Hardware',
    price: 115,
    category: 'Sweaters',
    collection: 'Knitwear',
    badge: 'New Arrival',
    isNewArrival: true,
    description:
      'Ribbed brioche-stitch pullover crafted from extrafine Australian merino wool with polished RiRi antique silver quarter zipper and protective stand collar.',
    details: [
      'Chunky 7-gauge double brioche stitch for temperature regulation',
      'High-grade Swiss RiRi silver-tone quarter zip',
      'Tubular knit hem and collar that will never lose its shape',
      'Odor-resistant natural merino fibers',
    ],
    fabric: '100% Extrafine 19.5-Micron Australian Merino Wool',
    care: 'Dry clean or hand wash cold with wool wash, dry flat',
    colors: [
      { name: 'Deep Navy', hex: '#1B2230' },
      { name: 'Stone Grey', hex: '#777B80' },
      { name: 'Ivory Bone', hex: '#EAE5DB' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: { S: 4, M: 6, L: 5, XL: 2 },
    images: [
      'https://avignonusa.com/wp-content/uploads/2026/09/half-zip-knit.webp',
      '/src/assets/images/editorial_onboarding_look_1793406475024.jpg',
    ],
    pairsWellWithIds: ['pleated-trouser', 'overshirt-jacket', 'collar-jacket'],
  },
  {
    id: 'ribbed-polo',
    slug: 'ribbed-polo',
    title: 'Ribbed Knit Polo',
    subtitle: 'Combed Egyptian Mako · Clean Placket',
    price: 72,
    category: 'Polos',
    collection: 'Knitwear',
    badge: 'Exclusive',
    isTrending: true,
    description:
      'Vertical rib-knit polo in pure combed Egyptian mako cotton. Features a sleek point collar with concealed button placket and tonal stitch detailing.',
    details: [
      'Fine 14-gauge rib structure that moves smoothly with the torso',
      'Concealed placket with hidden Japanese horn buttons',
      'Ribbed cuffs and waistband designed to sit cleanly on trouser waistlines',
    ],
    fabric: '100% Giza Egyptian Long-Staple Combed Cotton',
    care: 'Machine wash delicate cold in mesh bag, dry flat',
    colors: [
      { name: 'Espresso Brown', hex: '#382D26' },
      { name: 'Cloud White', hex: '#F3F4F6' },
      { name: 'Dark Slate', hex: '#2B313A' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: { S: 3, M: 8, L: 6, XL: 2 },
    images: [
      'https://avignonusa.com/wp-content/uploads/2026/10/Ribbed-Polo-Minimalist-Fashion-Ad.webp',
      'https://avignonusa.com/wp-content/uploads/2026/09/textured-knit-polo.webp',
    ],
    pairsWellWithIds: ['pleated-trouser', 'collar-jacket', 'relaxed-shorts'],
  },
  {
    id: 'utility-pant',
    slug: 'utility-pant',
    title: 'Utility Pant',
    subtitle: 'Articulated Knee · Japanese Twill',
    price: 79,
    category: 'Trousers',
    collection: 'Tailoring',
    badge: 'Utility',
    description:
      'Modernized carpenter pant featuring articulated knee darts, subtle tool pocket, and double-needle reinforced chainstitching throughout.',
    details: [
      'Durable 320 GSM combed cotton twill',
      'Articulated ergonomic knee darts for unrestricted range of motion',
      'Low-profile carpenter loop and discreet utility slip pocket',
      'Garment-dyed for subtle wash patina',
    ],
    fabric: '100% Combed Cotton Twill (320 GSM)',
    care: 'Machine wash warm, tumble dry low. Fades gracefully with wash',
    colors: [
      { name: 'Khaki Stone', hex: '#948D80' },
      { name: 'Overdyed Black', hex: '#1C1D20' },
      { name: 'Clay Rust', hex: '#7E5244' },
    ],
    sizes: ['28', '30', '32', '34', '36'],
    stock: { '28': 4, '30': 7, '32': 10, '34': 6, '36': 2 },
    images: [
      'https://avignonusa.com/wp-content/uploads/2026/09/utility-pant.webp',
    ],
    pairsWellWithIds: ['crewneck-sweatshirt', 'collar-jacket', 'overshirt-jacket'],
  },
  {
    id: 'relaxed-shorts',
    slug: 'relaxed-shorts',
    title: 'Relaxed Shorts',
    subtitle: 'Typewriter Cotton · Drawstring Waist',
    price: 64,
    category: 'Shorts',
    collection: 'The Weekend',
    badge: 'Summer Core',
    description:
      'Tailored 6.5-inch inseam shorts cut from crisp Japanese typewriter cotton. Elasticated drawstring waistband with tonal metal aglets and deep front slash pockets.',
    details: [
      'Crisp high-density typewriter cotton that holds its architectural shape',
      '6.5" inseam hitting right above the knee',
      'Elastic waist with braided cotton drawstring and matte metal tips',
      'Rear patch pocket with tonal embroidery',
    ],
    fabric: '100% High-Density Japanese Typewriter Cotton',
    care: 'Machine wash cold, air dry to preserve crisp texture',
    colors: [
      { name: 'Chalk White', hex: '#F0ECE1' },
      { name: 'Sage Green', hex: '#586355' },
      { name: 'Washed Navy', hex: '#212936' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: { S: 5, M: 8, L: 6, XL: 2 },
    images: [
      'https://avignonusa.com/wp-content/uploads/2026/09/category-oversized-tee.webp',
      'https://avignonusa.com/wp-content/uploads/2026/09/textured-knit-polo.webp',
    ],
    pairsWellWithIds: ['textured-knit-polo', 'ribbed-polo', 'crewneck-sweatshirt'],
  },
  {
    id: 'category-oversized-tee',
    slug: 'category-oversized-tee',
    title: 'Category Oversized Tee',
    subtitle: '300 GSM Heavyweight Jersey · Boxy Cut',
    price: 52,
    category: 'T-Shirts',
    collection: 'The Weekend',
    badge: 'Essential',
    isBestSeller: true,
    description:
      'The definitive heavyweight everyday t-shirt. Cut in a contemporary boxy drape with dropped shoulders and a high, thick ribbed collar that never sags.',
    details: [
      '300 GSM combed long-staple cotton jersey',
      'Thick 1-inch 1x1 rib collar band',
      'Blind stitched sleeves and hem',
      'Seamless tubular body construction',
    ],
    fabric: '100% Ring-Spun Combed Cotton Jersey',
    care: 'Machine wash cold, tumble dry delicate',
    colors: [
      { name: 'Bone White', hex: '#F5F3EC' },
      { name: 'Washed Black', hex: '#222326' },
      { name: 'Faded Espresso', hex: '#3E342F' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: { XS: 4, S: 10, M: 15, L: 9, XL: 4 },
    images: [
      'https://avignonusa.com/wp-content/uploads/2026/09/category-oversized-tee.webp',
    ],
    pairsWellWithIds: ['pleated-trouser', 'utility-pant', 'collar-jacket'],
  },
  {
    id: 'cardholder',
    slug: 'cardholder',
    title: 'Atelier Leather Cardholder',
    subtitle: 'Tuscan Calfskin · Blind Debossed Mark',
    price: 55,
    category: 'Accessories',
    collection: 'The Weekend',
    badge: 'Gift Pick',
    isNewArrival: true,
    description:
      'Hand-stitched Tuscan vegetable-tanned calfskin with 4 card slots and center cash compartment. Finished with hand-painted burnished edges and blind debossed Avignon USA mark.',
    details: [
      '100% full-grain Tuscan vegetable-tanned calfskin',
      '4 card slots (holds 8+ cards comfortably)',
      'Center cash slip pocket lined with moiré silk',
      'Debossed with subtle Avignon mark on front',
    ],
    fabric: '100% Vegetable-Tanned Tuscan Calf Leather',
    care: 'Treat occasionally with natural leather balm; avoid prolonged moisture',
    colors: [
      { name: 'Noir Black', hex: '#121214' },
      { name: 'Saddle Tan', hex: '#8B5A2B' },
    ],
    sizes: ['One Size'],
    stock: { 'One Size': 18 },
    images: [
      '/src/assets/images/luxury_leather_cardholder_1793406475540.jpg',
    ],
    pairsWellWithIds: ['collar-jacket', 'pleated-trouser'],
  },
  {
    id: 'wool-scarf',
    slug: 'wool-scarf',
    title: 'Minimalist Wool Scarf',
    subtitle: 'Extrafine Merino · Hand-Rolled Fringe',
    price: 65,
    category: 'Accessories',
    collection: 'Knitwear',
    badge: 'FW 2026',
    description:
      '100% fine Merino wool knitted with a refined micro-waffle rib. Enveloping warmth without bulk, finished with clean hand-rolled edges.',
    details: [
      'Generous 200cm x 45cm dimensions for versatile styling',
      'Extremely soft non-scratch 19.5 micron merino fibers',
      'Subtle self-fringe hem',
    ],
    fabric: '100% Fine Merino Wool',
    care: 'Dry clean only',
    colors: [
      { name: 'Camel Tan', hex: '#B8976C' },
      { name: 'Charcoal Grey', hex: '#373A40' },
      { name: 'Ecru Bone', hex: '#ECE7DC' },
    ],
    sizes: ['One Size'],
    stock: { 'One Size': 12 },
    images: [
      '/src/assets/images/editorial_onboarding_look_1793406475024.jpg',
    ],
    pairsWellWithIds: ['collar-jacket', 'puffer-jacket', 'fuzzy-cardigan'],
  },
];
