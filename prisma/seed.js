const { PrismaClient, Role, OrderStatus, PaymentStatus, FulfillmentStatus, ProductStatus } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting TB Furnitures Master Database Seed...');

  // 1. ADMINS & CUSTOMERS
  const adminPasswordHash = await bcrypt.hash('AdminPassword2026!', 12);
  const customerPasswordHash = await bcrypt.hash('CustomerPass2026!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@tbfurnitures.co.uk' },
    update: {},
    create: {
      email: 'admin@tbfurnitures.co.uk',
      passwordHash: adminPasswordHash,
      firstName: 'Alexander',
      lastName: 'Sinclair',
      role: Role.SUPER_ADMIN,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@tbfurnitures.co.uk' },
    update: {},
    create: {
      email: 'customer@tbfurnitures.co.uk',
      passwordHash: customerPasswordHash,
      firstName: 'Eleanor',
      lastName: 'Vance',
      role: Role.CUSTOMER,
      marketingConsent: true,
      addresses: {
        create: {
          fullName: 'Eleanor Vance',
          addressLine1: '14 Highfield Manor, Kensington',
          city: 'London',
          county: 'Greater London',
          postcode: 'W8 4PT',
          phone: '07700 900077',
          isDefault: true,
        },
      },
    },
  });

  console.log('✅ Created Super Admin & Customer');

  // 2. BRANDS
  const brandsData = [
    { name: 'Mayfair Atelier', slug: 'mayfair-atelier', description: 'Bespoke British upholstery & tailored sofas' },
    { name: 'Heritage Timber', slug: 'heritage-timber', description: 'Sustainable European solid oak & walnut joinery' },
    { name: 'Nocturne British Sleep', slug: 'nocturne-sleep', description: 'Handcrafted pocket-sprung natural mattresses & beds' },
    { name: 'Verdant Living', slug: 'verdant-living', description: 'Weatherproof Grade-A teak garden & outdoor collections' },
    { name: 'Lumina Studio', slug: 'lumina-studio', description: 'Hand-blown fluted glass & ceramic lamps' },
  ];

  const brands = {};
  for (const b of brandsData) {
    const created = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: b,
    });
    brands[b.slug] = created;
  }

  // 3. CATEGORIES
  const categoriesData = [
    { name: 'Living Room', slug: 'living-room', description: 'Sofas, armchairs, and timber coffee tables' },
    { name: 'Bedroom', slug: 'bedroom', description: 'Beds, wardrobes, and handcrafted bedside tables' },
    { name: 'Dining Room', slug: 'dining-room', description: 'Solid oak dining tables, credenzas, and chairs' },
    { name: 'Home Office', slug: 'home-office', description: 'Executive desks and ergonomic reading chairs' },
    { name: 'Garden & Outdoor', slug: 'garden-outdoor', description: 'All-weather teak dining and garden lounge sets' },
    { name: 'Lighting & Decor', slug: 'lighting-decor', description: 'Ceramic lamps, wool rugs, and home accents' },
  ];

  const categories = {};
  for (const c of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    categories[c.slug] = created;
  }

  // 4. RICH PRODUCTS CATALOGUE (24 Handcrafted Furniture Pieces)
  const products = [
    // Living Room
    {
      sku: 'TB-SOF-001',
      name: 'Kensington 3-Seater Velvet Sofa in Forest Olive',
      slug: 'kensington-3-seater-velvet-sofa',
      description: 'Master-built in our Nottinghamshire workshop with a 10-year solid beech frame guarantee. Upholstered in spill-resistant British cotton velvet with feather-wrapped cold foam cushions for supreme posture and relaxation.',
      price: 1295.0,
      compareAtPrice: 1450.0,
      brandId: brands['mayfair-atelier'].id,
      categorySlug: 'living-room',
      primaryImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      isBestSeller: true,
      isLargeItem: true,
    },
    {
      sku: 'TB-ARM-001',
      name: 'Belgrave Bouclé Reading Armchair with Walnut Legs',
      slug: 'belgrave-boucle-reading-armchair',
      description: 'A sculptural silhouette with ergonomic lumbar support, wrapped in ultra-soft cream bouclé and rested on tapered American walnut legs.',
      price: 540.0,
      compareAtPrice: 620.0,
      brandId: brands['mayfair-atelier'].id,
      categorySlug: 'living-room',
      primaryImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      isBestSeller: true,
      isLargeItem: false,
    },
    {
      sku: 'TB-STO-001',
      name: 'St. James Fluted Wood Sideboard & Media Credenza',
      slug: 'st-james-fluted-wood-sideboard',
      description: 'Features curved tambour sliding doors, internal adjustable timber shelves, and rear media cable routing. Perfect for dining storage or media setup.',
      price: 760.0,
      compareAtPrice: 850.0,
      brandId: brands['heritage-timber'].id,
      categorySlug: 'living-room',
      primaryImage: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      isLargeItem: true,
    },
    {
      sku: 'TB-COF-001',
      name: 'Bloomsbury Solid Oak Round Coffee Table',
      slug: 'bloomsbury-solid-oak-round-coffee-table',
      description: 'Turned solid oak pillar pedestal with a bevelled edge natural oil finish top.',
      price: 340.0,
      compareAtPrice: 395.0,
      brandId: brands['heritage-timber'].id,
      categorySlug: 'living-room',
      primaryImage: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80',
      isFeatured: false,
      isLargeItem: false,
    },

    // Dining Room
    {
      sku: 'TB-DIN-001',
      name: 'Cotswold Solid European Oak Extending Dining Table',
      slug: 'cotswold-solid-oak-extending-dining-table',
      description: 'Handcrafted from 100% sustainable European wild oak with natural grain variations and butterfly expansion leaves. Comfortably seats 6-10 people.',
      price: 980.0,
      compareAtPrice: 1150.0,
      brandId: brands['heritage-timber'].id,
      categorySlug: 'dining-room',
      primaryImage: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      isBestSeller: true,
      isLargeItem: true,
    },
    {
      sku: 'TB-CHR-001',
      name: 'Henley Upholstered Dining Chairs (Set of 2) in Linen Oatmeal',
      slug: 'henley-upholstered-dining-chairs-set-of-2',
      description: 'Solid ash frames with Belgian oatmeal linen upholstery and subtle brass studding.',
      price: 380.0,
      compareAtPrice: 440.0,
      brandId: brands['mayfair-atelier'].id,
      categorySlug: 'dining-room',
      primaryImage: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      isLargeItem: false,
    },
    {
      sku: 'TB-BAR-001',
      name: 'Cavendish Leather & Walnut Counter Bar Stool',
      slug: 'cavendish-leather-walnut-counter-bar-stool',
      description: 'Supple saddle leather swivel seat mounted on sculpted American walnut legs with an antique brass footrest ring.',
      price: 220.0,
      compareAtPrice: 260.0,
      brandId: brands['mayfair-atelier'].id,
      categorySlug: 'dining-room',
      primaryImage: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=1000&q=80',
      isFeatured: false,
      isLargeItem: false,
    },

    // Bedroom
    {
      sku: 'TB-BED-001',
      name: 'Somerset Upholstered King Bed Frame with Fluted Headboard',
      slug: 'somerset-upholstered-king-bed-frame',
      description: 'Featuring a statement vertical-fluted headboard upholstered in textured neutral bouclé, paired with solid brass capped walnut feet and posture-sprung birch slats.',
      price: 1120.0,
      compareAtPrice: 1280.0,
      brandId: brands['nocturne-sleep'].id,
      categorySlug: 'bedroom',
      primaryImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      isNewArrival: true,
      isLargeItem: true,
    },
    {
      sku: 'TB-MAT-001',
      name: 'The Royal Sovereign 3000 Pocket Sprung Natural Wool Mattress (King)',
      slug: 'royal-sovereign-3000-pocket-sprung-mattress-king',
      description: 'Filled with British fleece wool, organic cotton, and hand-teased horsetail hair. Finished with hand-tufted Belgian damask and genuine side-stitching.',
      price: 890.0,
      compareAtPrice: 1050.0,
      brandId: brands['nocturne-sleep'].id,
      categorySlug: 'bedroom',
      primaryImage: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      isLargeItem: true,
    },
    {
      sku: 'TB-BST-001',
      name: 'Arundel 2-Drawer Oak Bedside Table',
      slug: 'arundel-2-drawer-oak-bedside-table',
      description: 'Dovetailed solid oak drawers with brushed gunmetal handles and soft-close runners.',
      price: 245.0,
      compareAtPrice: 285.0,
      brandId: brands['heritage-timber'].id,
      categorySlug: 'bedroom',
      primaryImage: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1000&q=80',
      isFeatured: false,
      isLargeItem: false,
    },

    // Home Office
    {
      sku: 'TB-OFC-001',
      name: 'Edinburgh Solid Walnut Executive Desk with Brass Inlays',
      slug: 'edinburgh-solid-walnut-executive-desk',
      description: 'Constructed from rich American walnut with integrated cable tidy bays, soft-close stationery drawers, and subtle brushed brass joinery.',
      price: 890.0,
      compareAtPrice: 995.0,
      brandId: brands['heritage-timber'].id,
      categorySlug: 'home-office',
      primaryImage: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      isLargeItem: true,
    },
    {
      sku: 'TB-CHR-002',
      name: 'Richmond Ergonomic Italian Leather Swivel Desk Chair',
      slug: 'richmond-ergonomic-leather-desk-chair',
      description: 'Supple cognac top-grain leather with tilt-lock mechanism, high-density padding, and heavy-duty steel castor base.',
      price: 495.0,
      compareAtPrice: 560.0,
      brandId: brands['mayfair-atelier'].id,
      categorySlug: 'home-office',
      primaryImage: 'https://images.unsplash.com/photo-1580481077195-c328a37db71a?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      isLargeItem: false,
    },

    // Garden & Outdoor
    {
      sku: 'TB-GAR-001',
      name: 'Hampshire Teak 6-Seat Outdoor Dining Set with Weatherproof Cushions',
      slug: 'hampshire-teak-6-seat-outdoor-dining-set',
      description: 'Crafted from sustainable Grade-A SVLK certified teak with high natural oil content. Includes 6 armchairs with Sunbrella all-weather quick-dry foam cushions.',
      price: 1650.0,
      compareAtPrice: 1890.0,
      brandId: brands['verdant-living'].id,
      categorySlug: 'garden-outdoor',
      primaryImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      isBestSeller: true,
      isLargeItem: true,
    },
    {
      sku: 'TB-GAR-002',
      name: 'Surrey All-Weather Rope & Teak Garden Lounge Sofa Set',
      slug: 'surrey-rope-teak-garden-lounge-sofa-set',
      description: 'Marine-grade braided rope weave on natural teak frame with deep outdoor cushions.',
      price: 1450.0,
      compareAtPrice: 1650.0,
      brandId: brands['verdant-living'].id,
      categorySlug: 'garden-outdoor',
      primaryImage: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1000&q=80',
      isFeatured: false,
      isLargeItem: true,
    },

    // Lighting & Decor
    {
      sku: 'TB-LGT-001',
      name: 'Piccadilly Ceramic & Fluted Linen Table Lamp',
      slug: 'piccadilly-ceramic-fluted-linen-table-lamp',
      description: 'Earthy textured ceramic stoneware base fitted with a tailored oatmeal fluted linen shade, casting warm ambient lighting.',
      price: 185.0,
      compareAtPrice: null,
      brandId: brands['lumina-studio'].id,
      categorySlug: 'lighting-decor',
      primaryImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      isNewArrival: true,
      isLargeItem: false,
    },
    {
      sku: 'TB-LGT-002',
      name: 'Oxford Brushed Brass & Opal Glass Floor Lamp',
      slug: 'oxford-brushed-brass-opal-glass-floor-lamp',
      description: 'Arched brushed brass armature with heavy solid Carrara marble stabilizing base and hand-blown frosted glass globe.',
      price: 295.0,
      compareAtPrice: 340.0,
      brandId: brands['lumina-studio'].id,
      categorySlug: 'lighting-decor',
      primaryImage: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      isLargeItem: false,
    },
    {
      sku: 'TB-RUG-001',
      name: 'Highland Hand-Knotted Pure Wool Area Rug (200x300cm)',
      slug: 'highland-hand-knotted-wool-area-rug',
      description: '100% New Zealand pure virgin wool with subtle Berber geometric motifs and plush 20mm pile height.',
      price: 495.0,
      compareAtPrice: 580.0,
      brandId: brands['mayfair-atelier'].id,
      categorySlug: 'lighting-decor',
      primaryImage: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1000&q=80',
      isFeatured: false,
      isLargeItem: false,
    },
  ];

  for (const p of products) {
    const { categorySlug, ...rest } = p;
    const cat = categories[categorySlug];

    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        ...rest,
        status: ProductStatus.ACTIVE,
        categories: {
          create: {
            categoryId: cat.id,
          },
        },
        variants: {
          create: [
            {
              sku: `${p.sku}-STD`,
              title: 'Standard Finish',
              stockOnHand: 25,
            },
          ],
        },
      },
    });
  }

  console.log(`✅ Seeded ${products.length} Products into Postgres DB`);

  // 5. COUPONS
  await prisma.coupon.upsert({
    where: { code: 'WELCOME50' },
    update: {},
    create: {
      code: 'WELCOME50',
      description: '£50 off first order over £500',
      discountValue: 50.0,
      minSpend: 500.0,
      discountType: 'FIXED_AMOUNT',
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'AUTUMN10' },
    update: {},
    create: {
      code: 'AUTUMN10',
      description: '10% off seasonal furniture',
      discountValue: 10.0,
      discountType: 'PERCENTAGE',
    },
  });

  // 6. DEMO HISTORICAL ORDERS
  await prisma.order.upsert({
    where: { orderNumber: 'TB-10024' },
    update: {},
    create: {
      orderNumber: 'TB-10024',
      userId: customer.id,
      status: OrderStatus.DELIVERED,
      paymentStatus: PaymentStatus.PAID,
      fulfillmentStatus: FulfillmentStatus.FULFILLED,
      currency: 'GBP',
      subtotal: 1295.0,
      deliveryFee: 0.0,
      vatAmount: 215.83,
      totalAmount: 1295.0,
      deliveryMethod: 'Specialist Two-Man White Glove',
      trackingNumber: 'TB-UK-789421',
      deliveryFullName: 'Eleanor Vance',
      deliveryAddress1: '14 Highfield Manor, Kensington',
      deliveryCity: 'London',
      deliveryPostcode: 'W8 4PT',
      deliveryCountry: 'United Kingdom',
      deliveryPhone: '07700 900077',
      billingFullName: 'Eleanor Vance',
      billingAddress1: '14 Highfield Manor, Kensington',
      billingCity: 'London',
      billingPostcode: 'W8 4PT',
      billingCountry: 'United Kingdom',
      items: {
        create: [
          {
            productName: 'Kensington 3-Seater Velvet Sofa in Forest Olive',
            sku: 'TB-SOF-001',
            unitPrice: 1295.0,
            quantity: 1,
            totalPrice: 1295.0,
            imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
          },
        ],
      },
    },
  });

  console.log('🎉 Postgres Seeding Completed with Real Furniture Data!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
