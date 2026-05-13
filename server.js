import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

// Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { trackName, price } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: `Track: ${trackName}`,
                        description: 'Digital Download - Souheil Music',
                    },
                    unit_amount: 500, // 5.00€ - Fixed for demo, can be dynamic
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/index.html`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Serve the frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
