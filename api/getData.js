import axios from "axios";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
import xml2js from "xml2js";
import OpenAI from "openai";

import { YoutubeTranscript } from "youtube-transcript";

export const get_data = async (url) => {
  "use server";
  try {
    const response = await axios.get(url);
    const data = await response.data;
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const generateSummary = async (subtitles) => {
  "use server";
  // Convert the subtitles to a string
  const openai = new OpenAI({
    apiKey: process.env.API_KEY,
  });
  try {
    let subtitlesString = subtitles
      .map((subtitle) => {
        const minutes = Math.floor(Number(subtitle.offset) / 60);
        const remainingSeconds = Math.round(Number(subtitle.offset) % 60);
        const time = `${minutes}:${
          remainingSeconds < 10 ? "0" : ""
        }${remainingSeconds}`;
        return `${time} ${subtitle.text}`;
      })
      .join("\n");

    subtitlesString = subtitlesString.replace(/&#39;/g, "'");

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

    console.log(gptResponse);

    return gptResponse;
  } catch (error) {
    console.log("not subtitles was found");
  }
};

// export const fetchTranscript = async (url) => {
//   "use server";
//   const html = await get_data(url);
//   const dom = new JSDOM(html);
//   const scripts = dom.window.document.querySelectorAll("script");
//   let captions = [];

//   for (let script of scripts) {
//     if (script.innerHTML.includes("captionTracks")) {
//       console.log("scripts", script);
//       const start = script.innerHTML.indexOf("captionTracks");

//       const end = script.innerHTML.indexOf("]", start);
//       const jsonString = script.innerHTML
//         .slice(start, end + 1)
//         .replace('captionTracks":', "");
//       captions = JSON.parse(jsonString);
//       break;
//     }
//   }

//   if (captions.length > 0) {
//     const selected_caption = captions[0];
//     const subtitles_data = await get_data(selected_caption.baseUrl);
//     let subtitle = "";
//     xml2js.parseString(subtitles_data, async (err, result) => {
//       if (err) {
//         res.send("Error parsing XML.");
//       } else {
//         // console.log(result.transcript.text);
//         const parsed_subtitles = result.transcript.text.map((item) => {
//           const minutes = Math.floor(Number(item.$.start) / 60);
//           const remainingSeconds = Math.round(Number(item.$.start) % 60);
//           const time = `${minutes}:${
//             remainingSeconds < 10 ? "0" : ""
//           }${remainingSeconds}`;
//           // const time =  convertToMinutes(item.$.start);
//           const lines = item._;
//           const arr = { time, lines };
//           return arr;
//         });
//         subtitle = parsed_subtitles;
//       }
//     });
//     console.log(subtitle);
//     return subtitle;
//   } else {
//     console.log("No suitable subtitles found.");
//     return "No suitable subtitles found.";
//   }
// };

export const getSummery = async (url) => {
  "use server";
  // const transcript = await fetchTranscript(url);
  const transcript = await YoutubeTranscript.fetchTranscript(url);
  console.log("transcipt", transcript);
  const summary = await generateSummary(transcript);

  return summary;
};
