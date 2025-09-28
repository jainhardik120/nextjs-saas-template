import { ErrorShape } from "@/server/trpc";
import { Resolver } from "@trpc/client";
import { AsyncIterableStream } from "ai";
import { useState } from "react";

export enum StreamState {
  IDLE = "idle",
  LOADING = "loading",
  GENERATING = "generating",
  ERROR = "error",
}

export function useStreamData<T, U>(generator: {
  query: Resolver<{
    input: U;
    output: AsyncIterableStream<T>;
    errorShape: ErrorShape;
    transformer: true;
  }>;
}) {
  const [data, setData] = useState<T[] | null>(null);
  const [state, setState] = useState<StreamState>(StreamState.IDLE);
  const [error, setError] = useState<Error | null>(null);

  const call = async (input: U) => {
    setData(null);
    setError(null);
    setState(StreamState.LOADING);
    let firstChunkLoaded = false;
    try {
      const result = await generator.query(input);
      for await (const chunk of result) {
        if (!firstChunkLoaded) {
          firstChunkLoaded = true;
          setState(StreamState.GENERATING);
        }
        setData((prev) => [...(prev ?? []), chunk]);
      }

      setState(StreamState.IDLE);
    } catch (err: unknown) {
      setError(err as Error);
      setState(StreamState.ERROR);
    }
  };

  return {
    data,
    state,
    error,
    call,
    isIdle: state === StreamState.IDLE,
    isLoading: state === StreamState.LOADING,
    isGenerating: state === StreamState.GENERATING,
    isError: state === StreamState.ERROR,
    isBusy: state === StreamState.LOADING || state === StreamState.GENERATING,
  };
}
