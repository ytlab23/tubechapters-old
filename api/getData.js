import axios from "axios";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
import xml2js from "xml2js";
import OpenAI from "openai";

// List of user-agents
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (iPod touch; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.181 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 10; SM-A205U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.181 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 10; LM-Q720) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.181 Mobile Safari/537.36",
];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const get_data = async (url) => {
  "use server";

  try {
    // const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    const userAgent =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    console.log(userAgent);
    await delay(3000);
    const response = await fetch(url, {
      headers: {
        "User-Agent": userAgent,
      },
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
    // console.log("response ---->", data);
    return data;
  } catch (error) {
    console.error("get data error --->", error);
  }
};

export const generateSummary = async (subtitles) => {
  "use server";
  // Convert the subtitles to a string
  const openai = new OpenAI({
    apiKey: process.env.API_KEY,
  });
  console.log("subtitles in gpt---->", subtitles);
  try {
    let subtitlesString = subtitles
      .map((subtitle) => {
        const minutes = Math.floor(Number(subtitle.time) / 60);
        const remainingSeconds = Math.round(Number(subtitle.time) % 60);
        const time = `${minutes}:${
          remainingSeconds < 10 ? "0" : ""
        }${remainingSeconds}`;
        return `${time} ${subtitle.lines}`;
      })
      .join("\n");

    subtitlesString = subtitlesString.replace(/&#39;/g, "'");

    console.log("formmated subtitles in gpt---->", subtitles);

    const complexPrompt = `
  Given the following video transcript:

  ${subtitlesString}

  Your task is to convert it into YouTube-like chapters divided into timestamps. 
  The transcript includes timestamps formatted as minutes and seconds (e.g., 1:23) indicating the start of each section. 
  Your output should consist of a list of timestamps along with a brief description of the content covered in each section. 
  Ensure that the timestamps accurately reflect the content discussed in the transcript and that the descriptions are concise yet informative. 
  Your goal is to facilitate easier navigation and reference within the video for viewers by breaking down the content into manageable chapters.
  `;

    const simplePrompt = `
  Given the following video transcript:

${subtitlesString}

Your task is to convert it into YouTube-like chapters divided into timestamps. 
The transcript includes timestamps formatted as seconds (e.g., 960.959) indicating 
the start of each section. Ensure that the timestamps 
accurately reflect the content discussed in the transcript. 
Your goal is to facilitate easier navigation and reference within the video for 
viewers by breaking down the content into manageable chapters with heading and 
timestamp(in minutes) only.

After creating the chapters, provide a short summarized description of the video based on the transcript in a new line.
`;

    // Send the subtitles to OpenAIs
    const result = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: simplePrompt,
        },
      ],
      max_tokens: 500,
      model: "gpt-4-turbo",
    });

    let gptResponse = result.choices[0].message.content;

    let startOfHeading = gptResponse.indexOf("0:00");

    if (startOfHeading) {
      gptResponse = gptResponse.slice(startOfHeading).split("\n");
    } else {
      gptResponse = gptResponse.split("\n");
    }

    console.log("gptResponse-->", gptResponse);

    return gptResponse;
  } catch (error) {
    console.log("not subtitles was found");
  }
};

export const fetchTranscript = async (url) => {
  "use server";
  try {
    const html = await get_data(url);
    const dom = new JSDOM(html);
    // console.log("doooom--->", dom);
    const scripts = dom.window.document.querySelectorAll("script");
    // console.log("scripts--->", scripts);
    let captions = [];

    for (let script of scripts) {
      if (script.innerHTML.includes("captionTracks")) {
        const start = script.innerHTML.indexOf("captionTracks");
        const end = script.innerHTML.indexOf("]", start);
        console.log("srat--->", start);
        console.log("end--->", end);

        const jsonString = script.innerHTML
          .slice(start, end + 1)
          .replace('captionTracks":', "");
        console.log("script of arrays--->", script.innerHTML);
        captions = JSON.parse(jsonString);
        console.log("jsonString--->", captions);
        break;
      }
    }

    if (captions.length > 0) {
      const selected_caption = captions[0];
      console.log("base url", selected_caption.baseUrl);
      const subtitles_data = await get_data(selected_caption.baseUrl);

      // console.log("subtitles_data--->", subtitles_data);
      let subtitle = "";
      xml2js.parseString(subtitles_data, async (err, result) => {
        if (err) {
          // console.log("parse error --->", err);
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
      console.log(
        "This page appears when Google automatically detects requests coming from your computer network which appear to be in violation of the"
      );
      return "Blocked by google";
    }
  } catch (error) {
    console.error("no caption error --->", error);
    return "caption parse error";
  }
};

export const getSummery = async (url) => {
  "use server";
  const transcript = await fetchTranscript(url);
  const summary = await generateSummary(transcript);
  // console.log("trascript", transcript);
  return summary;
};
