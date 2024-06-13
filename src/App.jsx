import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const url = "https://gnews.io/api/v4/search?q=example&lang=en&country=us&max=10&apikey=2f456dcee252d66d2a8546e7df70af9d";

  useEffect(() => {
    function getNews() {
      fetch(url)
        .then((response) => response.json())
        .then((result) => {
          setData(result.articles);
        })
        .catch(() => {
          setIsError(true);
        });
    }
    getNews();
  }, [url]);

  return (
    <>
      <header>
        Dispatch
      </header>
      <div className="news">
        {isError ? (
          <p>Error fetching news.</p>
        ) : (
          data.map((item, index) => (
            <h1 key={index}>{item.title}</h1>
          ))
        )}
      </div>
    </>
  );
}

export default App;
