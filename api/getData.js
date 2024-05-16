import axios from "axios";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
import xml2js from "xml2js";
import OpenAI from "openai";

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

//url fetcher
export const get_data = async (url) => {
  "use server";
  try {
    // dynamic userAgent
    const randomUserAgent =
      userAgents[Math.floor(Math.random() * userAgents.length)];

    // manual userAgent
    // const userAgent =
    //   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    // console.log(userAgent);

    // making a delay before a request
    await delay(3000);
    const response = await fetch(url, {
      headers: {
        "User-Agent": randomUserAgent,
      },
      proxy: {
        host: process.env.PACKET_IP,
        port: process.env.PACKET_PORT,
        auth: {
          username: process.env.PACKET_USERNAME,
          password: process.env.PACKET_PASSWORD,
        },
      },
    });
    const data = await response.text();
    console.log("get data response ---->", data);
    return data;
  } catch (error) {
    console.error("get data error --->", error);
    throw new Error(
      `${error.message}: \n Please provide valid url https://www.youtube.com/....`
    );
  }
};

// gpt summery generater
export const generateSummary = async (subtitles, chapterType) => {
  "use server";
  // Convert the subtitles to a string
  const openai = new OpenAI({
    apiKey: process.env.API_KEY,
  });
  // console.log("subtitles in gpt---->", subtitles);

  try {
    let subtitlesString = subtitles
      .map((subtitle) => {
        return `${subtitle?.time} ${subtitle?.lines}`;
      })
      .join("\n");

    subtitlesString = subtitlesString.replace(/&#39;/g, "'");

    console.log("formmated subtitles in gpt---->", subtitlesString);

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
The transcript includes timestamps indicating 
the start of each section. Ensure that the timestamps 
accurately reflect the content discussed in the transcript. 
Your goal is to facilitate easier navigation and reference within the video for 
viewers by breaking down the content into manageable chapters with heading and 
timestamp(in minutes) only.

After creating the chapters, provide a short summarized description of the video based on the transcript in a new line.
`;

    const prompt = chapterType === "simple" ? simplePrompt : complexPrompt;
    // const maxTockens = chapterType === "simple" ? 400 : 600;

    // Send the subtitles to OpenAIs
    const result = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      max_tokens: 600,
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
    throw new Error(`${error.message}`);
  }
};

// transcript fetcher from youtube
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
        // console.log("script of arrays--->", script.innerHTML);
        captions = JSON.parse(jsonString);
        // console.log("jsonString--->", captions);
        break;
      }
    }

    if (captions.length > 0) {
      const selected_caption = captions[0];
      // console.log("base url", selected_caption.baseUrl);

      const subtitles_data = await get_data(selected_caption.baseUrl);

      let subtitle = "";
      xml2js.parseString(subtitles_data, async (err, result) => {
        if (err) {
          console.log("xml2js parse error --->", err);
          return "Error parsing XML.";
        } else {
          const parsed_subtitles = result.transcript.text.map((item) => {
            const minutes = Math.floor(Number(item.$.start) / 60);
            const remainingSeconds = Math.round(Number(item.$.start) % 60);
            const time = `${minutes}:${
              remainingSeconds < 10 ? "0" : ""
            }${remainingSeconds}`;
            const lines = item._;

            return { time, lines };
          });

          subtitle = parsed_subtitles;
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

// summery geter
export const getSummery = async (url, chapterType) => {
  "use server";
  try {
    const transcript = await fetchTranscript(url);
    const summary = await generateSummary(transcript, chapterType);
    return summary;
  } catch (error) {
    console.log("getSummery error -->", error.message);
    return error.message;
  }
};
