import jsdom from "jsdom";
const { JSDOM } = jsdom;
import xml2js from "xml2js";
import { HttpsProxyAgent } from "https-proxy-agent";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY_1 = process.env.GEMINI_API_KEY_1;
const API_KEY_2 = process.env.GEMINI_API_KEY_2;
const API_KEY_3 = process.env.GEMINI_API_KEY_3;
const API_KEY_4 = process.env.GEMINI_API_KEY_4;
const API_KEY_5 = process.env.GEMINI_API_KEY_5;
const API_KEY_6 = process.env.GEMINI_API_KEY_6;

// request time delyer function
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// get data
export const get_data_axios = async (url) => {
  "use server";
  try {
    // making a delay before a request
    await delay(3000);
    const agent = new HttpsProxyAgent(
      `http://${process.env.PACKET_USERNAME}:${process.env.PACKET_PASSWORD}@${process.env.PACKET_IP}:${process.env.PACKET_PORT}`
    );
    const response = await axios.get(url, {
      httpsAgent: agent,
    });

    const data = response.data;

    return data;
  } catch (error) {
    console.error("get data error --->", error);
    throw new Error(`Invalid link or error while fetching please try again`);
  }
};

export const geminiResponseHandler = async (
  subSubtitle,
  generateType,
  chapterType,
  sumLang
) => {
  const API_KEYS = [
    API_KEY_1,
    API_KEY_2,
    API_KEY_3,
    API_KEY_4,
    API_KEY_5,
    API_KEY_6,
  ];
  const API_KEY = API_KEYS[Math.floor(Math.random() * API_KEYS.length)];
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const promptWithLangSimple = `
  Task: Convert Video Transcript Segment into YouTube-Like Chapters (Language: ${sumLang})

  Given the following segment of a video transcript:

${subSubtitle}

Due to character limitations, this segment is part of a longer video transcript that has been divided into segments.

Your task is to convert this segment into a YouTube-like chapter format with timestamps and title only. Follow these guidelines:

Timestamps: Include timestamps indicating the start of each section.
Chapter Titles: Create chapter titles for each section.

Navigation and Reference: The goal is to facilitate easier navigation and reference within the video for viewers.

Chapter Interval: Chapter intervals should not be detailed and at least 5-minutes apart.

Summary: After creating the chapters, provide a very short summarized description of this segment based on the transcript.

Please note:
Chapter intervals should not be detailed and at least 5-minutes apart.

The chapter format should look like this: (timestamp) - Chapter Title and in ${sumLang}.

Return the response in the following format:
{
  "chapters": ["chapter1", "chapter2", ...],
  "segmentSummary": "summary"
}
`;

  const summeryPrompt = `Given the following combined segmented transcript summaries:
  ${subSubtitle}

  Generate a concise summary of the entire content of the video based on the combined segmented transcript summaries i gave you. 
  Make the summary in ${sumLang}.
  `;

  const prompt =
    generateType === "summary" ? summeryPrompt : promptWithLangSimple;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text;
};

// generate chapters from gpt
export const generateSummary = async (subtitles, chapterType, sumLang) => {
  "use server";
  // subtitles.map((sub) => console.log(sub.length));
  try {
    let gptResponses = { chapters: [], summery: "" };
    for (let sub of subtitles) {
      // console.log("subString", subString, subString.length);
      let gptResponse = await geminiResponseHandler(
        sub,
        "chapter",
        chapterType,
        sumLang
      );
      const first = gptResponse.indexOf("{");
      const last = gptResponse.indexOf("}");
      gptResponse = gptResponse.slice(first, last + 1);
      gptResponse = JSON.parse(gptResponse);
      gptResponses.chapters.push(...gptResponse.chapters);
      gptResponses.summery += gptResponse.segmentSummary;
    }

    const videoSummary = await geminiResponseHandler(
      gptResponses.summery,
      "summary",
      chapterType,
      sumLang
    );
    if (videoSummary) {
      gptResponses.summery = videoSummary;
    }
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
        captions = JSON.parse(jsonString);
        break;
      }
    }

    if (captions.length > 0) {
      const selected_caption = captions[0];

      const subtitles_data = await get_data_axios(selected_caption.baseUrl);

      let subtitle = [];
      xml2js.parseString(subtitles_data, async (err, result) => {
        if (err) {
          console.log("xml2js parse error --->", err);
          return "Error parsing XML.";
        } else {
          let maxSecond = 1000;
          let arr = [];
          let cutedArr = "";
          result.transcript.text.forEach((item) => {
            const totalSeconds = Math.floor(Number(item.$.start));
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
            const remainingSeconds = Math.round(totalSeconds % 60);

            const time = `${hours < 10 ? "0" : ""}${hours}:${
              minutes < 10 ? "0" : ""
            }${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
            const lines = item._;
            // console.log(maxSecond);

            // console.log({ time, lines });

            if (totalSeconds < maxSecond) {
              cutedArr += `${time} ${lines}. `;
              cutedArr = cutedArr.replace(/&#39;/g, "'");
            } else {
              arr.push(cutedArr);
              cutedArr = "";
              maxSecond += 1000;
            }
          });
          if (cutedArr.length > 12000) {
            arr.push(cutedArr);
          } else {
            arr[arr.length - 1] = arr[arr.length - 1] + cutedArr;
          }

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
    return summary;
  } catch (error) {
    console.log("getSummery error -->", error.message);
    return error.message;
  }
};
