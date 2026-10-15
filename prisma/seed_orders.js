const { PrismaClient, OrderStatus, PaymentStatus, FulfillmentStatus } = require('@prisma/client');
const prisma = new PrismaClient();

async function addDummyOrders() {
  console.log('📦 Seeding diverse orders across all UK fulfillment statuses...');

  const user = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
  if (!user) {
    console.error('No customer found to attach orders to');
    return;
  }

  const dummyOrders = [
    {
      orderNumber: 'TB-84910',
      userId: user.id,
      status: OrderStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
      fulfillmentStatus: FulfillmentStatus.UNFULFILLED,
      currency: 'GBP',
      subtotal: 980.0,
      deliveryFee: 0.0,
      vatAmount: 163.33,
      totalAmount: 980.0,
      deliveryMethod: 'Standard UK Courier',
      trackingNumber: null,
      deliveryFullName: 'Sir Arthur Wellesley',
      deliveryAddress1: '8 Wellington Place, Apsley House',
      deliveryCity: 'London',
      deliveryPostcode: 'W1J 7NT',
      productName: 'Cotswold Solid European Oak Extending Dining Table',
      sku: 'TB-DIN-001',
      price: 980.0,
      imageUrl: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1000&q=80',
    },
    {
      orderNumber: 'TB-84911',
      userId: user.id,
      status: OrderStatus.DISPATCHED,
      paymentStatus: PaymentStatus.PAID,
      fulfillmentStatus: FulfillmentStatus.PARTIALLY_FULFILLED,
      currency: 'GBP',
      subtotal: 1650.0,
      deliveryFee: 0.0,
      vatAmount: 275.0,
      totalAmount: 1650.0,
      deliveryMethod: 'Specialist Two-Man White Glove',
      trackingNumber: 'TB-UK-902341',
      deliveryFullName: 'Charlotte Bronte',
      deliveryAddress1: 'Parsonage Hill',
      deliveryCity: 'Haworth, Keighley',
      deliveryPostcode: 'BD22 8DR',
      productName: 'Hampshire Teak 6-Seat Outdoor Dining Set with Weatherproof Cushions',
      sku: 'TB-GAR-001',
      price: 1650.0,
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    },
    {
      orderNumber: 'TB-84912',
      userId: user.id,
      status: OrderStatus.IN_TRANSIT,
      paymentStatus: PaymentStatus.PAID,
      fulfillmentStatus: FulfillmentStatus.PARTIALLY_FULFILLED,
      currency: 'GBP',
      subtotal: 540.0,
      deliveryFee: 0.0,
      vatAmount: 90.0,
      totalAmount: 540.0,
      deliveryMethod: 'Standard UK Courier',
      trackingNumber: 'TB-UK-612903',
      deliveryFullName: 'James MacTaggart',
      deliveryAddress1: '19 Royal Terrace',
      deliveryCity: 'Edinburgh',
      deliveryPostcode: 'EH7 5AQ',
      productName: 'Belgrave Bouclé Reading Armchair with Walnut Legs',
      sku: 'TB-ARM-001',
      price: 540.0,
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
    },
    {
      orderNumber: 'TB-84913',
      userId: user.id,
      status: OrderStatus.PROCESSING,
      paymentStatus: PaymentStatus.PAID,
      fulfillmentStatus: FulfillmentStatus.UNFULFILLED,
      currency: 'GBP',
      subtotal: 1120.0,
      deliveryFee: 0.0,
      vatAmount: 186.67,
      totalAmount: 1120.0,
      deliveryMethod: 'Specialist Two-Man White Glove',
      trackingNumber: null,
      deliveryFullName: 'Lady Marion Croft',
      deliveryAddress1: 'Harrington Square, Clifton',
      deliveryCity: 'Bristol',
      deliveryPostcode: 'BS8 4HG',
      productName: 'Somerset Upholstered King Bed Frame with Fluted Headboard',
      sku: 'TB-BED-001',
      price: 1120.0,
      imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
    },
    {
      orderNumber: 'TB-84914',
      userId: user.id,
      status: OrderStatus.PENDING_PAYMENT,
      paymentStatus: PaymentStatus.PENDING,
      fulfillmentStatus: FulfillmentStatus.UNFULFILLED,
      currency: 'GBP',
      subtotal: 185.0,
      deliveryFee: 19.99,
      vatAmount: 34.16,
      totalAmount: 204.99,
      deliveryMethod: 'Standard UK Courier',
      trackingNumber: null,
      deliveryFullName: 'George Harrison',
      deliveryAddress1: '12 Friar Park Road',
      deliveryCity: 'Henley-on-Thames',
      deliveryPostcode: 'RG9 4NP',
      productName: 'Piccadilly Ceramic & Fluted Linen Table Lamp',
      sku: 'TB-LGT-001',
      price: 185.0,
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  for (const o of dummyOrders) {
    const { productName, sku, price, imageUrl, ...rest } = o;
    await prisma.order.upsert({
      where: { orderNumber: o.orderNumber },
      update: {},
      create: {
        ...rest,
        deliveryCountry: 'United Kingdom',
        billingFullName: rest.deliveryFullName,
        billingAddress1: rest.deliveryAddress1,
        billingCity: rest.deliveryCity,
        billingPostcode: rest.deliveryPostcode,
        billingCountry: 'United Kingdom',
        items: {
          create: [
            {
              productName,
              sku,
              unitPrice: price,
              quantity: 1,
              totalPrice: price,
              imageUrl,
            },
          ],
        },
        statusHistory: {
          create: [
            {
              status: rest.status,
              note: `Automated status checkpoint: ${rest.status}`,
            },
          ],
        },
      },
    });
  }

  console.log('✅ Successfully seeded diverse orders into PostgreSQL!');
}

addDummyOrders()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
