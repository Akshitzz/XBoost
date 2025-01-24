import Marquee from "./ui/marquee";
import { cn } from "@/lib/utils";

const reviews = [
  {
    name: "Akshit",
    username: "@0xAkshit",
    body: "This product is commendable it helped my product gain attraction and increase my userbase . Amazing !",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Siya",
    username: "@Siyathedev",
    body: "Being a founder and developer myself . XBoost figured my marketing ans saved a lot of time ",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "Rohan",
    username: "@rohangeek",
    body: "I highly recommend Xboost if you are a stratup founder . it figures out your marketing stuff .",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Aisha",
    username: "AishaCodes",
    body: "Amazing Product Dude . You cooked something out of the box . spendulous",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Ash",
    username: "@tweetsbyash",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "aditya",
    username: "@adityax3",
    body: "I code and ship my products and leave the rest of stuff on Xboost. Mast !",
    img: "https://avatar.vercel.sh/james",
  },
];
const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img, name, username, body }) => {
  return (
    <figure
      className={cn(
        "relative w-64 sm:w-72 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-200 bg-gray-50 hover:bg-gray-100",
        "dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <img className="rounded-full" width="40" height="40" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {username}
          </p>
        </div>
      </div>
      <blockquote className="mt-3 text-sm text-gray-800 dark:text-gray-300">
        {body}
      </blockquote>
    </figure>
  );
};

export const Faq = () => {
  return (
    <section id="faq" className="py-12 px-6 sm:px-12">
      <div className="relative flex h-auto flex-col items-center justify-center overflow-hidden rounded-lg bg-background">
        <div className="container mx-auto space-y-8">
          <Marquee pauseOnHover className="[--duration:20s]">
            {firstRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:20s]">
            {secondRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
        </div>
        {/* Gradient overlays */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto mt-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Is XBoost compliant with X&apos;ss rules?
            </h3>
            <p>
              Yes, XBoost is fully compliant with X&apos;ss terms of service and
              API guidelines.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Can I schedule posts in advance?
            </h3>
            <p>
              You can schedule posts days, weeks, or even months in advance.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              How does the AI-powered content suggestion work?
            </h3>
            <p>
              Our AI analyzes your past successful posts and current trends to
              suggest content that&apos;ss likely to engage your audience.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Is there a free trial available?
            </h3>
            <p>
              Yes, we offer a 14-day free trial so you can experience the power
              of XBoost risk-free.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
