# Connecting a payment form without using API

You can connect a payment form without API integration by following these simple steps:

## 1. Find your store's payment link

Log in to your project account and go to **Projects**, **Edit**, **Advanced settings**.

There you will find **link to the payment form without API**, inside which there is **UUID** (unique identifier) ​​of your store.

## 2. Modify the payment link

Use the following format to generate a payment link:

### Where:

- `{your-domain-or-subdomain}` is your registered domain or subdomain.
- `{store-uuid}` is the UUID of your store (specified in the store link).
- `{client-id}` is a unique client identifier that you assign when generating the link. It is needed to track the payment and link it to the desired client wallet.

> ⚠️ **Important:** `client-id` must be unique for each client session to ensure proper tracking and identification.

---

Once the link is generated, you can either redirect the client to it or embed it in a button on your site.