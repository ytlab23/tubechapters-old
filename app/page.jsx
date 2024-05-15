import { getSummery, getTranscript } from "@/api/getData";
import Form from "@/components/Form";

export default function Home() {
  return (
    <div className="box  bg-white sm:p-16 px-4 py-16 text-center flex flex-col gap-y-8 rounded-xl w-[95%] md:max-w-[800px]">
      <h1 className="text-4xl font-bold text-[#dc2626]">tubechapters</h1>
      <h2 className="text-xl text-primary">
        Create captions and timestamps for youtube vide
      </h2>
      <Form getSummery={getSummery} getTranscript={getTranscript} />
    </div>
  );
}
