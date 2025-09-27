"use client";

import { api } from "@/server/react";
import { useState } from "react";
import Markdown from "react-markdown";
export default function Home() {
  const [streamText, setStreamText] = useState("");
  api.generateHelloMessage.useSubscription(undefined, {
    onData: (data) => {
      setStreamText((prev) => {
        return prev + data;
      });
    },
  });
  return (
    <div>
      <Markdown>{streamText}</Markdown>
    </div>
  );
}
