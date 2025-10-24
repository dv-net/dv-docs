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

Before the plugin can work, you need to connect it to your DV.net account using API keys.

1. Log in to your DV.net account dashboard.
2. Navigate to the API Keys section (based on the obtaining-api-key-and-secret.md file).
3. Click the "Create New Key" button.
4. Give your key a descriptive name (e.g., "WooCommerce Store").
5. The system will generate an API Key and an API Secret.
6. Important: Copy both the API Key and API Secret and save them somewhere secure, like a password manager. You will not be able to see the secret again after you leave this page.
7. Also, take note of your API URL. This is the main URL of your DV.net instance (e.g., https://api.your-dv-instance.com).

## Step 4: Configure the DV.net Gateway in WooCommerce

With your API keys in hand, you can now configure the plugin's settings inside WooCommerce.

1. In your WordPress dashboard, go to WooCommerce > Settings.
2. Click on the Payments tab at the top of the page.
3. You will see "DV.net" in the list of payment methods. Click the Manage button on the far right.
4. This will open the DV.net settings page. Fill out the following fields (which we found in the class-dv-gateway.php file):
   1. Enable/Disable: Check the box for "Enable DV.net" to make this payment method available at checkout.
   2. Title: This is the text customers will see when choosing a payment method. For example: "Pay with Crypto via DV.net".
   3. Description: This is the short text shown under the title. For example: "Securely pay with cryptocurrency."
   4. API URL: Paste the API URL you noted in Step 3.
   5. API Key: Paste the API Key you generated in Step 3.
   6. API Secret: Paste the API Secret you saved in Step 3.
   7. Webhook Secret: This is a crucial field for security. You must create a strong, unique secret phrase (e.g., using a password generator). Think of it as a password that DV.net and your store will share. Save this secret, as you will need it in the next step.
5. Click the Save changes button at the bottom of the page.

## Step 5: Configure the Webhook in Your DV.net Account

Your store is now set up to send payment requests to DV.net. The final step is to set up a webhook so DV.net can send payment status updates (like "Paid" or "Failed") back to your store.

1. Go back to your DV.net account dashboard.
2. Navigate to the Webhooks or Developer section.
3. Create a new webhook.
4. Payload URL: This is the most important part. Your store's unique webhook URL is: https://yourdomain.com/wc-api/dv_gateway/ (Remember to replace yourdomain.com with your actual website address. Make sure it uses https://).
5. Secret: Paste the exact same Webhook Secret that you created and saved in Step 4. This is used to verify that the incoming requests are genuinely from DV.net (as mentioned in webhook-signature-verification.md).
6. Events: If prompted, select the events this webhook should listen for. You should enable all payment-related events, such as:
   1. payment.completed
   2. payment.failed
   3. invoice.paid (Note: The exact event names may vary. Select all that relate to payment status changes.)
7. Save and activate the webhook in your DV.net dashboard.

Step 6: You're All Set! (Don't Forget to Test)

Congratulations! The DV.net payment gateway is now fully integrated with your WooCommerce store.

The last thing to do is run a live test. The best way to do this is to:
1. Go to your store as if you were a customer.
2. Add a real product to your cart.
3. Go to the checkout page.
4. Select "Pay with Crypto via DV.net" (or the title you set).
5. Place the order and ensure you are correctly redirected to the DV.net payment page.
6. We highly recommend completing a small test transaction to confirm that the order status is automatically updated in your WooCommerce Orders section from "Pending payment" to "Processing" or "Completed" after the payment is successful.

If the order status updates automatically, your integration is a success!