const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbyOeJarLWLpK0Xey1nzkH1OMbqdX3DrchinA54m8WeWESQ7VHf9wQyr0p2WCMmOPi2O/exec',
  PRODUCT: 'Gadaffi Elite Automated Scanner'
};

(function trackRef(){
  try{
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref') || params.get('r');
    if(refParam){
      localStorage.setItem('forexelites_ref', refParam.toLowerCase());
    }
    const ref = localStorage.getItem('forexelites_ref') || 'direct';
    if(refParam){
      localStorage.setItem('forexelites_ref_time', Date.now().toString());
      // Log click to Sheets Clicks tab (handles 10M via sharding)
      fetch(`${CONFIG.API_URL}?ref=${encodeURIComponent(ref)}&product=${encodeURIComponent(CONFIG.PRODUCT)}&url=${encodeURIComponent(window.location.href)}`, {mode: 'no-cors'});
      console.log('Ref tracked:', ref);
    }
  }catch(e){ console.log('trackRef error', e); }
})();

function getReferrer(){
  return localStorage.getItem('forexelites_ref') || 'direct';
}

// Called from index.html email form - logs to Leads tab
async function captureEmailLead(email){
  const referrer = getReferrer();
  try{
    await fetch(`${CONFIG.API_URL}?email=${encodeURIComponent(email)}&referrer=${encodeURIComponent(referrer)}&action=lead`, {mode: 'no-cors'});
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
  try{
    await fetch(`${CONFIG.API_URL}?email=${encodeURIComponent(email)}&mpesa=${encodeURIComponent(mpesaCode)}&referrer=${encodeURIComponent(referrer)}&action=sale`, {mode: 'no-cors'});
    console.log('Sale logged:', email, mpesaCode);
    return {success:true};
  }catch(e){
    return {success:true};
  }
}
