# Accept Crypto Payments on WordPress with the DV.net WooCommerce Plugin

Integrating a crypto payment gateway into your e-commerce store is an excellent way to broaden your customer base and offer modern, secure payment options. DV.net provides a powerful solution for handling these transactions, and its dedicated WooCommerce plugin makes the integration process straightforward.
This guide will walk you, step-by-step, through installing and configuring the DV.net WooCommerce plugin on your WordPress site.

## Prerequisites:

- An active WordPress website.
- The WooCommerce plugin installed and activated.
- An active DV.net account.

## Step 1: Get the DV.net WooCommerce Plugin

The first step is to download the plugin files. Unlike plugins in the official WordPress repository, you'll get this one from the DV.net GitHub page.

Navigate to the official DV.net WooCommerce plugin repository: https://github.com/dv-net/dv-woocommerce (This was provided in your files).
- Click the Releases section on the right menu.
- Select "Source code (zip)" from the menu of the last version.
- Save the .zip file to your computer. Don't unzip it.

## Step 2: Install the Plugin on Your WordPress Site

Now you will upload the downloaded ZIP file to your WordPress admin dashboard.
1. Log in to your WordPress admin area (e.g., yourdomain.com/wp-admin).
2. From the left-hand menu, navigate to Plugins > Add New.
3. At the top of the "Add Plugins" page, click the Upload Plugin button.
4. Click the "Choose File" button and select the dv-woocommerce-main.zip file you just downloaded.
5. Click Install Now.
6. After WordPress finishes installing the plugin, click the Activate Plugin button.
You will now see "DV.net WooCommerce Plugin" in your list of active plugins.

## Step 3: Obtain Your DV.net API Credentials

To connect your store to DV.net, you need your API Key, API Secret, and API URL.

- Log in to your DV.net account dashboard.
- Find your project or create a new one.
- Navigate to the API Keys section to Projects -> Edit button for specific project (referencing obtaining-api-key-and-secret.md from the documentation files).
- You will see API key and secret key. You can regenerate if needed.
- In section below provide URLs for webhooks. Basically you will need webhook on successful payment only.

## Step 4: Configure the DV.net Gateway in WooCommerce

With your API keys in hand, you can now configure the plugin's settings inside WooCommerce.

1. In your WordPress dashboard, go to WooCommerce > Settings.
2. Click on the Payments tab at the top of the page.
3. You will see "DV.net" in the list of payment methods. Click the Manage button on the far right.
4. This will open the DV.net settings page. Fill out the following fields:
   1. Enable/Disable: Check the box for "Enable DV.net" to make this payment method available at checkout.
   2. Title: This is the text customers will see when choosing a payment method. For example: "Pay with Crypto via DV.net".
   3. Description: This is the short text shown under the title. For example: "Securely pay with cryptocurrency."
   4. API URL: Paste the API URL.
   5. API Key: Paste the API Key you saved in Step 3.
   6. API Secret: Paste the API Secret you saved in Step 3.
5. Click the Save changes button at the bottom of the page.

## Step 5: Configure the Webhook in Your DV.net Account

Your store is now set up to send payment requests to DV.net. The final step is to set up a webhook so DV.net can send payment status updates (like "Paid" or "Failed") back to your store.

1. Go back to your DV.net account dashboard.
2. Navigate to the Webhooks or Developer section.
3. Create a new webhook.
4. Payload URL: This is the most important part. Your store's unique webhook URL is: `https://example.com/wc-api/dv_gateway/` (Remember to replace example.com with your actual website address. Make sure it uses https://).
5. Place address for your webhook here (for woo it's kinda like `https://example.com/?wc-api=dv_gateway`)
6. Events: If prompted, select the events this webhook should listen for. You should enable all payment-related events, such as:
   1. Confirmed payment
   2. Unconfirmed payment (i.e when customer will send their payment via BTC and )
   3. Processing withdrawal (currently unsupported by this integration)
7. Save and activate the webhook in your DV.net dashboard.

## Step 6: You're All Set! (Don't Forget to Test)

Congratulations! The DV.net payment gateway is now fully integrated with your WooCommerce store.

The last thing to do is run a live test. The best way to do this is to:
1. Go to your store as if you were a customer.
2. Add a real product to your cart.
3. Go to the checkout page.
4. Select "Pay with Crypto via DV.net" (or the title you set).
5. Place the order and ensure you are correctly redirected to the DV.net payment page.
6. We highly recommend completing a small test transaction to confirm that the order status is automatically updated in your WooCommerce Orders section from "Pending payment" to "Processing" or "Completed" after the payment is successful.

If the order status updates automatically, your integration is a success!