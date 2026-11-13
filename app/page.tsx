"use client"; 
import { useState } from "react"; 
const LOADING_MESSAGES = [
  "Garbling...",
  "Gurgling....",
  "Glugging...",
  "Gaslighting...",
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false); // waiting for ai? display loading message

  async function answerQuestion(questionAsked: React.FormEvent<HTMLFormElement>) {
    questionAsked.preventDefault();
    if (query.trim() === "") return;

    // message while waiting
    const randomIndex = Math.floor(Math.random() * LOADING_MESSAGES.length); 
    setAnswer(LOADING_MESSAGES[randomIndex]); 
    setIsLoading(true); 

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });
      const data = await response.json();
      setAnswer(data.answer ?? "Something went wrong.");
    } catch {
      setAnswer("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }
  
  return <main className="flex flex-col items-center pt-40">
    {/* header, mb-6 is margin bottom, 24 px;; multiply by 4 */}
    <h1 className="font-heading text-8xl font-normal text-gray-900">
      Ask a Question
    </h1>
    <h2 className="mb-16 mt-3 text-2xl text-gray-800"> 
      all questions deserve an answer. allegedly. 
    </h2>

    {/* search bar */}
    <form onSubmit={answerQuestion} className="w-1/2">
      <input
        type="text"
        value={query}
        onChange={(questionAsked) => setQuery(questionAsked.target.value)}
        placeholder='try "should I get a treadmill?" Or, "why does stanford have so many palm trees?"'
        /**
        * w-1/3:: 50% of width
        * rounded-full:: rounded ends for pill shape
        * border border-gray-300::  1px light grey border
        * bg-white:: white background for search bar 
        * px-6 py-3:: padding, how tall pill is and how far text sits from edge 
        * outline-none:: removes default blue focus ring 
        * focus:border-gray-500:: darkens border when input clicked
        */
        className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 shadow-sm outline-none focus:border-gray-500"  
      />
    </form>
    {/* conditional rendering:: showing something only if condition met */}
    {answer && (
      <p
        className={
          isLoading
            ? "mt-6 w-1/2 text-center tracking-widest text-gray-500"
            : "mt-6 w-1/2 px-6 text-gray-700"
        }
      >
        {answer}
      </p>
    )}

  </main>;
}