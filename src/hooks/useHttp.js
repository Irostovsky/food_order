import { useCallback, useEffect, useMemo, useState } from "react";

async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);

  const respData = await response.json();
  if (!response.ok) {
    throw new Error(
      respData.message || "Something went wrong, failed to sent request."
    );
  }
  return respData;
}

export default function useHttp(url, config, initialData) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  function clearData() {
    setData(initialData);
  }

  const sendRequest = useCallback(
    async function sendRequest(data) {
      setIsLoading(true);
      try {
        const respData = await sendHttpRequest(url, {
          ...config,
          body: data,
        });
        setData(respData);
      } catch (error) {
        setError(error.message || "Something went wrong!");
      }
      setIsLoading(false);
    },
    [url, config]
  );

  useEffect(() => {
    if (!config || (config && (config.method === "GET" || !config.method))) {
      sendRequest();
    }
  }, [sendRequest, config]);
  return { data, isLoading, error, sendRequest, clearData };
}
