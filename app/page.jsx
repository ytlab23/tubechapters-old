export default function Home() {
  return (
    <div className="box absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  bg-white sm:p-16 px-4 py-16 text-center flex flex-col gap-y-8 rounded-xl w-[95%] md:max-w-[800px]">
      <h1 className="text-4xl font-bold text-[#dc2626]">tubechapters</h1>
      <h2 className="text-xl text-primary">
        Create captions and timestamps for youtube vide
      </h2>

      <div className="flex flex-col gap-y-4 mt-24">
        <h2 className="text-base text-primary">Add your YouTube URL 👇</h2>
        <input
          type="text"
          placeholder="https://www.youtube.com/watch?"
          className="outline-none border border-primary/40 bg-back px-8 py-4 rounded-xl"
        />
        <button className="btn bg-[#dc2626] px-6 py-3 text-back font-normal text-xl rounded-xl max-w-[150px] self-center">
          Generate
        </button>
      </div>
    </div>
  );
}
