/**
 * One-time script to create Stripe Products + Prices for each Let's Go Tutors pricing tier.
 * Run: npx tsx scripts/create-stripe-prices.ts
 */
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const tiers = [
    { name: 'Platinum Path', envKey: 'STRIPE_PRICE_PLATINUM_PATH', pencePerHour: 4500, ratio: '1:1' },
    { name: 'Gold Edge', envKey: 'STRIPE_PRICE_GOLD_EDGE', pencePerHour: 3500, ratio: '2:1' },
    { name: 'Silver Advantage', envKey: 'STRIPE_PRICE_SILVER_ADVANTAGE', pencePerHour: 2500, ratio: '3:1' },
    { name: 'Bronze Boost', envKey: 'STRIPE_PRICE_BRONZE_BOOST', pencePerHour: 1800, ratio: '5:1' },
    { name: 'Foundational Fixes', envKey: 'STRIPE_PRICE_FOUNDATIONAL_FIXES', pencePerHour: 1400, ratio: '6:1' },
    { name: 'Foundational Focus', envKey: 'STRIPE_PRICE_FOUNDATIONAL_FOCUS', pencePerHour: 1000, ratio: '10:1' },
];

async function main() {
    console.log('Creating Stripe Products and Prices for Let's Go Tutors Tutors...\n');

    const envLines: string[] = [];

    for (const tier of tiers) {
        // Create the product
        const product = await stripe.products.create({
            name: `Let's Go Tutors Tutors — ${tier.name}`,
            description: `${tier.name} tutoring tier (${tier.ratio} tutor-to-student ratio)`,
            metadata: { tier: tier.name, ratio: tier.ratio },
        });

        // Create a one-time price in GBP
        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: tier.pencePerHour,
            currency: 'gbp',
        });

        console.log(`✅ ${tier.name}: product=${product.id}  price=${price.id}`);
        envLines.push(`${tier.envKey}=${price.id}`);
    }

    console.log('\n─── Add these to apps/api/.env ───\n');
    console.log(envLines.join('\n'));
    console.log('');
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
