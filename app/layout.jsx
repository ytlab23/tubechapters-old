import { Jacques_Francois, Raleway } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import AboutBoxContainer from '@/components/AboutBoxContainer';
import HowItWorks from '@/components/HowItWorks';
import Link from 'next/link';
import { BiUpArrowAlt } from 'react-icons/bi';
import DropDowns from '@/components/DropDowns';

const raleway = Raleway({
  weight: ['400'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title:
    'TubeChapters - Create And Add Chapters To Your YouTube Videos - Automated Chapters',
  description:
    'TubeChapters analyzes your YouTube video, and then creates custom chapters and timestamps. Automated YouTube chapters, powered by A.I. Create and add chapters to your YouTube video today!',
};

export default function RootLayout({ children }) {
  const solutionItems = [
    {
      title: 'Easy Chapter Creation:',
      content:
        'TubeChapters uses AI to create timestamps and chapters instantly,which saves you hours of transcription work.',
    },
    {
      title: 'All-in-One Solution:',
      content:
        'TubeChapters has more than just chapters for YouTube videos. It also has a set of tools for making attractive titles, video descriptions, and hashtags.',
    },
    {
      title: 'Easy to use and simple: ',
      content:
        "TubeChapters is so simple to use that even people who don't have much knowledge about technology can use it easily.",
    },
  ];
  const howItWorksItems = [
    {
      title: 'Step 1: Paste your video URL.',
      content:
        "Like magic, TubeChapters can work with any type or size of video. You're all set to go once you copy and paste the URL of your video.",
    },
    {
      title: 'Step 2: Choose settings',
      content:
        'Want chapters in a different language besides English? TubeChapters supports many different languages. Just pick the language that your video needs and let the AI do its thing.',
      othercontent:
        'You can also pick between simple chapters, and complex chapters. Simple chapters will include just a title which describes the relevant video section, while complex captions dive deeper into each part of the video, by providing a brief summary.',
    },
    {
      title: 'Step 3: Use AI to write chapters',
      content: `When you press the "Generate" button, our advanced AI technology takes over. It takes the spoken words in your video, turns them into text, and then automatically divides your content into chapters, along with relevant timestamps.`,
    },
    {
      title: 'Step 4: Share Your Work!',
      content: `Your video is ready to go in seconds! Copy your complete work with captions and clear chapters for a professional and engaging video experience.
`,
      othercontent:
        'Then, paste them wherever you like: video description, YouTube comments, or social media.',
    },
  ];
  const dropDownsData = [
    {
      title: 'How Chapters Will Improve Viewing Experience',
      content:
        "Make your video better for your viewers with TubeChapters! It's easy for viewers to find the chapters that they want to watch because each chapter has a clear title and timestamp. They don't have to look through the entire video to find what they want to watch. This keeps people interested and makes them watch longer, which makes them pleased and makes your content more fun to watch. Also, captions help viewers understand what they are watching if they might miss anything because of background noise or language barriers.",
    },
    {
      title: 'They Will Also Increase SEO',
      content:
        "With TubeChapters, you can make your YouTube videos more SEO-friendly. Search engines use the keywords and context that we create in the captions to figure out what your video is about. This makes your video rank higher in search results for related keywords, which brings in new viewers organically. This attracts viewers who are actively searching for topics covered in your video. The higher your ranking, the more organic growth you'll receive, potentially leading to an increase in views and subscriptions. TubeChapters makes it easy for the right people to find your videos. To further improve your YouTube rankings, consider using SEO tools such as <a href='https://tubepilot.com' target='_blank' rel='noopener noreferrer'>TubePilot (free).</a>  ",
        isHTML: true
    },
    {
      title: 'Make Your Video Easily Accessible',
      content:
        "With <a href='https://tubechapters.com/' target='_blank' rel='noopener noreferrer'>TubeChapters</a>, you can break down barriers and make your content accessible to everyone. TubeChapters' captions and timestamps aren't just for your convenience; they're also very important for accessibility. Captions are very important for people who are deaf or hard of hearing to understand what's going on in the video. They can read the caption while watching and make sure they don't miss any funny parts or important information. Timestamps make things even easier. Imagine someone quickly looking through a long description of a video to find a certain point they need to go over again. With timestamps, all they have to do is click on the chapter title to go straight to that part. This gives viewers the ability to fully interact with your content, making your video more accessible for everyone. For increased accessibility, consider also <a href='https://support.google.com/youtube/answer/4792576?hl=en' target='_blank' rel='noopener noreferrer'>translating your content</a> into multiple languages and <a href='https://support.google.com/youtube/answer/2734796?hl=en' target='_blank' rel='noopener noreferrer'>adding subtitles</a>.",
        isHTML: true
    },
    {
      title: 'Increased Visibility and Brand Recognition',
      content:
        'With TubeChapters, you can take your YouTube channel to the next level and make your brand popular. Captions and timestamps are also useful also to make your video look more professional. People who watch a video with clear chapter names and an easy-to-use interface, gives people a feeling of trustworthiness and professionalism, which is good for your brand. Additionally, timestamps make it easy to cut your video into short clips that are great for sharing on social media sites. These short videos are like mini-advertisements that show off your content and attract new viewers to watch your channel. You can reach more people outside of YouTube by sharing interesting clips with timestamps on a regular basis. This will help spread the word about your brand and make it known in more online audiences.',
    },
  ];
  const howToAddChapters = [
    {
      title: 'In the video description:',
      content:
        'The person who made the video can add a list of timestamps and titles that go with them in the video description. People can go straight to a specific point in the video when they click on a timestamp.',
    },
    {
      title: 'Video chapters:',
      content: `Chapters go one step further than timestamps by adding clickable sections to the video progress bar. It's even easier to find your way around the video because each part has a title and a thumbnail preview. So how to add chapters? Let’s find out below.`,
    },
  ];
  const howToAddChaptersManually = [
    {
      title: 'Go to YouTube Studio and sign in:',
      content: 'Sign in to your YouTube account at studio.youtube.com.'
    },
    {
      title: 'Pick out your video:',
      content: `Click "Content" on the left side of the screen and pick the video to which you want to add chapters.`,
    },
    {
      title: 'Go to the description section:',
      content: `In the video details page, scroll down to the "Description" section.
`,
    },
    {
      title: 'Add timestamps and titles:',
      content: ``,
      list: [
        'The first timestamp must start at 0:00.',
        'Each timestamp should be on a new line and follow this format: timestamp title (e.g., 2:35 Introduction).',
        'You need at least three timestamps in your video for chapters to work.',
        'Each chapter must be at least 10 seconds long.',
      ],
    },
    {
      title: 'Save changes:',
      content: `Click "Save" to make changes to the description of your video.
`,
    },
  ];
  const howManuallyTakesTime = [
    {
      title: 'Watching and Making Notes:',
      content:
        'You need to watch the whole video to find the important parts where you want to place the chapters.',
    },
    {
      title: 'Editing and Formatting:',
      content:
        'It takes time and care to type each timestamp and title accurately.',
    },
    {
      title: 'Potential for Errors:',
      content: `It's easy to make mistakes when entering times manually, which can lead to frustration for viewers if the timestamps are inaccurate.
`,
    },
    {
      title: 'Videos That Are Too Long:',
      content: `The process takes longer when the video is too long.
  `,
    },
  ];
  const whyTubeChapters = [
    {
      title: 'Save Time:',
      content: `TubeChapters' AI-powered engine analyzes your video, creates chapters and adds timestamps for you automatically in seconds, so you don't have to do it by hand.`,
    },
    {
      title: 'Get rid of transcription:',
      content: `You don't have to translate your whole video.TubeChapters does all the hard work by copying the audio and finding the most important parts to place the chapters.
`,
    },
    {
      title: 'Focus on Making Content:',
      content: `TubeChapters lets you do what you do best: making high-quality videos. It does this by automating the process of creating chapters and adding timestamps
`,
    },
    {
      title: 'Increase Viewers’ Interest:',
      content: `Chapters make your videos easier to navigate and more interesting to watch by letting people skip to the parts they're most interested in. This can make people stay on your video longer and help you keep their attention.
`,
    },
    {
      title: 'SEO Optimization:',
      content: `TubeChapters creates chapter titles that are search engine optimized by default. This makes it easier for people to find your videos through organic search results.
`,
    },
  ];
  const tubeChaptersGlobal = [
    {
      title: 'Support for multiple languages:',
      content: `English, Italian, Spanish, French, German, and Portuguese are just a few of the languages that TubeChapters supports. Our AI will do all the hard work; all you have to do is pick the language your video is in. It transcribes the audio and makes captions, so people who speak those languages can watch your video.`,
    },
    {
      title: 'Get more people to watch:',
      content: `When you give captions in more than one language, you let a lot more people watch your content. Imagine making a travel vlog that people in Italy could understand and use to plan their dream holiday, or a cooking tutorial that people in Spain could use to improve their cooking skills. TubeChapters lets you meet with more people and grow your channel around the world, even if they don't speak the same language.
`,
    },
    {
      title: 'Get people across borders:',
      content: `Captions in a viewer's own language make them more interested. People can fully understand what you're showing, which makes the experience more fun and engaging. This can bring more comments, likes, and general interaction with your videos, no matter where they are.
`,
    },
  ];
  const faqsDownsData = [
    {
      title: '1. What is TubeChapters and what does it do?',
      content: '<a href="https://tubepilot.com" target="_blank" rel="noopener noreferrer">TubeChapters is a tool that helps you create chapters and timestamps for your YouTube videos.</a> It uses AI to automate the process, saving you time and effort. Additionally, TubeChapters offers features to generate video descriptions, hashtags, and titles.',
      isHTML: true
    },
    {
      title: '2. Is TubeChapters easy to use?',
      content:
        "Absolutely! TubeChapters is designed with simplicity in mind. Even if you're not tech-savvy, you can easily create chapters and optimise your videos with a few clicks.",
    },
    {
      title: '3. Does TubeChapters offer a free plan?',
      content:
        'Yes, TubeChapters offers a free plan to get you started. This allows you to experience the core functionalities and see if it fits your needs. 99% of TubeChapters functionalities are available for free.',
    },
    {
      title:
        '4. How do chapters and timestamps improve the viewing experience?',
      content:
        'Chapters and timestamps make it easier for viewers to navigate your video. They can skip directly to the sections that interest them most, saving them time and keeping them engaged. Additionally, captions created by TubeChapters help viewers who are deaf or hard of hearing understand the video content.',
    },
    {
      title: '5. How does TubeChapters make videos more accessible?',
      content:
        'Captions and timestamps are crucial for accessibility. Viewers who are deaf or hard of hearing can rely on captions to understand the video. Timestamps allow viewers with visual impairments to easily revisit specific parts of the video.',
    },
    {
      title: '6. How can TubeChapters help me improve my video SEO?',
      content:
        'Captions provide search engines with valuable keywords and context about your video. This helps your video rank higher in search results for relevant searches, leading to organic discovery by new viewers.',
    },
    {
      title: '7. Does TubeChapters help with brand recognition?',
      content:
        'Yes! Captions and timestamps contribute to a professional video presentation, reflecting positively on your brand. Additionally, timestamps allow you to create bite-sized clips for social media, promoting your content and reaching a wider audience.',
    },
    {
      title: '8. How do I create chapters with TubeChapters?',
      content: `Simply paste the URL of your YouTube video into <a href="https://tubepilot.com" target="_blank" rel="noopener noreferrer">TubeChapters</a>. Choose the language and click "Generate." You can also select the complexity level for the captions. Then, our AI will automatically create timestamps for key points in your video. You can then customize these timestamps and add clear, descriptive chapter titles.`,
      isHTML: true
    },
    {
      title: '9. In what languages does TubeChapters work?',
      content:
        'TubeChapters supports a variety of languages, including English, Italian, Spanish, French, German, and Portuguese.',
    },
    {
      title: '10. What happens after I create chapters and timestamps?',
      content: `Once you're happy with your work, you can copy your chapters and captions. Feel free to use them on your video’s description, in the comment section, or when sharing your video on social media.`,
    },
  ];
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${raleway.className} md:px-16 px-2 bg-back`}>
        <Link
          href={'#home'}
          className="fixed bottom-8 right-16 btn bg-[#dc2626] w-[40px] h-[40px] flex justify-center items-center  text-back font-normal text-xl rounded-full"
        >
          <BiUpArrowAlt />
        </Link>
        <Nav />
        <div className="min-h-[80vh] flex flex-col justify-center items-center relative ">
          {children}
        </div>
        <div
          id="about"
          className="flex flex-col sm:p-8 p-4 mx-auto gap-y-4 max-w-[800px]"
        >
          <h2 className="text-2xl font-bold text-[#dc2626]">About us</h2>
          <p className="text-base text-primary">
            TubeChapters is the best tool for making your YouTube videos more
            engaging and optimized for audience retention, as well as YouTube
            SEO. We make it easy to add chapters and timestamps to your YouTube
            videos, allowing viewers to skip directly to the chapters that
            interest them the mos and provide a derailed timeline about the best
            parts of your videos.
          </p>
          <p className="text-base text-primary">
            This not only improves the viewing experience, but it can also help
            you make your YouTube videos more engaging, rank higher on YouTube,
            and increase the growth of your channel.
          </p>
          <h2 className="text-lg font-bold text-[#dc2626]">
            Your One-Stop Solution to Generate YouTube Captions and TimeStamps
          </h2>
          <AboutBoxContainer items={solutionItems} />
          <h2 className="text-xl mt-6 font-bold text-[#dc2626]">
            TubeChapters Creates Chapters with AI
          </h2>
          <p className="text-base text-primary">
          Stop doing all that boring work manually! <a href="https://tubechapters.com/">TubeChapters</a> uses AI and <a href="https://developers.google.com/youtube/v3">YouTube API</a> to generate YouTube chapters for you. Just add your YouTube video URL and our advanced technology will automatically create timestamps for important parts of your video. 
          </p>
          <p className="text-base text-primary">
          This helps you avoid the time-consuming task of transcription, so you can concentrate on producing high-quality content. After that, you can improve these timestamps and add detailed titles to make the video look more professional and make it easier for people to navigate easily in your video.
          </p>
          <HowItWorks />
          <AboutBoxContainer items={howItWorksItems} />
          <p className="text-base text-primary text-center m-4">
            And no need for a{' '}
            <span className="text-[#dc2626]">credit card!</span> <a href="https://tubechapters.com/">Use TubeChapters for free</a> and see how powerful it is to make chapters quickly and easily.
          </p>
          <Link
            href={'#home'}
            className="btn bg-[#dc2626] px-4 py-3 text-back font-normal text-base rounded-xl max-w-[250px] self-center min-w-[140px]"
          >
            Generate YouTube Chapters
          </Link>
          <DropDowns dropDownsData={dropDownsData} />
          <h2 className="text-xl mt-6 font-bold text-[#dc2626] max-w-[620px]">
            Add Chapters and Time Stamps and Take Your YouTube Videos to the
            Next Level
          </h2>
          <p className="text-base text-primary">
            <a href="https://tubechapters.com/">Adding chapters to your YouTube videos</a> is a simple yet powerful way
            to improve the viewing experience, improve your SEO, and grow your
            YouTube channel. With tools like TubeChapters, you can{' '}
            <Link href="#home" className="text-[#dc2626]">
              create chapters
            </Link>{' '}
            effortlessly and start receiving the benefits in no time.
          </p>
          <p className="text-base text-primary">
            For those who don’t know, on YouTube, <a href="https://support.google.com/youtube/answer/9884579?hl=en">a timestamp</a> is a link that can
            be clicked on to go to a certain point in a video. {`It's`}{' '}
            basically a time marker that points to a certain part of the video.
            Timestamps are often used in tutorials, long videos, and other
            videos where people might want to quickly jump to certain parts.
          </p>
          <h2 className="text-xl mt-6 font-bold text-[#dc2626] max-w-[620px]">
            Time stamps can be used in two main ways on YouTube:
          </h2>
          <ul className="ml-5 flex flex-col gap-y-4 list-disc">
            {howToAddChapters.map((item) => (
              <div key={item.title}>
                <li>
                  <span className="text-base font-bold text-left text-primary">
                    {item.title}
                  </span>
                  <p className="text-base text-left text-primary/90">
                    {item.content}
                  </p>
                </li>
              </div>
            ))}
          </ul>
          <Link
            href={'#home'}
            className="btn bg-[#dc2626] px-4 py-3 text-back font-normal text-base rounded-xl max-w-[250px] self-center min-w-[140px]"
          >
            Generate YouTube Chapters
          </Link>
          <h2 className="text-xl mt-6 font-bold text-[#dc2626] max-w-[620px]">
            How to Add Chapters to a YouTube Video by Manually
          </h2>
          <ul className="ml-5 flex flex-col gap-y-4 list-disc">
            {howToAddChaptersManually.map((item) => (
              <div key={item.title}>
                <li>
                  <span className="text-base font-bold text-left text-primary">
                    {item.title}
                  </span>
                  <p className="text-base text-left text-primary/90">
                    {item.content}
                  </p>
                  {item.list && (
                    <ul className="my-2 ml-5 flex flex-col gap-y-3 list-disc">
                      {item.list?.map((item) => (
                        <li key={item}>
                          <p className="text-base text-left text-primary/90">
                            {item}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              </div>
            ))}
          </ul>
          <p className="text-base mx-4 text-primary">
            When you save your video, it will have chapters that viewers can
            click on to go to different parts. For longer videos in particular,
            this can make the watching experience a lot better. So, basically,
            chapters are added automatically by YouTube, as long as you provide
            the correct format in the video description.
          </p>
          <h2 className="text-xl mt-6 font-bold text-[#dc2626] max-w-[620px]">
            Adding timestamps manually takes a lot of time.
          </h2>
          <p className="text-base text-primary">
            Manual Timestamping and creating chapters give you full control but
            it is very time consuming. There are many reasons to avoid adding
            Timestamp to YouTube video by your self.
          </p>
          <ul className="ml-5 flex flex-col gap-y-4 list-disc">
            {howManuallyTakesTime.map((item) => (
              <div key={item.title}>
                <li>
                  <span className="text-base font-bold text-left text-primary">
                    {item.title}
                  </span>
                  <p className="text-base text-left text-primary/90">
                    {item.content}
                  </p>
                </li>
              </div>
            ))}
          </ul>
          <p className="text-base text-primary">
            Even though it takes more effort, manually timestamping gives you
            complete control over where your chapters go and what they are
            about.
          </p>
          <p className="text-base text-primary">
            If you have a short video or prefer a hands-on approach, it can be a
            good option. For longer videos, though, or if you want a quick and
            easy answer, you should use an{' '}
            <Link href="https://tubechapters.com/" className="text-[#dc2626]">
              automatic tool like TubeChapters. And for free! .
            </Link>{' '}
          </p>

          <Link
            href={'#home'}
            className="text-xl mt-6 font-bold text-[#dc2626] max-w-[620px]"
          >
            TubeChapters: Your AI-Powered Chapter Creator
          </Link>
          <p className="text-base text-primary">
            <Link href="#home" className="text-[#dc2626]">
              TubeChapters
            </Link>{' '}
            is a one stop solution that uses artificial intelligence to create
            chapters for your YouTube videos.
          </p>
          <p className="text-base text-primary">
            TubeChapters allows you to easily add chapters to YouTube videos.
            Simply paste your video URL, choose a language, the complexity
            level, and let our AI do the rest. You may also adjust the chapter
            titles and timestamps to ensure that they exactly match your
            content. However, the tool is quite accurate.
          </p>
          <p className="text-base text-primary">
            <Link href="#home" className="text-[#dc2626]">
              TubeChapters
            </Link>{' '}
            can also help you with other elements of video for search engine
            optimization, such as creating titles, descriptions, and keywords.
          </p>
          <p className="text-base text-primary">
            Are you ready to transform your YouTube videos into easily
            accessible pieces of information? Try
              TubeChapters and see how it improves your viewership and channel growth and <a href="https://tubechapters.com/">generate YouTube chapters for free!</a>
          </p>
          <Link
            href={'#home'}
            className="btn bg-[#dc2626] px-4 py-3 text-back font-normal text-base rounded-xl max-w-[250px] self-center min-w-[140px]"
          >
            Generate YouTube Chapters
          </Link>
          <h2 className="text-xl mt-6 font-bold text-[#dc2626] max-w-[620px]">
            Why Should I Use TubeChapters to Automatically Create Chapters and
            Add TimeStamps?
          </h2>
          <p className="text-base text-primary">
            <Link href="#home" className="text-[#dc2626]">
              TubeChapters.com
            </Link>{' '}
            provides an easy way to speed up the process and gain a number of
            benefits.
          </p>
          <ul className="ml-5 flex flex-col gap-y-4 list-disc">
            {whyTubeChapters.map((item) => (
              <div key={item.title}>
                <li>
                  <span className="text-base font-bold text-left text-primary">
                    {item.title}
                  </span>
                  <p className="text-base text-left text-primary/90">
                    {item.content}
                  </p>
                </li>
              </div>
            ))}
          </ul>
          <p className="text-base text-primary">
            Adding chapters and time stamps to your YouTube videos is no longer
            a hassle.With{' '}
            <Link href="#home" className="text-[#dc2626]">
              TubeChapters.com
            </Link>{' '}
            {`it's easy and quick to improve your video's`} performance and
            reach more people.
          </p>
          <p className="text-base text-primary">
            So, feel free to start with{' '}
            <Link href="#home" className="text-[#dc2626]">
              TubeChapters
            </Link>{' '}
            right now and see how it can{' '}
            <span className="font-bold">
              improve your YouTube channel, and create accurate chapters for you
              in a snap.
            </span>
          </p>
          <h2 className="text-xl mt-6 font-bold text-[#dc2626] max-w-[620px]">
            TubeChapters Goes Global.
          </h2>
          <p className="text-base text-primary">
            There are different kinds of people on YouTube, and they speak many
            different languages. Language barriers {`shouldn't`} stop you from
            meeting people all over the world! With its multilingual features,
            TubeChapters gives you the power to make content that can be seen
            all over the world.
          </p>
          <ul className="ml-5 flex flex-col gap-y-4 list-disc">
            {tubeChaptersGlobal.map((item) => (
              <div key={item.title}>
                <li>
                  <span className="text-base font-bold text-left text-primary">
                    {item.title}
                  </span>
                  <p className="text-base text-left text-primary/90">
                    {item.content}
                  </p>
                </li>
              </div>
            ))}
          </ul>
          <p className="text-base text-primary">
            <Link href="#home" className="text-[#dc2626]">
              TubeChapters
            </Link>{' '}
            gives you the tools to make content that is interesting and open to
            everyone around the world. With {`TubeChapters's`} support for
            multiple languages, you can share your knowledge, interest, and
            creativity with people all over the world, and optimize your videos
            for <a href="https://blog.hootsuite.com/youtube-seo/">YouTube SEO</a> in multiple languages.
          </p>
          <Link
            href={'#home'}
            className="btn bg-[#dc2626] px-4 py-3 text-back font-normal text-base rounded-xl max-w-[250px] self-center min-w-[140px]"
          >
            Generate YouTube Chapters
          </Link>
        </div>
        <div
          id="faqs"
          className="flex flex-col sm:p-8 p-4 mx-auto gap-y-4 max-w-[800px]"
        >
          <h2 className="text-2xl mt-6 font-bold text-[#dc2626] max-w-[620px]">
            TubeChapters FAQs
          </h2>
          <p className="text-base font-bold text-primary">General Features</p>
          <DropDowns dropDownsData={faqsDownsData} />
        </div>
        <footer>
          <p className="text-sm text-primary text-center my-4">
            <Link href="https://TubeChapters.com" className="text-[#dc2626]">
              TubeChapters.com
            </Link>{' '}
            - Add Chapters & Timestamps To Your YouTube Video!
          </p>
        </footer>
      </body>
    </html>
  );
}
