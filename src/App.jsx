import React, { useEffect, useState } from 'react';
import './App.css'
import { IoSearch } from "react-icons/io5";

function Search({ handleSearch }) {
  return (
    <div className="search">
      <input type="text" placeholder='Search' onChange={handleSearch} />
    </div>
  )
}

function Nav({ handleLink, cat }) {
  const navItems = ["General", "Business", "Entertainment", "Sports", "Technology", "Science"]
  return (
    <nav>
      <ul>
        {navItems.map((item) => (
          <button key={item} className={cat == item ? "selected" : ""} onClick={handleLink}><li>{item}</li></button>
        ))}
      </ul>
    </nav>
  )
}

function News({ data, isError, timeAgo, fallBackImg, cat }) {
  return (
    <div className="news">
      <h1 id={cat}>{cat}</h1>
      <div id='highlight'></div>
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
              <h2 key={index}>{item.title}</h2>
              <p className='description'>{item.description}</p>
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
  const [link, setLink] = useState("https://newsapi.org/v2/top-headlines?country=us&apiKey=")
  const [cat, setCat] = useState("General")
  const apiKey = "ad00c3fdf07b4a0aa7626ea97aed717e"
  var url = `${link}${apiKey}`
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
  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  //filters the news when search
  const filteredArticles = data.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLink = (event) => {
    var category = event.target.innerText
    setCat(category)
    setLink(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=`)
  }


  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (window.pageYOffset > 250) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <header>
        <Search searchTerm={searchTerm} handleSearch={handleSearch} />
        <span><IoSearch />
        </span>
        <h1>.Dispatch</h1>
        <a href='#'><button>Subscribe Now</button></a>
      </header>
      <Nav handleLink={handleLink} cat={cat} />
      <hr />
      {isLoading ? (<p>Loading...</p>) : <News data={filteredArticles} isError={isError} timeAgo={timeAgo} fallBackImg={fallBackImg} cat={cat} />}

    </>
  );
}

export default App;
