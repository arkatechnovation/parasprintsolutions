const fs = require('fs');
const original = (name) => JSON.parse(fs.readFileSync(`../backend/data/original/${name}.json`));
const inventory = original('assets');
const all = [inventory.logo, ...inventory.items, ...inventory.industryImages];
const image = (src, alt) => {
  const a = all.find((a) => a.path === src);
  return {
    src,
    alt: alt || a?.caption || 'Paras Prints Solutions',
    width: a?.width || 1200,
    height: a?.height || 896,
    kind:
      src.includes('Company Profile') ||
      ['about-boxes.jpg', 'products-showcase.jpg', 'hero-brochure-cover.jpg'].some((s) =>
        src.endsWith(s),
      )
        ? 'document'
        : src.endsWith('logo.png')
          ? 'brand'
          : 'illustrative',
  };
};
const faq = (question, answer, category = 'General') => ({ question, answer, category });
const faqs = [
  faq(
    'Can packaging be customised?',
    'The published portfolio includes corrugated boxes, duplex monocartons and paper bags. Share your product, dimensions, artwork and intended use so the team can confirm a suitable configuration.',
    'Customisation',
  ),
  faq(
    'What is the minimum order quantity?',
    'A single verified minimum order quantity is not available. Include your required quantity in your enquiry; the team will confirm production suitability and pricing.',
    'Orders',
  ),
  faq(
    'What should I include in a quotation request?',
    'Send the product category, quantity, dimensions with units, material preferences, printing and finishing requirements, delivery city and artwork if available.',
    'Quotation',
  ),
  faq(
    'Which printing options are listed?',
    'The published product information describes offset printing for commercial print and printed packaging. The exact colour, paper and finishing combination will be confirmed for your job.',
    'Printing',
  ),
  faq(
    'Can I request a material recommendation?',
    'Yes. Describe the product weight, packing method, handling and storage conditions in your enquiry. Ask the team to recommend the board or paper rather than choosing solely on appearance.',
    'Materials',
  ),
  faq(
    'Does the calculator give a final selling price?',
    'No approved rate card has been supplied. The calculator records your specifications for a reviewed quotation and does not invent a price.',
    'Calculator',
  ),
  faq(
    'When will my order be delivered?',
    'Delivery depends on the approved specification, artwork, quantity and destination. Ask the team to confirm a schedule in your written quotation.',
    'Delivery',
  ),
  faq(
    'How can I share artwork?',
    'Attach up to three JPG, PNG or PDF files, each no larger than 10 MB, to a quotation request. These are website upload limits, not manufacturing specifications.',
    'Artwork',
  ),
  faq(
    'Can I visit the facility?',
    'Contact the team before travelling to confirm the current visit address and appointment availability. The source site publishes conflicting location details.',
    'Manufacturing',
  ),
  faq(
    'Are company certificates available to download?',
    'Verified certificate copies were not supplied. Ask the company for current documentation relevant to your requirement.',
    'Quality',
  ),
];
const details = {
  'corrugated-boxes': {
    description:
      'Corrugated packaging for industrial products, shipping and distribution. The published portfolio includes regular slotted containers, die-cut mailers, trays and heavy-duty cartons. Define the packing method and product load before selecting a board construction.',
    materials: ['Kraft liners', 'Corrugated board — 3, 5 and 7 ply as listed'],
    printingOptions: [
      'Printed shipping identification',
      'Discuss flexographic or litho-laminated artwork with the team',
    ],
    finishingOptions: [
      'Glued or stitched construction, subject to specification',
      'Partitions, hand holes and vents by enquiry',
    ],
    applications: [
      'Master shippers for industrial products',
      'E-commerce mailers and distribution cartons',
      'Appliance and automotive component packs',
    ],
    specifications: [
      { label: 'Published constructions', value: '3, 5 and 7 ply' },
      { label: 'Published flute profiles', value: 'A, B, C and E' },
      { label: 'Dimensions', value: 'Custom dimensions confirmed during quotation' },
    ],
    industrySlugs: ['electrical-electronics', 'automotive', 'ecommerce', 'home-appliances'],
    faqs: [
      faq(
        'How do I specify a corrugated carton?',
        'Provide internal length, width and height with units, packed product weight, quantity and the intended handling conditions.',
      ),
      faq(
        'Which box styles are listed?',
        'The published range lists regular slotted containers, self-locking mailers, full-overlap containers, telescopic styles, trays and bulk bins. Ask the team to confirm suitability for your product.',
      ),
    ],
  },
  'duplex-boxes': {
    description:
      'Printed paperboard packaging for product presentation, consumer goods and retail display. The source portfolio describes monocartons, presentation boxes and retail packs. Artwork, crease placement and finishing should be reviewed together before production.',
    materials: ['Grey-back duplex board', 'White-back duplex board'],
    printingOptions: ['Multi-colour offset printing'],
    finishingOptions: [
      'Metallic foil stamping',
      'Gloss or matte lamination',
      'Spot UV, subject to artwork and board suitability',
    ],
    applications: [
      'Consumer electronics retail packaging',
      'Gift and presentation packs',
      'Personal care and retail monocartons',
    ],
    specifications: [
      {
        label: 'Published board range',
        value: '250–450+ GSM; exact grade subject to confirmation',
      },
      { label: 'Construction', value: 'Monocartons and presentation packaging' },
      { label: 'Artwork', value: 'Quote against approved dimensions and dieline' },
    ],
    industrySlugs: ['electrical-electronics', 'pharmaceuticals', 'fmcg'],
    faqs: [
      faq(
        'Which board should I choose?',
        'Tell the team the packed product size and weight, presentation goals and proposed finish. Request a recommended board grade and sample.',
      ),
      faq(
        'Can I combine foil and UV finishes?',
        'Both finishes appear in the published portfolio. Ask the team to review compatibility with your chosen board, artwork and production quantity.',
      ),
    ],
  },
  'paper-bags': {
    description:
      'Paper carry bags for retail, showrooms and business gifting. The published range includes kraft and laminated duplex bags with different handle constructions. Review the intended load and base reinforcement when developing the bag specification.',
    materials: ['Brown kraft paper', 'Laminated duplex paper'],
    printingOptions: ['Custom printed brand artwork'],
    finishingOptions: [
      'Twisted cord or rope handles',
      'Ribbon handles',
      'Reinforced bottom boards',
    ],
    applications: ['Retail shopping', 'Showroom presentation', 'Corporate gifting'],
    specifications: [
      {
        label: 'Published paper range',
        value: '120–250 GSM; exact construction confirmed by enquiry',
      },
      { label: 'Handle options', value: 'Twisted cord, rope and ribbon as published' },
      { label: 'Size', value: 'Custom dimensions subject to sample approval' },
    ],
    industrySlugs: ['fmcg', 'food-beverages'],
    faqs: [
      faq(
        'How should I choose a handle?',
        'Include the expected carrying load, bag dimensions and preferred presentation. Ask the team to confirm the handle and reinforcement construction.',
      ),
      faq(
        'Are bags available with custom branding?',
        'Printed branding is listed in the paper bag portfolio. Share vector artwork or a clear reference with your enquiry.',
      ),
    ],
  },
  brochures: {
    description:
      'Folded and multi-page commercial printing for company introductions, sales presentations and technical communication. The published portfolio describes corporate brochures and profiles with offset printing and finishing options. Plan the fold pattern alongside the reading order.',
    materials: ['Art paper — grade to be confirmed'],
    printingOptions: ['Multi-colour offset printing'],
    finishingOptions: [
      'Thermal matte lamination',
      'Spot gloss UV and drip-off finishes',
      'Fold creasing',
    ],
    applications: [
      'Corporate profiles',
      'Technical sales brochures',
      'Product launch and sales literature',
    ],
    specifications: [
      { label: 'Published paper range', value: '170–350 GSM; subject to the chosen format' },
      { label: 'Formats', value: 'Multi-fold and multi-page brochures' },
      { label: 'Content planning', value: 'Provide page count, finished size and artwork' },
    ],
    industrySlugs: ['electrical-electronics', 'engineering', 'fmcg'],
    faqs: [
      faq(
        'What information is needed for a brochure quote?',
        'Provide the finished size, flat size if folded, number of pages or panels, quantity, paper preference and finishing requirements.',
      ),
      faq(
        'Can a brochure be folded in different ways?',
        'Multi-fold formats are listed. Share a fold reference or ask the team to confirm a fold pattern suitable for your content and paper.',
      ),
    ],
  },
  catalogues: {
    description:
      'Multi-page product catalogues, dealer manuals and technical booklets. Binding and pagination influence how a catalogue opens and how the product range is organised. The published portfolio lists stitched, wire-bound and perfect-bound options.',
    materials: ['Cover and inner paper grades by enquiry'],
    printingOptions: ['Multi-colour offset printing'],
    finishingOptions: [
      'Saddle stitching',
      'Wire-O binding',
      'PUR perfect binding',
      'Section sewing as published',
    ],
    applications: ['Product range catalogues', 'Dealer manuals', 'Technical booklets'],
    specifications: [
      {
        label: 'Published page range',
        value: 'Up to 240+ pages; binding suitability to be confirmed',
      },
      { label: 'Binding choices', value: 'Saddle stitch, Wire-O and PUR perfect binding' },
      {
        label: 'Quote details',
        value: 'Finished size, cover/inner paper, page count and quantity',
      },
    ],
    industrySlugs: ['engineering', 'automotive', 'home-appliances'],
    faqs: [
      faq(
        'Which binding is suitable for my catalogue?',
        'Share the page count, paper grades and how the catalogue will be used. Ask for a binding recommendation and a sample before approving production.',
      ),
      faq(
        'Do the cover and inner pages need the same paper?',
        'Include separate cover and inner paper preferences in your brief. The team can confirm the available combination.',
      ),
    ],
  },
  leaflets: {
    description:
      'Compact commercial print for product information, promotional messages, warranty cards and package inserts. The published portfolio includes miniature and accordion folding. Finished size and the reading sequence should be established before the artwork is laid out.',
    materials: ['Paper grades appropriate to the selected fold'],
    printingOptions: ['High-contrast printed information and brand artwork'],
    finishingOptions: ['Miniature folding', 'Accordion folding'],
    applications: ['Product instructions and inserts', 'Warranty cards', 'Promotional information'],
    specifications: [
      {
        label: 'Published paper range',
        value: '60–130 GSM; suitability confirmed against the fold',
      },
      {
        label: 'Published formats',
        value: 'Package inserts, warranty cards and promotional leaflets',
      },
      { label: 'Artwork', value: 'Provide flat size, folded size and final approved text' },
    ],
    industrySlugs: ['pharmaceuticals', 'electrical-electronics', 'fmcg'],
    faqs: [
      faq(
        'What sizes should I specify for an insert?',
        'Supply both the flat sheet size and the final folded size with units, plus the number of folds and packing orientation if known.',
      ),
      faq(
        'Can a leaflet be used for medical instructions?',
        'The source lists medical package inserts. Any regulated text, approvals and compliance requirements must be supplied and confirmed by the customer and company; this website does not certify compliance.',
      ),
    ],
  },
};
const old = original('products');
const products = old.items.map((p, i) => {
  const key = p.slug === 'duplex-boxes-monocartons' ? 'duplex-boxes' : p.slug;
  const specific = details[key] || {
    description: p.summary,
    materials: [],
    printingOptions: [],
    finishingOptions: [],
    applications: ['Business stationery and packaging programmes'],
    specifications: [],
    industrySlugs: [],
    faqs: [
      faq(
        'How can I request this product?',
        'Send the quantity, intended use and artwork requirements for a reviewed quotation.',
      ),
    ],
  };
  return {
    slug: key,
    status: 'published',
    name: key === 'duplex-boxes' ? 'Duplex Boxes' : p.name,
    categorySlug: p.categoryId,
    categoryName: p.category,
    summary: p.summary,
    features: specific.applications,
    images: [
      image(
        p.image,
        p.alt.replace('manufactured by Paras Prints', '— representative product visual'),
      ),
    ],
    relatedSlugs: old.items
      .filter((q) => q.categoryId === p.categoryId && q.slug !== p.slug)
      .map((q) => (q.slug === 'duplex-boxes-monocartons' ? 'duplex-boxes' : q.slug)),
    primary: i < 6,
    sourceNote:
      'Options are taken from the published company portfolio. Exact grades, combinations and suitability are confirmed in a written quotation. Product images are supplied illustrative visuals; they are not evidence of a specific completed customer job.',
    order: i,
    ...specific,
    seo: {
      title: `${key === 'duplex-boxes' ? 'Duplex Boxes' : p.name} | Custom Packaging & Print`,
      description: p.summary.slice(0, 155),
    },
  };
});
const industries = [
  [
    'electrical-electronics',
    'Electrical & Electronics',
    'Retail cartons, product inserts and distribution packaging',
    'The published client portfolio names electrical, lighting and electronics businesses. Packing requirements may cover branded retail cartons, individual component packs and outer distribution boxes.',
    'Keep retail presentation, identification and transport protection in the same specification. Tell the team whether each item is packed individually or grouped into a master carton.',
    [
      'Product dimensions and packed weight',
      'Brand artwork and product identification',
      'Inner packs and master carton arrangement',
    ],
    [
      'Share handling-sensitive components and packing orientation.',
      'Confirm any product-specific labelling or compliance requirements separately.',
    ],
    ['corrugated-boxes', 'duplex-boxes', 'leaflets'],
    '/assets/paras_print_industry/06-engineering-goods.jpg',
  ],
  [
    'automotive',
    'Automotive',
    'Cartons for components and replacement parts',
    'The source describes CKD spares and component packaging among its automotive applications. Part shape, mass and how items are separated are useful starting points for a packaging brief.',
    'Provide drawings or clear reference photographs where available. Ask the team to review inserts and carton construction against the actual packing method.',
    [
      'Part geometry and quantity per carton',
      'Dividers or separation between components',
      'Storage and transport handling',
    ],
    [
      'Flag sharp edges, surface-finish protection and returnable packing needs.',
      'Agree the final sample and testing requirements before ordering.',
    ],
    ['corrugated-boxes', 'catalogues'],
    '/assets/paras_print_industry/08-automotive-industry.jpg',
  ],
  [
    'pharmaceuticals',
    'Pharmaceuticals',
    'Monocartons and folded product information',
    'The published portfolio includes pharma monocartons and package inserts. A quotation brief should separate the printed outer pack, the insert and any master-shipping requirement.',
    'Approved text, artwork version control and finished insert size should be established before production. Regulatory compliance must be confirmed with the company for the specific project.',
    [
      'Carton dimensions and product arrangement',
      'Approved artwork and insert text',
      'Flat and folded insert dimensions',
    ],
    [
      'Provide applicable regulatory and customer quality requirements.',
      'No pharmaceutical certification or regulatory compliance is asserted by this website.',
    ],
    ['duplex-boxes', 'leaflets', 'corrugated-boxes'],
    '/assets/paras_print_industry/04-pharmaceuticals.jpg',
  ],
  [
    'food-beverages',
    'Food & Beverages',
    'Printed retail and outer distribution packaging',
    'Food industry packaging appears in the published sector list. State whether packaging is an outer carton, a carry bag or a pack intended for direct food contact; these requirements should never be treated as interchangeable.',
    'The team must confirm the material and suitability for the intended use. No food-contact approval is claimed here.',
    [
      'Product format and pack count',
      'Temperature, moisture and handling conditions',
      'Whether direct contact is intended',
    ],
    [
      'Request evidence of any food-contact suitability needed for the project.',
      'Confirm material, artwork and delivery requirements in writing.',
    ],
    ['corrugated-boxes', 'duplex-boxes', 'paper-bags'],
    '/assets/paras_print_industry/03-food-industry.jpg',
  ],
  [
    'fmcg',
    'FMCG & Retail',
    'Branded packaging for consumer goods',
    'The source describes packaging for consumer goods and retail brands, including printed monocartons and paper carry bags. Presentation requirements should be considered together with how goods reach the shelf.',
    'Describe the sales channel, shelf arrangement and intended unboxing or carrying experience. A structural sample helps confirm fit before final artwork is released.',
    [
      'Retail display and shelf orientation',
      'Brand colour and finishing requirements',
      'Unit pack and distribution carton quantities',
    ],
    [
      'Confirm any specialised coatings or finishes with the team.',
      'Do not infer a material claim from a representative product image.',
    ],
    ['duplex-boxes', 'paper-bags', 'brochures'],
    '/assets/paras-products-collage.jpg',
  ],
  [
    'engineering',
    'Engineering Goods',
    'Component shippers and technical print',
    'Engineering goods are listed among the company’s sectors. Components can have different handling and identification needs, so the quotation should include item dimensions, weight and the proposed pack arrangement.',
    'Technical catalogues and manuals can be specified alongside product packaging. Supply final technical content separately from packaging artwork.',
    [
      'Component weight and loading orientation',
      'Identification and handling markings',
      'Technical documentation formats',
    ],
    [
      'Discuss dividers and protection around critical surfaces.',
      'Agree load and transport checks for the actual pack.',
    ],
    ['corrugated-boxes', 'catalogues', 'brochures'],
    '/assets/paras_print_industry/06-engineering-goods.jpg',
  ],
  [
    'ecommerce',
    'E-commerce',
    'Mailers, shipping cartons and customer presentation',
    'The published portfolio lists self-locking mailers and shipping cartons for e-commerce. Share the packed product dimensions, shipment method and whether the same carton must also create a branded presentation.',
    'Account for inserts, closure and handling in the packaging brief. The final board selection and production quantity are confirmed through the quotation process.',
    [
      'Packed dimensions rather than bare product dimensions',
      'Closure, inserts and packing sequence',
      'Print artwork and delivery destination',
    ],
    [
      'Request a sample for fit and packing evaluation.',
      'A packaging choice does not by itself guarantee freedom from transit damage.',
    ],
    ['corrugated-boxes', 'duplex-boxes', 'leaflets'],
    '/assets/paras_print_industry/11-ecommerce-industry.jpg',
  ],
  [
    'home-appliances',
    'Home Appliances',
    'Outer cartons and supporting product information',
    'Home appliances appear in the company’s published sector and client information. Carton dimensions should be specified against the fully protected product, including any cushioning and accessories.',
    'Include product orientation, stacking and handling requirements in the enquiry. Instruction leaflets and product catalogues can be reviewed as separate print items.',
    [
      'Protected product dimensions and weight',
      'Accessory and inner-pack arrangement',
      'Handling marks and documentation',
    ],
    [
      'Specify your required drop, stacking or transport checks for confirmation.',
      'Published capacity and tolerance figures remain subject to company verification.',
    ],
    ['corrugated-boxes', 'catalogues', 'leaflets'],
    '/assets/paras_print_industry/09-home-appliance.jpg',
  ],
].map(
  (
    [slug, name, summary, description, more, requirements, considerations, productSlugs, src],
    order,
  ) => ({
    slug,
    name,
    summary,
    description: description + ' ' + more,
    requirements,
    considerations,
    productSlugs,
    image: image(src, name + ' — illustrative industry visual'),
    faqs: [
      faq(
        'What should I include in an enquiry?',
        requirements.join('; ') + '. Attach approved drawings or artwork where available.',
      ),
      faq(
        'How is the final specification confirmed?',
        'Request a review of material, dimensions, artwork, quantity and delivery requirements. Project-specific quality and compliance requirements must be agreed in writing.',
      ),
    ],
    status: 'published',
    order,
    seo: {
      title: `${name} Packaging & Printing`,
      description:
        summary +
        ' from Paras Prints Solutions. Discuss dimensions, material, artwork and quantity with the Ghaziabad team.',
    },
  }),
);
const source = original('manufacturing');
const pages = [
  {
    slug: 'home',
    title: 'Packaging that works. Print that stands out.',
    eyebrow: 'PACKAGING & COMMERCIAL PRINT · SINCE 1996',
    lead: 'Custom corrugated boxes, printed cartons, paper bags and commercial print. One conversation, from your first specification to your finished packaging.',
  },
  {
    slug: 'about',
    title: 'Built around your product. Since 1996.',
    eyebrow: 'ABOUT PARAS PRINTS',
    lead: 'Paras Prints Solutions brings packaging and commercial printing together for businesses in Ghaziabad, Delhi-NCR and across India.',
    blocks: [
      { type: 'paragraph', text: original('company').description },
      { type: 'heading', text: 'From the first brief to the finished pack' },
      {
        type: 'paragraph',
        text: 'The published company portfolio brings together corrugation, offset printing, die cutting, folding and finishing. Customers can discuss structural packaging alongside the print that communicates their brand.',
      },
      { type: 'heading', text: 'A practical approach to every requirement' },
      {
        type: 'paragraph',
        text: 'Start with the product, its journey and the information it needs to carry. Material, format, artwork and production requirements can then be reviewed together. Final specifications, quantities and schedules are confirmed by the team.',
      },
    ],
    highlights: [
      { title: 'Since 1996', text: 'Company history as published in the source profile.' },
      {
        title: 'Packaging + print',
        text: 'Corrugated cartons, monocartons, bags and commercial literature.',
      },
      {
        title: 'Ghaziabad',
        text: 'A manufacturing business serving industrial and retail requirements.',
      },
    ],
  },
  {
    slug: 'manufacturing-process',
    title: 'From your brief to the finished delivery.',
    eyebrow: 'THE MANUFACTURING PROCESS',
    lead: 'An overview of the workflow published by Paras Prints Solutions. The exact sequence and checks are agreed for your product.',
    steps: source.process.map((s) => ({ title: s.title, text: s.body })),
    blocks: [
      {
        type: 'paragraph',
        text: 'A clear requirement, approved dimensions and controlled artwork provide the basis for production. Ask the team to confirm the sampling, production and inspection steps relevant to your order.',
      },
    ],
  },
  {
    slug: 'infrastructure',
    title: 'Packaging and print, brought together.',
    eyebrow: 'INFRASTRUCTURE',
    lead: 'The published company profile describes corrugation, offset printing, conversion and finishing equipment. Explore the supplied machinery pages below.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Machinery photographs reproduced in the supplied company profile are shown as document pages. Decorative facility artwork is kept in the gallery with an illustrative label, rather than presented as a verified factory photograph.',
      },
    ],
    faqs: [
      faq(
        'Can I see the machinery setup?',
        'The company profile contains machinery pages reproduced below. Contact the team for current photographs or an arranged visit.',
      ),
      faq(
        'What production capacity is available?',
        'The source publishes conflicting facility sizes and numerical capacity claims. Ask the team to confirm capacity and scheduling for your particular requirement.',
      ),
    ],
  },
  {
    slug: 'quality-assurance',
    title: 'The details make the difference.',
    eyebrow: 'QUALITY ASSURANCE',
    lead: 'Review material, printing, dimensions and finishing against the approved specification. Project-specific inspection requirements should be agreed before production.',
    highlights: [
      {
        title: 'Material',
        text: 'Confirm the specified paper or board and relevant incoming-material checks.',
      },
      { title: 'Print', text: 'Review approved artwork, registration and colour requirements.' },
      {
        title: 'Dimensions',
        text: 'Check structural fit, crease positions and packing arrangement.',
      },
      { title: 'Finishing', text: 'Review fold, bond, binding or surface finish as applicable.' },
      {
        title: 'Final inspection',
        text: 'Agree packing, identification and dispatch checks for the order.',
      },
    ],
    blocks: [
      {
        type: 'paragraph',
        text: 'The published profile includes laboratory equipment. Specific numerical tolerances, test performance and certification status require current documentation from the company. No certification badge is displayed without a verified certificate.',
      },
    ],
  },
  {
    slug: 'faq',
    title: 'A clearer brief. A better starting point.',
    eyebrow: 'FREQUENTLY ASKED QUESTIONS',
    lead: 'Practical answers to help you prepare a packaging or commercial printing enquiry. Order-specific options and policies are confirmed by the team.',
    faqs,
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy policy',
    eyebrow: 'YOUR INFORMATION',
    lead: 'How information submitted through this website is handled.',
    blocks: [
      { type: 'heading', text: 'Information you provide' },
      {
        type: 'paragraph',
        text: 'Contact, quotation and calculator forms collect your name, email, phone number and the business or project information you choose to share. Quotation attachments may contain artwork or reference material. Avoid uploading personal documents or information unrelated to your enquiry.',
      },
      { type: 'heading', text: 'How information is used' },
      {
        type: 'paragraph',
        text: 'Submitted information is stored to review your requirement, prepare a quotation and respond to you. Automated acknowledgement and internal notification emails may be sent when email delivery is configured. Submitting a form does not place an order.',
      },
      { type: 'heading', text: 'Storage and service providers' },
      {
        type: 'paragraph',
        text: 'The application uses a database for submissions and restricted file storage for attachments. Hosting, database, file storage and email providers may process information for these purposes. Access to private submissions and attachments is restricted to authorised integrations.',
      },
      { type: 'heading', text: 'Retention and requests' },
      {
        type: 'paragraph',
        text: 'Contact info@parasprints.com to ask about access, correction or deletion of information you have submitted. The company must confirm its retention schedule and any recordkeeping obligations. No fixed retention period is asserted here.',
      },
      { type: 'heading', text: 'Cookies and analytics' },
      {
        type: 'paragraph',
        text: 'The calculator uses session storage on your device to retain your specifications during navigation. Essential form and upload interactions do not require advertising cookies. Optional analytics runs only after you choose to allow it, when configured. You can revisit your choice using the Analytics preferences link in the footer.',
      },
      { type: 'heading', text: 'Policy review' },
      {
        type: 'paragraph',
        text: 'This policy describes the implemented website data flows. The company should review its legal identity, provider arrangements and retention practices before a public launch.',
      },
    ],
  },
  {
    slug: 'terms-and-conditions',
    title: 'Terms and conditions',
    eyebrow: 'WEBSITE TERMS',
    lead: 'Information for enquiries, quotation requests and use of the website.',
    blocks: [
      { type: 'heading', text: 'Information and quotations' },
      {
        type: 'paragraph',
        text: 'Website content introduces the published product range. Images may be illustrative and exact options are subject to confirmation. A form submission or calculator result is a request for review, not an accepted order, price commitment or delivery guarantee.',
      },
      { type: 'heading', text: 'Specifications and approval' },
      {
        type: 'paragraph',
        text: 'Confirm dimensions, material, quantity, print artwork, finishing, quality requirements and delivery arrangements in a written quotation. Customers are responsible for supplying artwork and content they have permission to use and for approving project-specific requirements.',
      },
      { type: 'heading', text: 'Uploads and acceptable use' },
      {
        type: 'paragraph',
        text: 'Only upload relevant reference files that you are authorised to share. Do not submit unlawful material, malicious files or third-party personal information. Upload type and size limits apply.',
      },
      { type: 'heading', text: 'Content and external services' },
      {
        type: 'paragraph',
        text: 'Do not reproduce company documents or brand materials without permission. External links such as WhatsApp and maps are operated by their respective providers.',
      },
      { type: 'heading', text: 'Business terms' },
      {
        type: 'paragraph',
        text: 'Payment, cancellation, returns, warranties and dispute arrangements must be provided and agreed by the company in its order documents. They are not invented by this website. Contact info@parasprints.com for current business terms.',
      },
      {
        type: 'paragraph',
        text: 'These website terms require business and legal review before public launch and do not claim compliance with any particular legal regime.',
      },
    ],
  },
].map((p) => ({
  ...p,
  status: 'published',
  seo: { title: p.title, description: p.lead.slice(0, 155) },
}));
const blogData = [
  [
    'preparing-a-packaging-quotation-brief',
    'How to prepare a packaging quotation brief',
    'A useful checklist for sharing dimensions, quantity, artwork and delivery requirements.',
    'Packaging briefs',
    '/assets/corrugated-boxes-enterprise.jpg',
    [
      [
        'Start with the packed product',
        'Measure the product as it will be packed, including inserts, cushioning and accessories. Record length, width and height with a clear unit. State whether dimensions describe the inside of the carton or the finished outer pack.',
      ],
      [
        'Explain the journey',
        'Describe how goods will be stored, handled and delivered. Include the packed weight, the number of items per carton and the proposed closure. Ask the manufacturer which samples or checks are appropriate.',
      ],
      [
        'Separate structure from artwork',
        'Share a structural reference alongside the latest artwork. Identify colours, print positions and finishes you would like reviewed. Flag anything that is still a preference rather than an approved specification.',
      ],
      [
        'Make the commercial brief complete',
        'Include quantity, delivery city and the date you would like to discuss. Ask for minimum order requirements, pricing, lead time and sample approval to be confirmed in writing.',
      ],
    ],
  ],
  [
    'planning-brochures-and-catalogues',
    'Brochure or catalogue? Plan the print brief first.',
    'Organise your content, page count, paper preferences and binding requirements before requesting a quote.',
    'Commercial print',
    '/assets/catalogues-enterprise.jpg',
    [
      [
        'Give the document a job',
        'Decide whether the piece introduces a business, supports a sales conversation or documents a product range. Use that purpose to plan a reading order and an approximate amount of content.',
      ],
      [
        'Plan pages and panels',
        'For a folded brochure, describe the flat size and finished size. For a catalogue, provide the page count including the cover and identify whether it uses a separate stock. Ask the printer to confirm fold and binding suitability.',
      ],
      [
        'Prepare the production information',
        'Include finished size, quantity, artwork status, paper preferences and proposed finishes. Ask for a proof and approval process rather than assuming every finish suits every paper.',
      ],
      [
        'Review before release',
        'Check product names, contact information, image permissions and final text. Mark the approved artwork version clearly so the quotation and production discussion refer to the same document.',
      ],
    ],
  ],
  [
    'ecommerce-packaging-planning',
    'Plan an e-commerce pack around the whole journey.',
    'Questions to consider when briefing a mailer, shipping carton or branded product insert.',
    'Packaging briefs',
    '/assets/hero-product-showcase.jpg',
    [
      [
        'Consider the packing sequence',
        'Describe how the product is placed, protected, closed and identified. Include accessories and printed inserts in your dimensions rather than considering the bare product alone.',
      ],
      [
        'Discuss handling and presentation together',
        'Share the intended shipping method and the presentation you want the recipient to see. Ask the manufacturer to review the structure, material and print requirements as one specification.',
      ],
      [
        'Use a sample to ask better questions',
        'A physical sample can support a discussion about fit, closure and packing. Agree any transport or performance checks with the company for the actual product; a picture cannot establish performance.',
      ],
      [
        'Confirm the order-specific details',
        'Request written confirmation of quantity, board, artwork, production schedule and delivery arrangements. Avoid treating a general product description as a final specification.',
      ],
    ],
  ],
].map(([slug, title, excerpt, category, src, sections]) => ({
  slug,
  title,
  excerpt,
  category,
  featuredImage: image(src),
  author: 'Editorial guide',
  publishedAt: '2026-11-17T00:00:00.000Z',
  status: 'published',
  tags: [category],
  content: sections.flatMap(([heading, text]) => [
    { type: 'heading', text: heading },
    { type: 'paragraph', text },
  ]),
  seo: { title, description: excerpt },
}));
const sourceContact = original('contact');
const settings = {
  additionalSectors: original('industries')
    .items.filter((item) =>
      [
        'textile',
        'plastic',
        'chemicals-fertilizers',
        'oils-petro',
        'air-cargo-logistics',
        'manufacturing',
      ].includes(item.slug),
    )
    .map((item) => item.name),
  company: {
    name: 'Paras Prints Solutions',
    established: '1996',
    intro:
      'Custom packaging and commercial printing, bringing corrugated cartons, monocartons, paper bags and printed literature together.',
    address: sourceContact.plantAddress,
    addressNote:
      'Please confirm the current visit and dispatch address with the team before travelling.',
    phone: sourceContact.phonePrimary,
    phoneHref: sourceContact.phonePrimaryHref,
    email: sourceContact.email,
    emailHref: sourceContact.emailHref,
    whatsapp: 'https://wa.me/' + sourceContact.whatsappNumber,
    sourceUrl: 'https://parasprints-nu.vercel.app/',
    sourceNote:
      'Contact details are reproduced from the existing company website; the alternate address and dispatch line require confirmation.',
    socialLinks: [],
  },
  home: {
    slides: [
      image('/assets/hero-product-showcase.jpg', 'Representative printed packaging'),
      image('/assets/hero-showcase.jpg', 'Representative custom kraft and white cartons'),
      image('/assets/packaging-products-group.jpg', 'Representative packaging and print range'),
    ],
    highlights: [
      { title: 'Since 1996', text: 'A published history in packaging and print' },
      { title: 'Packaging + print', text: 'From shipping cartons to product literature' },
      { title: 'Made for your brief', text: 'Dimensions, materials, artwork and finishing' },
    ],
    benefits: [
      {
        title: 'One brief, a considered solution',
        text: 'Discuss the structure and the printed presentation together.',
      },
      {
        title: 'A specification you can review',
        text: 'Confirm dimensions, material, artwork and intended use before production.',
      },
      {
        title: 'Relevant to your industry',
        text: 'Explain how your product is packed, handled and delivered.',
      },
      {
        title: 'A direct conversation',
        text: 'Bring your requirements to the Ghaziabad team for a reviewed quotation.',
      },
    ],
  },
  downloads: [
    {
      title: 'Company profile',
      description:
        'The 13 supplied company profile pages, combined into a PDF without altering their content. Historical details in this document should be confirmed with the company.',
      url: '/downloads/paras-prints-company-profile.pdf',
      filename: 'paras-prints-company-profile.pdf',
      type: 'PDF',
    },
  ],
  faqs,
};
const gallery = all.map((a, i) => {
  const img = image(a.path, a.caption);
  return {
    slug: 'asset-' + String(i + 1).padStart(3, '0'),
    status: 'published',
    title: a.caption,
    category:
      img.kind === 'document'
        ? 'Company profile'
        : img.kind === 'brand'
          ? 'Brand'
          : a.path.includes('industry') || /\/\d{2}-/.test(a.path)
            ? 'Industry visuals'
            : a.path.includes('dealership') || a.path.includes('partner')
              ? 'Partnership artwork'
              : a.path.includes('plant') || a.path.includes('flute')
                ? 'Illustrative facility visuals'
                : 'Product visuals',
    image: img,
    sourceFile: a.path,
    order: i,
  };
});
const seed = {
  categories: old.categories.map((c, i) => ({
    slug: c.id,
    name: c.title,
    description: c.groupSub,
    status: 'published',
    order: i,
  })),
  products,
  industries,
  pages,
  blogs: blogData,
  caseStudies: [],
  clients: original('clients').items.map((c, i) => ({
    ...c,
    slug: 'client-' + (i + 1),
    status: 'published',
    permissionConfirmed: false,
    order: i,
  })),
  testimonials: original('testimonials').items.map((t, i) => ({
    slug: 'testimonial-' + (i + 1),
    name: t.name,
    quote: t.quote,
    role: t.role,
    status: 'draft',
    permissionConfirmed: false,
  })),
  gallery,
  machines: source.machinery.map((m, i) => ({
    slug: 'machine-' + (i + 1),
    name: m.name,
    description: m.detail,
    status: 'published',
    order: i,
  })),
  settings,
  calculator: {
    key: 'default',
    products: ['corrugated-boxes', 'duplex-boxes'],
    styles: [
      { value: 'rsc', label: 'Regular slotted carton', products: ['corrugated-boxes'] },
      { value: 'mailer', label: 'Self-locking mailer', products: ['corrugated-boxes'] },
      { value: 'monocarton', label: 'Printed monocarton', products: ['duplex-boxes'] },
    ],
    materials: [
      {
        value: 'kraft',
        label: 'Kraft corrugated board — exact grade by enquiry',
        products: ['corrugated-boxes'],
      },
      {
        value: 'duplex',
        label: 'Duplex paperboard — exact grade by enquiry',
        products: ['duplex-boxes'],
      },
    ],
    printing: [
      { value: 'plain', label: 'Unprinted', products: ['corrugated-boxes', 'duplex-boxes'] },
      {
        value: 'printed',
        label: 'Custom printed — artwork to be reviewed',
        products: ['corrugated-boxes', 'duplex-boxes'],
      },
    ],
    finishing: [
      {
        value: 'partitions',
        label: 'Internal partitions — discuss suitability',
        products: ['corrugated-boxes'],
      },
      {
        value: 'lamination',
        label: 'Lamination — confirm specification',
        products: ['duplex-boxes'],
      },
      { value: 'foil', label: 'Foil stamping — confirm artwork', products: ['duplex-boxes'] },
      { value: 'uv', label: 'Spot UV — confirm artwork', products: ['duplex-boxes'] },
    ],
    maxDimensionMm: 5000,
    maxQuantity: 10000000,
    pricingVerified: false,
    rates: {},
    currency: 'INR',
    disclaimer:
      'Specifications are an enquiry brief, not an accepted order. Material suitability, minimum order quantity, pricing and delivery are confirmed by the company. Calculator limits are software input limits.',
  },
};
fs.writeFileSync('backend/data/catalog.json', JSON.stringify(seed, null, 2));
console.log(
  `Created content inventory: ${products.length} products, ${industries.length} industries, ${gallery.length} assets.`,
);
