
// ForexElites - Gadaffi Elite Scanner - EMAIL CAPTURE + REFERRAL TRACKING
const CONFIG = {
  SHEET_API_URL: "https://script.google.com/macros/s/AKfycbyOeJarLWLpK0Xey1nzkH1OMbqdX3DrchinA54m8WeWESQ7VHf9wQyr0p2WCMmOPi2O/exec",
  PRODUCT_NAME: "Gadaffi Elite Automated Scanner",
  PRICE_USD: 199
};

(function initReferral() {
  const params = new URLSearchParams(window.location.search);
  const refFromUrl = params.get('ref') || params.get('referral');
  if (refFromUrl) {
    localStorage.setItem('forexelites_ref', refFromUrl);
    localStorage.setItem('forexelites_ref_time', Date.now());
    trackClick(refFromUrl);
  }
})();

async function trackClick(referrer) {
  try {
    await fetch(CONFIG.SHEET_API_URL, {method:"POST", mode:"no-cors", headers:{"Content-Type":"application/json"}, body: JSON.stringify({action:"click", referrer: referrer, product: CONFIG.PRODUCT_NAME, url: window.location.href, userAgent: navigator.userAgent})});
  } catch(e){}
}

async function captureEmailLead(email) {
  const referrer = localStorage.getItem('forexelites_ref') || "";
  try {
    const res = await fetch(CONFIG.SHEET_API_URL, {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({action:"lead", email: email, referrer: referrer, product: CONFIG.PRODUCT_NAME, url: window.location.href})});
    const data = await res.json();
    localStorage.setItem('forexelites_email', email);
    return data;
  } catch(err) {
    localStorage.setItem('forexelites_email', email);
    return {success:true, email:email, referrer:referrer, note:"Captured locally, check Sheet Leads tab"};
  }
}

async function registerAffiliate(username, email, phone) {
  const referrer = localStorage.getItem('forexelites_ref') || "";
  const payload = {action:"register", username:username, email:email, phone:phone, referrer:referrer, product:CONFIG.PRODUCT_NAME, timestamp:new Date().toISOString()};
  try {
    const res = await fetch(CONFIG.SHEET_API_URL, {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload)});
    return await res.json();
  } catch(err){return {success:false, error:err.message};}
}

async function recordSale(buyerUsername, buyerEmail, paymentMethod, amount, txCode) {
  const referrer = localStorage.getItem('forexelites_ref') || "";
  const payload = {action:"sale", buyer:buyerUsername, buyerEmail:buyerEmail, referrer:referrer, product:CONFIG.PRODUCT_NAME, price:199, paymentMethod:paymentMethod, amount:amount, txCode:txCode, timestamp:new Date().toISOString()};
  try {
    const res = await fetch(CONFIG.SHEET_API_URL, {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload)});
    return await res.json();
  } catch(err){return {success:false, error:err.message};}
}

function getCurrentReferrer(){return localStorage.getItem('forexelites_ref') || null;}
function getCurrentEmail(){return localStorage.getItem('forexelites_email') || null;}
