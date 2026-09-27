// ForexElites - Gadaffi Elite Automated Scanner - Live Tracker (Connected to your Sheet)
// Updated with your deployed Web App URL

const CONFIG = {
  SHEET_API_URL: "https://script.google.com/macros/s/AKfycbzhPby85ZPOHOYsLz2219QIil-GD-7Flp7Ego94QHtP7A-2fkQELGg10743msDmelhj/exec",
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
    trackClick(refFromUrl);
  }
})();

async function trackClick(referrer) {
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
  } catch(e) { console.log("Click tracked"); }
}

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

async function recordSale(buyerUsername, buyerEmail, paymentMethod, amountKESorUSD, txCode) {
  const referrer = localStorage.getItem('forexelites_ref') || "";
  const payload = {
    action: "sale",
    buyer: buyerUsername,
    buyerEmail: buyerEmail,
    referrer: referrer,
    product: CONFIG.PRODUCT_NAME,
    price: 199,
    paymentMethod: paymentMethod,
    amount: amountKESorUSD,
    txCode: txCode,
    timestamp: new Date().toISOString()
  };
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

function getCurrentReferrer() {
  return localStorage.getItem('forexelites_ref') || null;
}
