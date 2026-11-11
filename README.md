# LOOK store (static, no build step)

Open `index.html`, or deploy the folder to Vercel as-is.

| Screen | Files |
|---|---|
| Listing (location bar, quick chips, category tiles, style circles, cards, floating Sort/Brand/Size/Colour/Filters bar) | `index.html`, `script.js` |
| Filters page (two-pane: full screen on phones, modal on larger screens; Apply / Close / Clear all) | `script.js` |
| Bag (delivery, size + quantity, coupons, price details, Place order) | `cart.html`, `cart.js` |
| Login + OTP (mobile number, demo code **1234**) | `login.html`, `login.js` |
| Shared data, store, header, sheets | `common.js`, `styles.css` |

Brand colour and tokens are at the top of `styles.css` (`--brand`, `--lav`, ...).
Products, colours, ratings, fit/fabric/neck and delivery days are at the top of `common.js`.
Stock levels, 90-day price history, ratings and sign-in are demo data / front-end only.

## Group bag (shop together)
Start it from the Bag page. Add items from the listing by choosing "Group" in the size sheet.
`group.html` shows members, who added what, likes, group total (and per-person split) and chat.
Demo sync uses localStorage: open the invite link in a second window of the same browser to see live updates,
or tap "Add a demo friend". Friends on other devices need a real backend (e.g. Firebase/Supabase) - the `Group` object
at the bottom of `common.js` is the only part to swap.
