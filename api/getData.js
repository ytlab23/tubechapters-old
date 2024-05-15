import axios from "axios";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
import xml2js from "xml2js";
import OpenAI from "openai";

import puppeteer from "puppeteer";

// List of user-agents

export const get_data = async (url) => {
  "use server";
  try {
    const response = await fetch(url, {
      proxy: {
        host: process.env.PACKET_IP,
        port: process.env.PACKET_PORT,
        auth: {
          username: process.env.PACKET_USERNAME, // replace with your Packet Stream username
          password: process.env.PACKET_PASSWORD, // replace with your Packet Stream password
        },
      },
    });
    const data = await response.text();
    console.log("response ---->", data);
    return data;
  } catch (error) {
    console.error("get data error --->", error);
  }
};

export const fetchTranscript = async (url) => {
  "use server";
  try {
    const html = await get_data(url);
    const dom = new JSDOM(html);
    const scripts = dom.window.document.querySelectorAll("script");
    console.log("scripts--->", scripts);
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

      console.log("subtitles_data--->", subtitles_data);
      let subtitle = "";
      xml2js.parseString(subtitles_data, async (err, result) => {
        if (err) {
          console.log("parse error --->", err);
          return "Error parsing XML.";
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
      return "No suitable subtitles found.";
    }
  } catch (error) {
    console.error("no caption error --->", error);
  }
};

export const getSummery = async (url) => {
  "use server";
  const transcript = await fetchTranscript(url);
  // const summary = await generateSummary(transcript);
  console.log("trascript", transcript);
  return transcript;
};
