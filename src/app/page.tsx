"use client";

import { Response } from "@/components/ai-elements/response";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStreamData } from "@/hooks/use-stream-data";
import { client } from "@/server/client";
import { useEffect, useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const { data, call, isBusy, state } = useStreamData(
    client.generateHelloMessage
  );
  useEffect(() => {
    console.log(data?.join(""));
  }, [state]);
  return (
    <div>
      <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <Button disabled={isBusy} onClick={() => call(prompt)}>
        {isBusy ? "Generating..." : "Generate"}
      </Button>
      {data !== null && <Response>{data.join("")}</Response>}
    </div>
  );
}
