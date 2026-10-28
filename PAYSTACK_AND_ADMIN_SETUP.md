# Paystack checkout + admin dashboard — setup

## 1. Rotate leaked keys (do this first)
`.env.local` was committed to this public repo. Treat every value in it as leaked:
- **Neon**: reset the database password (Neon console → Roles → Reset password), update DATABASE_URL / DIRECT_URL.
- **Clerk**: roll the secret key (Clerk dashboard → API Keys).
- **ImageKit**: regenerate the private key (Developer options).
Put the new values in Vercel → Project → Settings → Environment Variables, never in git.
Removing the file from the repo does not remove it from git history, so rotating is the real fix.

## 2. Add environment variables in Vercel
- `PAYSTACK_SECRET_KEY` — start with your **test** secret key (`sk_test_...`)
- `SITE_URL` (optional) — your site address; if left out, the site uses its own address automatically
- `NEXT_PUBLIC_CURRENCY_SYMBOL` — `₦`

## 3. Update the database
From your computer, with DIRECT_URL set in `.env.local`:
```
npm install
npx prisma db push
```
This only **adds** columns/tables (cost price, stock, stock movements, expenses, new statuses). Existing data is kept.

## 4. Paystack webhook
Paystack dashboard → Settings → API Keys & Webhooks → **Test Webhook URL**:
```
https://layahs-scent-perfume.vercel.app/api/paystack/webhook
```
The callback URL is set automatically by the code (`/payment/verify`).

## 5. Test a payment
Checkout while logged in → "Pay now" → use Paystack's test card
`4084 0840 8408 4081`, any future expiry, CVV `408`, PIN `0000`, OTP `123456`.
The order should appear under Admin → Orders → In progress, marked Paid.

## 6. Count your stock
Admin → Inventory: for each perfume, **Correct count** (how many bottles you have) and **Edit** (cost price).
Until a product is counted, it isn't limited by stock.

## 7. Go live
Swap `PAYSTACK_SECRET_KEY` to `sk_live_...` and set the **Live** webhook URL in Paystack.

## How the numbers work
- **Revenue** = total of orders marked *Sold* (delivered).
- **Total spend** = everything in Expenses (stock purchases logged via *Goods in* are added automatically).
- **Net profit** = revenue − total spend. Early on this can be negative because unsold stock is still on the shelf.
- **Profit on bottles sold** = selling price − cost price for sold orders.
- Stock goes down when a COD order is placed or a Paystack payment is confirmed, and goes back up if you cancel the order.
- Guest checkout (not logged in) still goes to WhatsApp and isn't recorded in the dashboard.

## New-order alerts
Every new order (cash on delivery straight away, Paystack once payment is confirmed) can alert you three ways:

1. **In the admin dashboard** — always on. The Orders link shows how many new orders need action, and a pop-up + sound appears when one comes in (checks every 30 seconds while the dashboard is open). Click **🔔 Turn on order alerts** in the sidebar to also get browser notifications when the tab is in the background.
2. **Telegram (recommended, free, instant on your phone)**
   - In Telegram, chat with **@BotFather** → `/newbot` → copy the token into `TELEGRAM_BOT_TOKEN`.
   - Send any message to your new bot, then open `https://api.telegram.org/bot<TOKEN>/getUpdates` and copy the number after `"chat":{"id":` into `TELEGRAM_CHAT_IDS`.
   - Each person to alert (you, the seller) does the "message the bot" step; list all their chat ids, comma-separated.
3. **Email** — sign up at resend.com, create an API key → `RESEND_API_KEY`, and put the addresses in `NOTIFY_EMAILS`. With the default sender (`onboarding@resend.dev`) Resend only delivers to the email you signed up with; verify your own domain in Resend to email anyone.

Add the same variables in Vercel, then redeploy.

## WhatsApp updates to customers
When you move an order to **Processing**, **Out for delivery** or **Delivered**, the customer gets a WhatsApp message. Wording lives in `lib/customerMessages.js` — edit it freely.

### Option A — one tap (works now, free)
After changing a status, a pop-up offers **Send WhatsApp**. It opens WhatsApp (phone or WhatsApp Web) with the message already typed to the customer's number — you just press send. The same button is inside each order's details.

### Option B — fully automatic (WhatsApp Business Cloud API)
Messages go out by themselves from your business number. Meta charges a small fee per message (check current Nigeria rates on Meta's pricing page).

1. Go to developers.facebook.com → **Create app** → type **Business** → add **WhatsApp**.
2. Add a phone number for the shop (it can't be a number already used in the normal WhatsApp app unless you move it over).
3. From **WhatsApp → API Setup** copy the **Phone number ID** → `WHATSAPP_PHONE_NUMBER_ID`.
4. Create a permanent token: Business Settings → **System users** → add one → generate token with `whatsapp_business_messaging` → `WHATSAPP_TOKEN`.
5. In **WhatsApp Manager → Message templates**, create these three (Category: **Utility**, Language: **English**). Meta must approve them before they send:

**order_processing**
```
Hi {{1}} 👋 Thank you for shopping with Layah's Scent! 💐 We've received your order {{2}} and we're carefully preparing it for you. We'll message you again as soon as it's on its way.
```
**order_out_for_delivery**
```
Good news, {{1}}! 🚚 Your Layah's Scent order {{2}} is out for delivery and should get to you within the next 2 days. Our rider will call you before arriving, so please keep your phone close. {{3}}
```
**order_delivered**
```
Hi {{1}}, your order {{2}} has been delivered 🎉 Thank you for choosing Layah's Scent, we hope you love your new fragrance! We'll be right here when you're ready for your next scent.
```
6. Add both variables to `.env` and Vercel, restart/redeploy. The pop-up will then say "WhatsApp sent to customer" instead of offering the button.

Keep the templates factual (order updates). Meta may re-classify heavily promotional wording as "Marketing", which costs more.
