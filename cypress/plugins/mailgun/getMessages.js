import mailGun from "mailgun.js";
// var mailgun = require('mailgun.js');
// const mg = mailGun.client({username: 'api', key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere'});

export async function mailGunGetMessages() {
  let api_key = "key-683014b1276b1854c7e2cb776264cf06";
  const mg = mailGun.client({username: 'api', key: api_key});
  try {
    return mg.events.get('testing.ilingu.com').then(data => {
      // console.log(data.items);
      return data.items
    }) // logs array of event objects
  } catch (e) {
    console.log("error: ", e); // logs any error
  }
}