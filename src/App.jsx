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

function News({ data, isError }) {
  return (
    <div className="news">
      <ul>
        {isError ? (
          <p>Error fetching news.</p>
        ) : (
          data.map((item, index) => (
            <li>
              <img src={item.urlToImage}></img>
              <div className="article-info"><a href={item.source.name} target='_blank'>{item.author}</a><hr /></div>
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
  return (
    <>
      <header>
        <Search searchTerm={searchTerm} />
        <button><IoSearch />
        </button>
        <h1>.Dispatch</h1>
      </header>
      <hr />
      <News data={data} isError={isError} />
    </>
  );
}

export default App;
