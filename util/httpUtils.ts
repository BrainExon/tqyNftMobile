interface UrlExists {
  (
    url: string,
    callback: (error: Error | null, exists: boolean) => void,
    retries?: number,
  ): void;
}

export const urlExists: UrlExists = (url, callback, retries = 3) => {
  const makeRequest = (retryCount: number) => {
    fetch(url, {method: 'GET'})
      .then(res => {
        console.log(`[urlExists] url ${url}`);
        if (res.ok) {
          callback(null, true);
        } else {
          if (retryCount > 0) {
            console.log(`[urlExists] retrying... ${retryCount} retries left`);
            setTimeout(() => {
              makeRequest(retryCount - 1);
            }, 8000); // 3 seconds timeout
          } else {
            callback(null, false);
          }
        }
      })
      .catch(err => {
        if (retryCount > 0) {
          console.log(`[urlExists] retrying... ${retryCount} retries left`);
          setTimeout(() => {
            makeRequest(retryCount - 1);
          }, 8000); // 3 seconds timeout
        } else {
          callback(err, false);
        }
      });
  };

  makeRequest(retries);
};
