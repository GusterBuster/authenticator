import Image from "next/image";
import AudioRecorder from "./audioRecorder"

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 row-start-2 items-center">
        <Image
          className="dark:invert justify-center flex items-center"
          src="/lock_clipart.jpg"
          alt="this page is locked!"
          width={200}
          height={1}
          priority
        />
        <div className="text-lg text-center font-[family-name:var(--font-geist-mono)]">
          <p>
            Say "open sesame" to enter!
          </p>
        </div>

        <div className="flex items-center">
          <AudioRecorder />
        </div>
      </main>
    </div>
  );
}
