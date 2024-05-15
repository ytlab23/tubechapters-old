import axios from "axios";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
import xml2js from "xml2js";
import OpenAI from "openai";

import puppeteer from "puppeteer";

// List of user-agents
const platforms = [
  "Macintosh; Intel Mac OS X 10_15_7",
  "Windows NT 10.0; Win64; x64",
  "Linux x86_64",
];

const browsers = [
  "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Gecko/20100101 Firefox/89.0",
  "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
];

export const get_data = async (url) => {
  "use server";
  try {
    const randomPlatform =
      platforms[Math.floor(Math.random() * platforms.length)];
    const randomBrowser = browsers[Math.floor(Math.random() * browsers.length)];

    const userAgent = `Mozilla/5.0 (${randomPlatform}) ${randomBrowser}`;
    const response = await fetch(url, {
      proxy: {
        host: process.env.PACKET_IP,
        port: process.env.PACKET_PORT,
        auth: {
          username: process.env.PACKET_USERNAME, // replace with your Packet Stream username
          password: process.env.PACKET_PASSWORD, // replace with your Packet Stream password
        },
      },
      headers: {
        "User-Agent": userAgent,
      },
    });
    return response.text();
  } catch (error) {
    console.error("error --->", error);
  }
};

export const fetchTranscript = async (url) => {
  "use server";
  const html = await get_data(url);
  const dom = new JSDOM(html);
  const scripts = dom.window.document.querySelectorAll("script");
  let captions = [];

  for (let script of scripts) {
    if (script.innerHTML.includes("captionTracks")) {
      const start = script.innerHTML.indexOf("captionTracks");

      const end = script.innerHTML.indexOf("]", start);
      const jsonString = script.innerHTML
        .slice(start, end + 1)
        .replace('captionTracks":', "");
      captions = JSON.parse(jsonString);
      break;
    }
  }

  if (captions.length > 0) {
    const selected_caption = captions[0];
    console.log("selected_caption", selected_caption);
    const subtitles_data = await get_data(selected_caption.baseUrl);
    let subtitle = "";
    xml2js.parseString(subtitles_data, async (err, result) => {
      if (err) {
        res.send("Error parsing XML.");
      } else {
        const parsed_subtitles = result.transcript.text.map((item) => {
          const minutes = Math.floor(Number(item.$.start) / 60);
          const remainingSeconds = Math.round(Number(item.$.start) % 60);
          const time = `${minutes}:${
            remainingSeconds < 10 ? "0" : ""
          }${remainingSeconds}`;
          const lines = item._;
          const arr = { time, lines };
          return arr;
        });
        subtitle = parsed_subtitles;
      }
    });
    return subtitle;
  } else {
    console.log("No suitable subtitles found.");
    return "No suitable subtitles found.";
  }
};

// export const fetchTranscript = async (url) => {
//   const browser = await puppeteer.launch({
//     args: [
//       `--proxy-server=http://${process.env.PACKET_IP}:${process.env.PACKET_PORT}`, // replace with your Packet Stream proxy IP and port
//     ],
//   });
//   const page = await browser.newPage();
//   await page.authenticate({
//     username: process.env.PACKET_USERNAME, // replace with your Packet Stream username
//     password: process.env.PACKET_PASSWORD, // replace with your Packet Stream password
//   });
//   // await page.setUserAgent("Your User Agent String"); // replace with your desired user agent string
//   page.setDefaultNavigationTimeout(1 * 60 * 1000); // Set navigation timeout as needed
//   await page.goto(url);
//   await page.waitForSelector("script"); // Wait for script tags to load

//   const scripts = await page.evaluate(() =>
//     Array.from(document.querySelectorAll("script"), (e) => e.innerHTML)
//   );

//   let captions = [];

//   for (let script of scripts) {
//     if (script.includes("captionTracks")) {
//       const start = script.indexOf("captionTracks");
//       const end = script.indexOf("]", start);
//       const jsonString = script
//         .slice(start, end + 1)
//         .replace('captionTracks":', "");
//       captions = JSON.parse(jsonString);
//       break;
//     }
//   }

//   if (captions.length > 0) {
//     const selected_caption = captions[0];

//     console.log("selected_caption", selected_caption);
//     const response = await page.goto(selected_caption.baseUrl);
//     const subtitles_data = await response.text();
//     let subtitle = "";
//     console.log("subtitles_data", subtitles_data);
//     xml2js.parseString(subtitles_data, async (err, result) => {
//       if (err) {
//         return "Error parsing XML.";
//       } else {
//         const parsed_subtitles = result.transcript.text.map((item) => {
//           const minutes = Math.floor(Number(item.$.start) / 60);
//           const remainingSeconds = Math.round(Number(item.$.start) % 60);
//           const time = `${minutes}:${
//             remainingSeconds < 10 ? "0" : ""
//           }${remainingSeconds}`;
//           const lines = item._;
//           const arr = { time, lines };
//           return arr;
//         });
//         subtitle = parsed_subtitles;
//         console.log("subtitle --->", subtitle);
//       }
//     });
//     await browser.close();
//     return subtitle;
//   } else {
//     console.log("No suitable subtitles found.");
//     await browser.close();
//     return "No suitable subtitles found.";
//   }
// };

export const getSummery = async (url) => {
  "use server";
  const transcript = await fetchTranscript(url);
  // const summary = await generateSummary(transcript);
  console.log("trascript", transcript);
  return transcript;
};
