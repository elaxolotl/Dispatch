import React, { useEffect, useState } from 'react';
import './App.css'
import { IoSearch } from "react-icons/io5";

function Search({handleSearch }) {
  return (
    <div className="search">
      <input type="text" placeholder='Search' onChange={handleSearch}/>
    </div>
  )
}

function News({ data, isError, timeAgo,  fallBackImg}) {
  return (
    <div className="news">
      <ul>
        {isError ? (
          <p>Error fetching news.</p>
        ) : (
          data.map((item, index) => (
            <li>
              <img
                src={item.urlToImage || fallBackImg}
                onError={(e) => e.target.src = fallBackImg}
                alt="Article"
              />
              <div className="article-info">
                <a href={item.url} target='_blank'>{item.source.name}</a><hr />
                <p>{timeAgo(item.publishedAt)}</p>
              </div>
              <h1 key={index}>{item.title}</h1>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const apiKey = "ad00c3fdf07b4a0aa7626ea97aed717e"
  var url = `https://newsapi.org/v2/everything?q=tesla&from=2024-05-14&sortBy=publishedAt&apiKey=${apiKey}`
  const fallBackImg = "https://cdn.britannica.com/25/93825-050-D1300547/collection-newspapers.jpg"

  //fatches data from api
  useEffect(() => {
    setIsLoading(true)
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        setData(result.articles);
        setIsLoading(false)
      } catch (error) {
        setIsError(true);
      }
    };
    fetchData();
  }, [url]);

  //gets the time difference of when the article was published//
  function timeAgo(publishedAt) {
    const publishTime = new Date(publishedAt);
    const now = new Date();
    const timeDiff = now - publishTime;

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (minutes < 60) {
      return `${minutes} minute(s) ago`;
    } else if (hours < 24) {
      return `${hours} hour(s) ago`;
    } else if (days < 7) {
      return `${days} day(s) ago`;
    } else {
      return `${weeks} week(s) ago`;
    }
  }

  //sets the typed text in the input box
  const handleSearch = (event) =>{
    setSearchTerm(event.target.value)
  }

  //filters the news when search
  const filteredArticles = data.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <header>
        <Search searchTerm={searchTerm} handleSearch={handleSearch}/>
        <button><IoSearch />
        </button>
        <h1>.Dispatch</h1>
      </header>
      <hr />
      {isLoading? (<p>Loading...</p>):<News data={filteredArticles} isError={isError} timeAgo={timeAgo} fallBackImg={fallBackImg} />}
      
    </>
  );
}

export default App;
