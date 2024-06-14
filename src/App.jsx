import React, { useEffect, useState } from 'react';
import './App.css'
import { IoSearch } from "react-icons/io5";

function Search({ searchTerm }) {
  return (
    <div className="search">
      <input type="text" placeholder='Search' />
    </div>
  )
}

function News({ data, isError, timeAgo }) {
  return (
    <div className="news">
      <ul>
        {isError ? (
          <p>Error fetching news.</p>
        ) : (
          data.map((item, index) => (
            <li>
              <img src={item.urlToImage}></img>
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
  const apiKey = "ad00c3fdf07b4a0aa7626ea97aed717e"
  var url = `https://newsapi.org/v2/everything?q=tesla&from=2024-05-14&sortBy=publishedAt&apiKey=${apiKey}`

  //fatches data from api
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        console.log(result);
        setData(result.articles);
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

  return (
    <>
      <header>
        <Search searchTerm={searchTerm} />
        <button><IoSearch />
        </button>
        <h1>.Dispatch</h1>
      </header>
      <hr />
      <News data={data} isError={isError} timeAgo={timeAgo}/>
    </>
  );
}

export default App;
