// stripeService.js - Sistema de Pagos con Stripe
require('dotenv').config();
const Stripe = require('stripe');
const axios = require('axios');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_xxx');

let supabaseAdmin = null;

const init = (supabaseUrl, supabaseKey) => {
    const { createClient } = require('@supabase/supabase-js');
    if (supabaseUrl && supabaseKey) {
        supabaseAdmin = createClient(supabaseUrl, supabaseKey);
    }
};

// Crear cliente en Stripe
const createStripeCustomer = async (client) => {
    try {
        const customer = await stripe.customers.create({
            email: client.owner_email,
            name: client.company_name,
            metadata: {
                client_id: client.id
            }
        });
        return customer;
    } catch (error) {
        console.error('Error creating Stripe customer:', error);
        return null;
    }
};

// Crear sesión de checkout
const createCheckoutSession = async (clientId, planId, successUrl, cancelUrl) => {
    try {
        const { data: client } = await supabaseAdmin
            .from('clients')
            .select('*, subscription_plans(*)')
            .eq('id', clientId)
            .single();

        if (!client) throw new Error('Client not found');

        let stripeCustomerId = client.stripe_customer_id;

        if (!stripeCustomerId) {
            const stripeCustomer = await createStripeCustomer(client);
            stripeCustomerId = stripeCustomer.id;
            await supabaseAdmin
                .from('clients')
                .update({ stripe_customer_id: stripeCustomerId })
                .eq('id', clientId);
        }

        const plan = client.subscription_plans;
        const priceId = getStripePriceId(plan.id);

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{
                price: priceId,
                quantity: 1
            }],
            success_url: successUrl || `${process.env.APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl || `${process.env.APP_URL}/payment/cancelled`,
            metadata: {
                client_id: clientId,
                plan_id: planId
            }
        });

        return { sessionId: session.id, url: session.url };
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return { error: error.message };
    }
};

// Obtener Price ID de Stripe según el plan
const getStripePriceId = (planId) => {
    const priceIds = {
        'basic': process.env.STRIPE_PRICE_BASIC || 'price_basic_xxx',
        'pro': process.env.STRIPE_PRICE_PRO || 'price_pro_xxx',
        'enterprise': process.env.STRIPE_PRICE_ENTERPRISE || 'price_enterprise_xxx'
    };
    return priceIds[planId] || priceIds.basic;
};

// Crear portal de cliente (gestión de suscripción)
const createCustomerPortalSession = async (clientId) => {
    try {
        const { data: client } = await supabaseAdmin
            .from('clients')
            .select('stripe_customer_id')
            .eq('id', clientId)
            .single();

        if (!client?.stripe_customer_id) {
            return { error: 'No Stripe customer found' };
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: client.stripe_customer_id,
            return_url: process.env.APP_URL
        });

        return { url: session.url };
    } catch (error) {
        console.error('Error creating portal session:', error);
        return { error: error.message };
    }
};

// Webhook de Stripe
const handleWebhook = async (event) => {
    switch (event.type) {
        case 'checkout.session.completed':
            await handleCheckoutComplete(event.data.object);
            break;
        case 'customer.subscription.updated':
            await handleSubscriptionUpdate(event.data.object);
            break;
        case 'customer.subscription.deleted':
            await handleSubscriptionCancelled(event.data.object);
            break;
        case 'invoice.payment_succeeded':
            await handlePaymentSuccess(event.data.object);
            break;
        case 'invoice.payment_failed':
            await handlePaymentFailed(event.data.object);
            break;
    }
};

const handleCheckoutComplete = async (session) => {
    const { client_id, plan_id } = session.metadata;
    
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    
    await supabaseAdmin
        .from('subscriptions')
        .upsert([{
            client_id,
            plan_id,
            status: 'active',
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            payment_method: 'card',
            payment_id: session.payment_intent
        }]);

    await supabaseAdmin
        .from('clients')
        .update({
            plan_id,
            subscription_status: 'active',
            subscription_started_at: new Date().toISOString(),
            subscription_ends_at: new Date(subscription.current_period_end * 1000).toISOString()
        })
        .eq('id', client_id);
};

const handleSubscriptionUpdate = async (subscription) => {
    await supabaseAdmin
        .from('subscriptions')
        .update({
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
        })
        .eq('stripe_subscription_id', subscription.id);
};

const handleSubscriptionCancelled = async (subscription) => {
    const { data: client } = await supabaseAdmin
        .from('clients')
        .select('id')
        .eq('stripe_customer_id', subscription.customer)
        .single();

    if (client) {
        await supabaseAdmin
            .from('clients')
            .update({
                subscription_status: 'cancelled',
                plan_id: 'free'
            })
            .eq('id', client.id);
    }
};

const handlePaymentSuccess = async (invoice) => {
    const { data: payment } = await supabaseAdmin
        .from('payments')
        .insert([{
            client_id: invoice.metadata?.client_id,
            stripe_payment_intent_id: invoice.payment_intent,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: 'succeeded',
            receipt_url: invoice.hosted_invoice_url,
            invoice_pdf_url: invoice.invoice_pdf,
            invoice_number: invoice.number
        }])
        .select()
        .single();

    // Trigger webhook
    if (payment) {
        await triggerWebhook(payment.client_id, 'payment.succeeded', payment);
    }
};

const handlePaymentFailed = async (invoice) => {
    const { data: client } = await supabaseAdmin
        .from('clients')
        .select('id')
        .eq('stripe_customer_id', invoice.customer)
        .single();

    if (client) {
        await supabaseAdmin
            .from('clients')
            .update({ subscription_status: 'past_due' })
            .eq('id', client.id);

        await triggerWebhook(client.id, 'payment.failed', { invoice });
    }
};

// Obtener suscripción activa
const getSubscription = async (clientId) => {
    const { data: subscription } = await supabaseAdmin
        .from('subscriptions')
        .select('*')
        .eq('client_id', clientId)
        .eq('status', 'active')
        .single();

    return subscription;
};

// Obtener historial de pagos
const getPaymentHistory = async (clientId, limit = 10) => {
    const { data } = await supabaseAdmin
        .from('payments')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(limit);

    return data || [];
};

// Cancelar suscripción
const cancelSubscription = async (clientId, immediately = false) => {
    try {
        const { data: client } = await supabaseAdmin
            .from('clients')
            .select('stripe_customer_id')
            .eq('id', clientId)
            .single();

        if (!client?.stripe_customer_id) {
            return { error: 'No subscription found' };
        }

        const subscriptions = await stripe.subscriptions.list({
            customer: client.stripe_customer_id,
            status: 'active'
        });

        if (subscriptions.data.length > 0) {
            const sub = subscriptions.data[0];
            
            if (immediately) {
                await stripe.subscriptions.cancel(sub.id);
            } else {
                await stripe.subscriptions.update(sub.id, {
                    cancel_at_period_end: true
                });
            }
        }

        return { success: true };
    } catch (error) {
        console.error('Error cancelling subscription:', error);
        return { error: error.message };
    }
};

// Webhook trigger helper
const triggerWebhook = async (clientId, event, data) => {
    const { data: webhooks } = await supabaseAdmin
        .from('webhooks')
        .select('*')
        .eq('client_id', clientId)
        .eq('is_active', true)
        .contains('events', [event]);

    for (const webhook of webhooks || []) {
        try {
            const crypto = require('crypto');
            const signature = crypto
                .createHmac('sha256', webhook.secret)
                .update(JSON.stringify(data))
                .digest('hex');

            await axios.post(webhook.url, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Webhook-Signature': signature,
                    'X-Webhook-Event': event
                },
                timeout: 10000
            });

            await supabaseAdmin
                .from('webhook_logs')
                .insert([{
                    webhook_id: webhook.id,
                    event,
                    payload: data,
                    response_status: 200,
                    success: true
                }]);

        } catch (error) {
            await supabaseAdmin
                .from('webhook_logs')
                .insert([{
                    webhook_id: webhook.id,
                    event,
                    payload: data,
                    response_status: error.response?.status,
                    response_body: error.message,
                    success: false,
                    retry_count: 1
                }]);
        }
    }
};

module.exports = {
    init,
    createCheckoutSession,
    createCustomerPortalSession,
    handleWebhook,
    getSubscription,
    getPaymentHistory,
    cancelSubscription,
    triggerWebhook
};
