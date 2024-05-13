import axios from "axios";
import * as parse5 from "parse5";
import xml2js from "xml2js";
// import jsdom from "jsdom";
// const { JSDOM } = jsdom;

export const get_data = async (url) => {
  try {
    const response = await axios.get(url);
    const data = await response.data;

    return data;
  } catch (err) {
    console.log(err);
  }
};

export const convertToMinutes = (seconds) => {
  const minutes = Math.floor(Number(seconds) / 60);
  const remainingSeconds = Math.round(Number(seconds) % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export const generateSummary = async (subtitles) => {
  // Convert the subtitles to a string
  let subtitlesString = subtitles
    .map((subtitle) => `${subtitle.time} ${subtitle.lines}`)
    .join("\n");

  subtitlesString = subtitlesString.replace(/&#39;/g, "'");

  console.log(subtitlesString.length, "length");

  //   const complexPrompt = `
  //   Given the following video transcript:

  //   ${subtitlesString}

  //   Your task is to convert it into YouTube-like chapters divided into timestamps. The transcript includes timestamps formatted as minutes and seconds (e.g., 1:23) indicating the start of each section. Your output should consist of a list of timestamps along with a brief description of the content covered in each section. Ensure that the timestamps accurately reflect the content discussed in the transcript and that the descriptions are concise yet informative. Your goal is to facilitate easier navigation and reference within the video for viewers by breaking down the content into manageable chapters.
  //   `;

  //   const simplePrompt = `
  // Given the following video transcript:

  // ${subtitlesString}

  // Your task is to convert it into YouTube-like chapters divided into timestamps. The transcript includes timestamps formatted as seconds (e.g., 960.959) indicating the start of each section. Ensure that the timestamps accurately reflect the content discussed in the transcript. Your goal is to facilitate easier navigation and reference within the video for viewers by breaking down the content into manageable chapters with heading and timestamp(in minutes) only.
  // `;

  // Send the subtitles to OpenAIs
  // const gptResponse = await openai.chat.completions.create({
  //   messages: [
  //     {
  //       role: "system",
  //       content: simplePrompt,
  //       // content: `Can you create a bullet point list of summarized chapters with timestamps (in minutes) and titles from this transcript? The format should be like "00:00 Introduction".\n Here’s the transcript: ${subtitlesString}`,
  //     },
  //   ],
  //   max_tokens: 400,
  //   model: "gpt-4-turbo",
  // });

  // console.log(gptResponse.choices[0].message.content);

  // return gptResponse.choices[0].message.content.replace(/\+/g, "");

  return subtitlesString;
};

export const fetchTranscript = async (url) => {
  try {
    const html = await get_data(url);
    const document = parse5.parse(html);
    const scripts = parse5.queryAll(
      document,
      (node) => node.tagName === "script"
    );
    // const dom = new JSDOM(html);
    // const scripts = dom.window.document.querySelectorAll("script");

    console.log("scripts------->");
    let captions = [];
    console.log("scripts------->", captions);

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

      const subtitles_data = await get_data(selected_caption.baseUrl);
      let subtitles = "";
      xml2js.parseString(subtitles_data, async (err, result) => {
        if (err) {
          return "Error parsing XML.";
        } else {
          const parsed_subtitles = result.transcript.text.map((item) => {
            const time = convertToMinutes(item.$.start);
            const lines = item._;
            return { time, lines };
          });
          subtitles = parsed_subtitles;
        }
      });

      return subtitles;
    } else {
      return "something went wrong";
    }
  } catch (error) {
    console.log("error----->", error);
    return "wrong url";
  }
};

export const getSummery = async (url) => {
  const transcript = await fetchTranscript(url);
  console.log("captions====>", transcript);
  let summery = await generateSummary(transcript);
  //   summery = summery.slice(0, 400);
  console.log("summery=====>", summery);
  return summery;
};
