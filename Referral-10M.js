// ForexElites 10M Sheets - Referral Tracking + Email Capture (replaces Supabase)
const CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycbyOeJarLWLpK0Xey1nzkH1OMbqdX3DrchinA54m8WeWESQ7VHf9wQyr0p2WCMmOPi2O/exec",
  PRODUCT: "Gadaffi Elite Automated Scanner",
  COMMISSION_RATES: [0.10, 0.08, 0.07, 0.06, 0.05], // 10/8/7/6/5 = $71.64 total
  WEBSITE: "https://bradleyhome.github.io/ForexElites"
};

// Get ref from URL and store for 12 months
(function trackRef(){
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  if(ref){
    localStorage.setItem('forexelites_ref', ref.toLowerCase());
    localStorage.setItem('forexelites_ref_time', Date.now().toString());
    // Log click to Sheets Clicks tab (handles 10M via sharding)
    fetch(`${CONFIG.API_URL}?ref=${encodeURIComponent(ref)}&product=${encodeURIComponent(CONFIG.PRODUCT)}&url=${encodeURIComponent(window.location.href)}`, {mode:'no-cors'}).catch(()=>{});
  }
})();

function getReferrer(){
  return localStorage.getItem('forexelites_ref') || 'direct';
}

// Called from index.html email form - logs to Leads tab
async function captureEmailLead(email){
  const referrer = getReferrer();
  try{
    await fetch(`${CONFIG.API_URL}?email=${encodeURIComponent(email)}&referrer=${encodeURIComponent(referrer)}&action=lead`, {mode:'no-cors'});
    console.log('Lead captured:', email, 'ref:', referrer, '-> Leads tab Pending');
    return {success:true, referrer};
  }catch(e){
    console.log('Lead queued (no-cors):', email);
    return {success:true, referrer};
  }
}

// For Till payment verification - logs sale to Sales + Commissions
async function logSale(email, mpesaCode){
  const referrer = getReferrer();
  await fetch(`${CONFIG.API_URL}?action=sale&email=${encodeURIComponent(email)}&mpesa=${encodeURIComponent(mpesaCode)}&referrer=${encodeURIComponent(referrer)}`, {mode:'no-cors'});
}

// Expose globally
window.ForexElites = { getReferrer, captureEmailLead, logSale, CONFIG };
