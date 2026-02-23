import { mailGunGetMessages } from "./getMessages";
import moment from "moment";
import rp from "request-promise";

function actuallyGetMessage(url) {
  return new Promise((resolve, reject) => {
    let httpSection = url.slice(0, 8);
    let urlSection = url.slice(8);
    let authSection = 'api:key-683014b1276b1854c7e2cb776264cf06@';

    const messageUrl = ''.concat(httpSection, authSection, urlSection);
    console.log(messageUrl);
    try {
      rp(messageUrl).then(res => {
        resolve(res)
      })
    } catch (e) {
      console.log(e);
      reject(e);
    }
  })
}

export async function getConfirmCode(emailAddress) {
  let currentTime = moment.utc();
  let code = null;
  let iters = 0;
  return new Promise((resolve, reject) => {
    let intervalFunc = setInterval(() => {
      console.log("---------------------");
      console.log(currentTime.format());
      mailGunGetMessages().then(messages => {
        messages.forEach(async message => {
          console.log("msg: ", moment.utc(message.timestamp, 'X').format());
          if (moment.utc(message.timestamp, 'X').isSameOrAfter(currentTime)) {
          // if (true) {
            console.log("is this your code?");
            // console.log(message.storage);
            actuallyGetMessage(message.storage.url).then(content => {
              // console.log("!!!!!!!!", content);
              content = JSON.parse(content);
              // console.log(Object.keys(content));
              // console.log(content["recipients"]);
              // console.log(content["From"]);
              // console.log(content["subject"]);
              // console.log(content["stripped-text"]);
              if (content["recipients"] === emailAddress
              && content["From"] === "contact@ilingu.com"
              && content["subject"] === "Please verify your email at ilingu.com") {
                code = content["stripped-text"].slice(-6);
                console.log(code);
                clearInterval(intervalFunc);
                resolve(code);
              }
            })
          }
        });
        iters += 1;
        if (iters > 10) {
          clearInterval(intervalFunc);
          reject("Not found");
        }
      })
    }, 2000);
  })
}