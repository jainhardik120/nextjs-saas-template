"use client";

import { client } from "@/server/client";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
export default function Home() {
  const [streamText, setStreamText] = useState("");
  useEffect(() => {
    const generate = async () => {
      const result = await client.generateHelloMessage.query();
      for await (const textPart of result) {
        setStreamText((prev) => {
          return prev + textPart;
        });
      }
    };
    generate();
  }, []);
  return (
    <div>
      <Markdown>{streamText}</Markdown>
    </div>
  );
}
