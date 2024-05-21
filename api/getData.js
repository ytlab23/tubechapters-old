import jsdom from "jsdom";
const { JSDOM } = jsdom;
import xml2js from "xml2js";
import OpenAI from "openai";
// import puppeteer from "puppeteer";
import { HttpsProxyAgent } from "https-proxy-agent";
import axios from "axios";

// import { GoogleGenerativeAI } from "@google/generative-ai"

// list of userAgents
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.3",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:125.0) Gecko/20100101 Firefox/125.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.3",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 OPR/109.0.0.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.3",
  "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.4",
];

// request time delyer function
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// get data
export const get_data_axios = async (url) => {
  "use server";
  try {
    // dynamic userAgent
    const randomUserAgent =
      userAgents[Math.floor(Math.random() * userAgents.length)];

    // making a delay before a request
    await delay(3000);

    const agent = new HttpsProxyAgent(
      `http://${process.env.PACKET_USERNAME}:${process.env.PACKET_PASSWORD}@${process.env.PACKET_IP}:${process.env.PACKET_PORT}`
    );

    const response = await axios.get(url, {
      httpsAgent: agent,
    });

    const data = response.data;
    // console.log("get data response ---->", data);
    return data;
  } catch (error) {
    console.error("get data error --->", error);
    throw new Error(`${error.message}:`);
  }
};

export const gptResponseHandler = async (subSubtitle, chapterType, sumLang) => {
  const openai = new OpenAI({
    apiKey: process.env.API_KEY,
  });

  const promptWithLangSimple = `
Given the following 12-minute segment of a video transcript:

${subSubtitle}

Due to character limitations, this segment is part of a longer video transcript that has been divided into 12-minute segments. 

Your task is to convert this segment into a YouTube-like chapter with a timestamp in ${sumLang}. This segment includes timestamps indicating the start of each section. Ensure that the timestamps accurately reflect the content discussed in this segment, are within this 12-minute duration.

Your goal is to facilitate easier navigation and reference within the video for viewers by breaking down this segment into a manageable chapter with a heading and timestamp (in minutes) only.

After creating the chapter, provide a short summarized description of this 12-minute segment based on the transcript in a new line. This summary should also be in ${sumLang}.

Please note that this is a segment of a longer video, and your response should reflect only the content of this segment.

Please note that to Return the response exactly in the following format: 
{
  chapters: ["chapter1", "chapter2", ...],
  segmentSummary: "summary"
}

`;

  const prompt = promptWithLangSimple;
  // const maxTockens = chapterType === "simple" ? 400 : 600;

  console.log("prompt length --->", prompt.length);

  // Send the subtitles to OpenAIs
  const result = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: prompt,
      },
    ],
    max_tokens: 400,
    model: "gpt-4-turbo",
  });

  let gptResponse = result.choices[0].message.content;

  // let startOfHeading = gptResponse.indexOf("0:00");

  // if (startOfHeading) {
  //   gptResponse = gptResponse.slice(startOfHeading).split("\n");
  // } else {
  //   gptResponse = gptResponse.split("\n");
  // }
  return gptResponse;
};

// generate chapters from gpt
export const generateSummary = async (subtitles, chapterType, sumLang) => {
  "use server";

  try {
    let gptResponses = [];
    for (let arr of subtitles) {
      let subString = arr
        .map((subtitle) => {
          return `${subtitle?.time} ${subtitle?.lines}`;
        })
        .join("\n");
      subString = subString.replace(/&#39;/g, "'");

      let gptResponse = await gptResponseHandler(
        subString,
        chapterType,
        sumLang
      );
      gptResponses.push(JSON.parse(gptResponse));
      // console.log(subString.length);
      // gptResponses.push(subString);
    }

    console.log(gptResponses);

    return gptResponses;
    // return gptResponse;
  } catch (error) {
    console.log("not subtitles was found");
    throw new Error(`${error.message}`);
  }
};

// fetch transcript from youtube
export const fetchTranscript = async (url) => {
  "use server";
  try {
    const isValidYouTubeUrl = (url) => {
      const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
      return pattern.test(url);
    };
    const urlValidator = isValidYouTubeUrl(url);
    // console.log("urlValidator", urlValidator);

    if (!urlValidator) {
      throw new Error(
        `Invalid Url.\n Please provide valid url https://www.youtube.com/....`
      );
    }

    const html = await get_data_axios(url);
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
        // console.log("script of arrays--->", script.innerHTML);
        captions = JSON.parse(jsonString);
        // console.log("jsonString--->", captions);
        break;
      }
    }

    if (captions.length > 0) {
      const selected_caption = captions[0];
      console.log("base url", selected_caption);

      const subtitles_data = await get_data_axios(selected_caption.baseUrl);

      let subtitle = [];
      xml2js.parseString(subtitles_data, async (err, result) => {
        if (err) {
          console.log("xml2js parse error --->", err);
          return "Error parsing XML.";
        } else {
          let maxmin = 12;
          let arr = [];
          let cutedArr = [];
          result.transcript.text.forEach((item) => {
            // console.log("transcript response", item);
            const totalSeconds = Number(item.$.start);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
            const remainingSeconds = Math.round(totalSeconds % 60);

            const time = `${hours < 10 ? "0" : ""}${hours}:${
              minutes < 10 ? "0" : ""
            }${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
            const lines = item._;

            if (minutes < maxmin) {
              cutedArr.push({ time, lines });
            } else {
              arr.push(cutedArr);
              cutedArr = [];
              maxmin += 12;
            }

            return { time, lines };
          });
          // console.log(arr);
          arr.push(cutedArr);
          subtitle = arr;
        }
      });

      return subtitle;
    } else {
      console.log("No captions avaliable for this page");
      throw new Error("No captions Found");
    }
  } catch (error) {
    console.error("Invalid link or error while fetching", error.message);
    throw new Error(`${error.message}`);
    // return "caption parse error";
  }
};

//get summery
export const getSummery = async (url, chapterType, sumLang) => {
  "use server";
  try {
    const transcript = await fetchTranscript(url);
    const summary = await generateSummary(transcript, chapterType, sumLang);
    // console.log(summary, summary.length);
    // return summary;
  } catch (error) {
    console.log("getSummery error -->", error.message);
    return error.message;
  }
};
