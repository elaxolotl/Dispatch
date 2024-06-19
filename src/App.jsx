import React, { useEffect, useState } from 'react';
import './App.css'
import './mediaQueries.css'
import { IoSearch } from "react-icons/io5";
import { IoGlobeOutline } from "react-icons/io5";
import ReactCountryFlag from "react-country-flag"

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
          data.length > 0 ? (
            data.map((item, index) => (
              <li key={index}>
                <img
                  src={item.image || fallBackImg}
                  onError={(e) => e.target.src = fallBackImg}
                  alt="Article"
                />
                <div className="article-info">
                  <a href={item.source.url} target='_blank'>{item.source?.name}</a><hr />
                  <p>{timeAgo(item.publishedAt)}</p>
                </div>
                <h2>{item.title}</h2>
                <p className='description'>{item.description}</p>
              </li>
            ))
          ) : (
            <p>No articles found.</p>
          )
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
  const [cat, setCat] = useState("General")
  const [region, setRegion] = useState("us")
  const [link, setLink] = useState(`https://gnews.io/api/v4/search?&q=None&lang=en&country=${region}&max=10&apikey=`)
  const apiKey = "2f456dcee252d66d2a8546e7df70af9d"
  var url = `${link}${apiKey}`
  const fallBackImg = "https://cdn.britannica.com/25/93825-050-D1300547/collection-newspapers.jpg"

  //fatches data from api
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result.articles || []);
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
      if (seconds == 1) {
        return '1 second ago'
      }
      else {
        return `${seconds} seconds ago`;
      }
    } else if (minutes < 60) {
      if (minutes == 1) {
        return '1 minute ago'
      }
      else {
        return `${minutes} minutes ago`;
      }
    } else if (hours < 24) {
      if (hours == 1) {
        return '1 hour ago'
      }
      else {
        return `${hours} hours ago`;
      }
    } else if (days < 7) {
      if (days == 1) {
        return '1 day ago'
      }
      else {
        return `${days} days ago`;
      }
    } else {
      if (weeks == 1) {
        return '1 week ago'
      }
      else {
        return `${weeks} weeks ago`;
      }
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
    setLink(`https://gnews.io/api/v4/top-headlines?lang=en&country=us&max=10&category=${category.toLowerCase()}&apikey=`)
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

  //changes region
  const handleRegion = (event) => {
    var c = event.target.className
    setRegion(c)
    setLink(`https://gnews.io/api/v4/search?&q=None&lang=en&country=${c.toLowerCase()}&max=10&apikey=`)
  }

  const regions = ["BR", "CN", "EG", "JP", "ES", "GB", "US"];
  return (
    <>
      <header>
        <div className="region" ><IoGlobeOutline />
          <ul className='countries'>
            {regions.map((item) => (<li onClick={handleRegion} ><ReactCountryFlag id='flag' className={item} countryCode={item} svg /></li>))}
          </ul>
        </div>
        <div className="center-content">
          <Search searchTerm={searchTerm} handleSearch={handleSearch} />
          <span><IoSearch />
          </span>
          <h1>.Dispatch</h1>
          <a href='#'><button>Subscribe Now</button></a>
        </div>
      </header>
      <Nav handleLink={handleLink} cat={cat} />
      <hr />
      {isLoading ? (<p>Loading...</p>) : <News data={filteredArticles} isError={isError} timeAgo={timeAgo} fallBackImg={fallBackImg} cat={cat} />}

    </>
  );
}

export default App;
