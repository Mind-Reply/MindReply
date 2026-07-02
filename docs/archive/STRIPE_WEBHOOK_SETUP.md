# STRIPE WEBHOOK SETUP - LIVE PRODUCTION

## Status: READY TO ACTIVATE

Your webhook handler is deployed and ready. Follow these 3 steps to activate Stripe payments.

---

## STEP 1: Get Your Stripe Keys

1. Go to: https://dashboard.stripe.com/apikeys
2. Copy:
   - **Publishable Key** (starts with `pk_live_`)
   - **Secret Key** (starts with `sk_live_`)
3. Add to GitHub Secrets:
   ```bash
   gh secret set STRIPE_PUBLIC_KEY --body "pk_live_..."
   gh secret set STRIPE_SECRET_KEY --body "sk_live_..."
   ```

---

## STEP 2: Create Webhook Endpoint in Stripe

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Fill in:
   - **Endpoint URL**: `https://mind-reply.com/webhook/stripe/charge.succeeded`
   - **Events to send**:
     - `charge.succeeded`
     - `charge.failed`
     - `customer.subscription.updated`
4. Click "Add endpoint"
5. Scroll down and copy the **Signing secret** (starts with `whsec_`)
6. Add to GitHub Secrets:
   ```bash
   gh secret set STRIPE_WEBHOOK_SECRET --body "whsec_..."
   ```

---

## STEP 3: Verify Webhook is Working

### Test Locally (Development)
```bash
# Start webhook handler
cd MindReply/automation/webhook
python3 stripe_webhook_production.py

# In another terminal, send test event
curl -X POST http://localhost:9000 \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: test" \
  -d '{
    "type": "charge.succeeded",
    "data": {
      "object": {
        "id": "ch_test123",
        "amount": 60000,
        "currency": "gbp",
        "receipt_email": "test@mind-reply.com",
        "metadata": {"product": "website-completion-package"}
      }
    }
  }'

# Expected output: [CHARGE SUCCESS] ch_test123 - £600.00 GBP
```

### Test in Production
1. Go to: https://mind-reply.com/checkout
2. Use Stripe test card: `4242 4242 4242 4242`
3. Expiry: Any future date (e.g., 12/26)
4. CVC: Any 3 digits (e.g., 123)
5. Fill in email and click "Pay"
6. Check:
   - Webhook received in Stripe dashboard
   - Order created in database
   - Dashboard metrics updated

---

## ENVIRONMENT VARIABLES

```bash
# Required
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SECRET_KEY=sk_live_...

# Optional (defaults shown)
N8N_WEBHOOK_URL=http://localhost:5678/webhook
DB_HOST=localhost
DB_USER=mindreply
DB_PASS=devpass123
DB_NAME=mindreply
```

---

## WHAT HAPPENS ON PAYMENT

1. **Customer pays** on https://mind-reply.com/checkout
2. **Stripe processes** charge (< 1 second)
3. **Webhook fires** to `/webhook/stripe/charge.succeeded`
4. **N8N receives** event (< 1 second)
5. **Database records** order as "paid" (< 1 second)
6. **Dashboard updates** revenue metrics (30s refresh)
7. **Receipt email** sent to customer (auto)
8. **Backend triggers** package delivery workflow

**Total time**: < 3 seconds from payment to database

---

## TESTING WITH STRIPE TEST CARDS

### Successful Payment
- Card: `4242 4242 4242 4242`
- Result: Charge succeeds

### Failed Payment
- Card: `4000 0000 0000 0002`
- Result: Charge fails

### Additional Test Cards
See: https://stripe.com/docs/testing

---

## PRODUCTION CHECKLIST

- [ ] Stripe account created
- [ ] Publishable key added to GitHub Secrets
- [ ] Secret key added to GitHub Secrets
- [ ] Webhook endpoint created in Stripe
- [ ] Webhook signing secret added to GitHub Secrets
- [ ] Webhook handler deployed (`stripe_webhook_production.py`)
- [ ] N8N webhook URL configured
- [ ] Database connection tested
- [ ] Test payment successful
- [ ] Order appears in database
- [ ] Dashboard metrics updated
- [ ] Receipt email received

---

## MONITORING

### View Webhook Events
```bash
# Stripe dashboard
https://dashboard.stripe.com/webhooks

# Select endpoint → View events → See details
```

### Check Database Orders
```bash
# Connect to database
psql postgresql://mindreply:devpass123@localhost:5432/mindreply

# View orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;
```

### Monitor N8N
```bash
# Open N8N UI
http://localhost:5678

# Go to Workflows → Check execution logs
```

---

## TROUBLESHOOTING

### Webhook Not Triggering
1. Verify webhook URL is correct: `https://mind-reply.com/webhook/stripe/charge.succeeded`
2. Check webhook is enabled in Stripe dashboard
3. View Stripe webhook logs for delivery attempts
4. Check server logs for incoming requests

### Order Not in Database
1. Verify N8N webhook endpoint is running
2. Check database connection: `psql postgresql://...`
3. Verify `orders` table exists
4. Check N8N logs for errors

### Revenue Dashboard Not Updating
1. Verify order was created in database
2. Check dashboard API endpoint: `/api/dashboard/metrics`
3. Verify front-end is calling API (check browser console)
4. Refresh browser cache (Ctrl+Shift+R)

---

## LIVE PRODUCTION

Once all steps complete:
- ✅ Payments are captured automatically
- ✅ Revenue flows to database
- ✅ Dashboard shows real-time metrics
- ✅ N8N brain routes orders to delivery
- ✅ Customers receive receipts automatically
- ✅ System scales without manual work

**You're now capturing revenue 24/7.**

---

Next: Test your first payment using the checklist above.
