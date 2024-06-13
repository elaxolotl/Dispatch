import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const url = "https://gnews.io/api/v4/search?q=example&lang=en&country=us&max=10&apikey=2f456dcee252d66d2a8546e7df70af9d";

  //fetches the articles from the api//
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

  //gets the time difference of when the article was published//
  function timeAgo(articleDate) {
    const now = new Date();
    const past = new Date(articleDate);

    const seconds = Math.floor((now - past) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
        return years === 1 ? "1 year ago" : `${years} years ago`;
    }
    if (months > 0) {
        return months === 1 ? "1 month ago" : `${months} months ago`;
    }
    if (weeks > 0) {
        return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    }
    if (days > 0) {
        return days === 1 ? "1 day ago" : `${days} days ago`;
    }
    if (hours > 0) {
        return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    }
    if (minutes > 0) {
        return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    }
    return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
}

  return (
    <>
      <header>
        Dispatch
      </header>
      <div className="news">
        <ul>
          {isError ? (
            <p>Error fetching news.</p>
          ) : (
            data.map((item, index) => (
              <li>
                <img src={item.image}></img>
                <a href={item.source.url}>{item.source.name}</a>
                <p>{timeAgo(item.publishedAt)}</p>
                <h1 key={index}>{item.title}</h1>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}

export default App;
