// ForexElites - Gadaffi Elite Automated Scanner - Free Referral Tracker
// Works on GitHub Pages + Google Sheets (free hosting)

const CONFIG = {
  // REPLACE with your Google Apps Script Web App URL after deploy
  SHEET_API_URL: "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
  PRODUCT_NAME: "Gadaffi Elite Automated Scanner",
  PRICE_USD: 199,
  DURATION: "12 Months"
};

// Save referral on page load
(function initReferral() {
  const params = new URLSearchParams(window.location.search);
  const refFromUrl = params.get('ref') || params.get('referral');
  
  if (refFromUrl) {
    localStorage.setItem('forexelites_ref', refFromUrl);
    localStorage.setItem('forexelites_ref_time', Date.now());
    console.log("Referral saved:", refFromUrl);
    
    // Optional: send to Google Sheet
    trackClick(refFromUrl);
  }
})();

async function trackClick(referrer) {
  if (!CONFIG.SHEET_API_URL.includes("YOUR_SCRIPT_ID")) {
    try {
      await fetch(CONFIG.SHEET_API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "click",
          referrer: referrer,
          product: CONFIG.PRODUCT_NAME,
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      });
    } catch(e) { console.log("Click tracked locally"); }
  }
}

// Called when user signs up as affiliate
async function registerAffiliate(username, email, phone) {
  const referrer = localStorage.getItem('forexelites_ref') || "";
  
  const payload = {
    action: "register",
    username: username,
    email: email,
    phone: phone,
    referrer: referrer,
    product: CONFIG.PRODUCT_NAME,
    timestamp: new Date().toISOString()
  };

  if (CONFIG.SHEET_API_URL.includes("YOUR_SCRIPT_ID")) {
    alert("Demo mode: Affiliate registered locally. Deploy Google Sheet to go live.\n\nUsername: " + username + "\nReferrer: " + (referrer || "None (direct)"));
    return { success: true, demo: true };
  }

  try {
    const res = await fetch(CONFIG.SHEET_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.error(err);
    return { success: false, error: err.message };
  }
}

// Called by admin after confirming M-Pesa / USDT payment
async function recordSale(buyerUsername, buyerEmail, paymentMethod, amountKESorUSD, txCode) {
  const referrer = localStorage.getItem('forexelites_ref') || "";
  
  const payload = {
    action: "sale",
    buyer: buyerUsername,
    buyerEmail: buyerEmail,
    referrer: referrer,
    product: CONFIG.PRODUCT_NAME,
    price: 199,
    paymentMethod: paymentMethod, // "M-Pesa Till 6282142" or "USDT BEP20"
    amount: amountKESorUSD,
    txCode: txCode, // M-Pesa code or TX hash
    timestamp: new Date().toISOString()
  };

  if (CONFIG.SHEET_API_URL.includes("YOUR_SCRIPT_ID")) {
    alert(`Demo sale recorded:\nBuyer: ${buyerUsername}\nReferrer: ${referrer}\nPayment: ${paymentMethod}\n\nIn production this will auto-split 10%/8%/7%/6%/5% to 5 levels.`);
    return { success: true, demo: true };
  }

  try {
    const res = await fetch(CONFIG.SHEET_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Helper to get current referral
function getCurrentReferrer() {
  return localStorage.getItem('forexelites_ref') || null;
}
