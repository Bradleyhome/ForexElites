// ForexElites - Gadaffi Elite Automated Scanner - LIVE TRACKER
// Connected to: https://script.google.com/macros/s/AKfycbyOeJarLWLpK0Xey1nzkH1OMbqdX3DrchinA54m8WeWESQ7VHf9wQyr0p2WCMmOPi2O/exec
// Product: $199 / 12 Months - 5 Levels: 10%/8%/7%/6%/5% = $71.64 total payout

const CONFIG = {
  SHEET_API_URL: "https://script.google.com/macros/s/AKfycbyOeJarLWLpK0Xey1nzkH1OMbqdX3DrchinA54m8WeWESQ7VHf9wQyr0p2WCMmOPi2O/exec",
  PRODUCT_NAME: "Gadaffi Elite Automated Scanner",
  PRICE_USD: 199,
  DURATION: "12 Months"
};

(function initReferral() {
  const params = new URLSearchParams(window.location.search);
  const refFromUrl = params.get('ref') || params.get('referral');
  if (refFromUrl) {
    localStorage.setItem('forexelites_ref', refFromUrl);
    localStorage.setItem('forexelites_ref_time', Date.now());
    console.log("ForexElites Referral saved:", refFromUrl);
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
  } catch(e) {}
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
    const res = await fetch(CONFIG.SHEET_API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
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
    const res = await fetch(CONFIG.SHEET_API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function getCurrentReferrer() {
  return localStorage.getItem('forexelites_ref') || null;
}
