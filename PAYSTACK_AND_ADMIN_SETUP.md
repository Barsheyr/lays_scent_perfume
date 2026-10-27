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
- `NEXT_PUBLIC_SITE_URL` — `https://layahs-scent-perfume.vercel.app`
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
