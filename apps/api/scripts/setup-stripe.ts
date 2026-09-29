/**
 * ──────────────────────────────────────────────────────────
 * Stripe Billing Setup Script
 * ──────────────────────────────────────────────────────────
 * Creates all Let's Go Tutors products, prices, and billing
 * portal configuration on Stripe, then writes the IDs to .env.
 *
 * Run once:  npx tsx scripts/setup-stripe.ts
 * ──────────────────────────────────────────────────────────
 */

import Stripe from 'stripe';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load existing .env manually (no dotenv dependency needed)
const envPath = path.resolve(__dirname, '..', '.env');
try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.substring(0, eqIdx).trim();
        const val = trimmed.substring(eqIdx + 1).trim();
        if (!process.env[key]) process.env[key] = val;
    }
} catch { /* .env file doesn't exist yet */ }

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// ── Pricing Matrix (matches pricing.ts) ──
type TierKey = 'platinum-path' | 'gold-edge' | 'silver-advantage' | 'bronze-boost' | 'foundational-fixes' | 'foundational-focus';
type LevelKey = '11-plus' | 'gcse' | 'a-level' | 'btec';

const TIERS: { key: TierKey; label: string; ratio: string }[] = [
    { key: 'platinum-path', label: 'Platinum Path', ratio: '1:1' },
    { key: 'gold-edge', label: 'Gold Edge', ratio: '2:1' },
    { key: 'silver-advantage', label: 'Silver Advantage', ratio: '3:1' },
    { key: 'bronze-boost', label: 'Bronze Boost', ratio: '5:1' },
    { key: 'foundational-fixes', label: 'Foundational Fixes', ratio: '6:1' },
    { key: 'foundational-focus', label: 'Foundational Focus', ratio: '10:1' },
];

const LEVELS: { key: LevelKey; label: string; envKey: string }[] = [
    { key: '11-plus', label: '11+', envKey: '11PLUS' },
    { key: 'gcse', label: 'GCSE', envKey: 'GCSE' },
    { key: 'a-level', label: 'A-Level', envKey: 'ALEVEL' },
    { key: 'btec', label: 'BTEC', envKey: 'BTEC' },
];

// Monthly prices in £ (from site-content.ts / pricing.ts)
const MONTHLY_PRICES: Record<TierKey, Record<LevelKey, number>> = {
    'platinum-path': { '11-plus': 125, gcse: 175, 'a-level': 225, btec: 200 },
    'gold-edge': { '11-plus': 75, gcse: 125, 'a-level': 175, btec: 150 },
    'silver-advantage': { '11-plus': 50, gcse: 100, 'a-level': 150, btec: 120 },
    'bronze-boost': { '11-plus': 30, gcse: 80, 'a-level': 130, btec: 100 },
    'foundational-fixes': { '11-plus': 25, gcse: 75, 'a-level': 75, btec: 70 },
    'foundational-focus': { '11-plus': 15, gcse: 50, 'a-level': 65, btec: 50 },
};

function toEnvKey(level: { envKey: string }, tier: { key: string }): string {
    const tierEnv = tier.key.toUpperCase().replace(/-/g, '_');
    return `STRIPE_PRICE_${level.envKey}_${tierEnv}`;
}

function toProductEnvKey(level: { envKey: string }, tier: { key: string }): string {
    const tierEnv = tier.key.toUpperCase().replace(/-/g, '_');
    return `STRIPE_PRODUCT_${level.envKey}_${tierEnv}`;
}

async function main() {
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║   Let's Go Tutors — Stripe Billing Setup         ║');
    console.log('╚══════════════════════════════════════════════════╝\n');

    if (!process.env.STRIPE_SECRET_KEY) {
        console.error('❌ STRIPE_SECRET_KEY not found in .env. Aborting.');
        process.exit(1);
    }

    const envUpdates: Record<string, string> = {};
    const allPriceIds: string[] = [];
    const productPriceMap: Record<string, string[]> = {}; // productId -> priceIds[]

    // ── Step 1: Create Products & Prices ──
    console.log('📦 Creating Products & Prices...\n');

    for (const level of LEVELS) {
        for (const tier of TIERS) {
            const productName = `${level.label} ${tier.label} (${tier.ratio}) Tuition`;
            const monthlyAmountGBP = MONTHLY_PRICES[tier.key][level.key];
            const unitAmountPence = monthlyAmountGBP * 100;

            const priceEnvKey = toEnvKey(level, tier);
            const productEnvKey = toProductEnvKey(level, tier);

            // Check if a price ID already exists in env
            const existingPriceId = process.env[priceEnvKey];
            if (existingPriceId && existingPriceId.startsWith('price_')) {
                console.log(`  ⏭️  ${productName} — already exists (${existingPriceId})`);
                allPriceIds.push(existingPriceId);

                // Try to get the product ID from the existing price
                try {
                    const existingPrice = await stripe.prices.retrieve(existingPriceId);
                    const prodId = typeof existingPrice.product === 'string' ? existingPrice.product : (existingPrice.product as any).id;
                    envUpdates[productEnvKey] = prodId;
                    if (!productPriceMap[prodId]) productPriceMap[prodId] = [];
                    productPriceMap[prodId].push(existingPriceId);
                } catch { /* ignore */ }

                envUpdates[priceEnvKey] = existingPriceId;
                continue;
            }

            // Create product
            const product = await stripe.products.create({
                name: productName,
                description: `Monthly ${level.label} tuition — ${tier.label} (${tier.ratio}) — 4 sessions per month`,
                metadata: {
                    level: level.key,
                    tier: tier.key,
                    ratio: tier.ratio,
                },
            });

            // Create recurring monthly price
            const price = await stripe.prices.create({
                product: product.id,
                unit_amount: unitAmountPence,
                currency: 'gbp',
                recurring: { interval: 'month' },
                metadata: {
                    level: level.key,
                    tier: tier.key,
                },
            });

            console.log(`  ✅ ${productName} — £${monthlyAmountGBP}/mo → ${price.id}`);

            envUpdates[productEnvKey] = product.id;
            envUpdates[priceEnvKey] = price.id;
            allPriceIds.push(price.id);

            if (!productPriceMap[product.id]) productPriceMap[product.id] = [];
            productPriceMap[product.id].push(price.id);
        }
    }

    console.log(`\n✨ Total: ${allPriceIds.length} prices created/verified.\n`);

    // ── Step 2: Create Billing Portal Configuration ──
    console.log('🔧 Creating Billing Portal Configuration...\n');

    // Build products array for subscription_update
    const portalProducts = Object.entries(productPriceMap).map(([productId, priceIds]) => ({
        product: productId,
        prices: priceIds,
    }));

    try {
        const portalConfig = await stripe.billingPortal.configurations.create({
            business_profile: {
                headline: 'Let's Go Tutors — Manage Your Subscription',
            },
            features: {
                subscription_cancel: {
                    enabled: true,
                    mode: 'at_period_end',
                    cancellation_reason: {
                        enabled: true,
                        options: [
                            'too_expensive',
                            'missing_features',
                            'switched_service',
                            'unused',
                            'other',
                        ],
                    },
                },
                invoice_history: { enabled: true },
                payment_method_update: { enabled: true },
            },
        });

        envUpdates['STRIPE_PORTAL_CONFIG_ID'] = portalConfig.id;
        console.log(`  ✅ Portal config created: ${portalConfig.id}`);
        console.log('     Features: cancel ✓ | invoices ✓ | payment methods ✓');
    } catch (err: any) {
        console.error(`  ❌ Portal config failed: ${err.message}`);
        console.log('     You may need to configure this manually in the Stripe Dashboard.');
    }

    // ── Step 3: Write to .env ──
    console.log('\n📝 Updating .env...\n');

    let envContent = '';
    try {
        envContent = fs.readFileSync(envPath, 'utf-8');
    } catch {
        console.log('  No existing .env found, creating new one.');
    }

    // Remove old STRIPE_PRICE_ and STRIPE_PRODUCT_ lines (we'll rewrite them)
    const existingLines = envContent.split('\n');
    const filteredLines = existingLines.filter(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('STRIPE_PRICE_') || trimmed.startsWith('STRIPE_PRODUCT_') || trimmed.startsWith('STRIPE_PORTAL_CONFIG_ID')) {
            return false;
        }
        return true;
    });

    // Remove trailing empty lines
    while (filteredLines.length > 0 && filteredLines[filteredLines.length - 1].trim() === '') {
        filteredLines.pop();
    }

    // Add new section
    filteredLines.push('');
    filteredLines.push('# ── Stripe Products & Prices (auto-generated by setup-stripe.ts) ──');

    for (const level of LEVELS) {
        filteredLines.push(`# ${level.label}`);
        for (const tier of TIERS) {
            const productKey = toProductEnvKey(level, tier);
            const priceKey = toEnvKey(level, tier);
            if (envUpdates[productKey]) {
                filteredLines.push(`${productKey}=${envUpdates[productKey]}`);
            }
            if (envUpdates[priceKey]) {
                filteredLines.push(`${priceKey}=${envUpdates[priceKey]}`);
            }
        }
    }

    filteredLines.push('');
    filteredLines.push('# ── Stripe Billing Portal ──');
    if (envUpdates['STRIPE_PORTAL_CONFIG_ID']) {
        filteredLines.push(`STRIPE_PORTAL_CONFIG_ID=${envUpdates['STRIPE_PORTAL_CONFIG_ID']}`);
    }
    filteredLines.push('');

    fs.writeFileSync(envPath, filteredLines.join('\n'));
    console.log('  ✅ .env updated with all product/price/portal IDs.\n');

    // ── Summary ──
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║   Setup Complete!                                ║');
    console.log('╠══════════════════════════════════════════════════╣');
    console.log(`║   Products created:  ${Object.keys(productPriceMap).length.toString().padEnd(27)}║`);
    console.log(`║   Prices created:    ${allPriceIds.length.toString().padEnd(27)}║`);
    console.log(`║   Portal config:     ${(envUpdates['STRIPE_PORTAL_CONFIG_ID'] || 'failed').substring(0, 27).padEnd(27)}║`);
    console.log('╚══════════════════════════════════════════════════╝');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
