const MAX_RETRIES = 5;

async function fetchWithRetry(
  url: string,
  options: any,
  retries = MAX_RETRIES
): Promise<any> {
  try {
    return await axios.get(url, options);
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retrying... (${MAX_RETRIES - retries + 1})`);
      await new Promise((res) =>
        setTimeout(res, 1000 * (MAX_RETRIES - retries + 1))
      ); // Exponential backoff
      return fetchWithRetry(url, options, retries - 1);
    } else {
      throw error;
    }
  }
}

    const response = await fetchWithRetry(apiUrl, { headers });
    const response = await fetchWithRetry(apiUrl, { headers });
    const response = await fetchWithRetry(diffUrl, {});
        const eipMarkdownRes: string = (await fetchWithRetry(markdownPath, {}))
          .data;