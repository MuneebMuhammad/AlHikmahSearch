import React, { useState } from 'react';
import '../IslamicSearch.css'; // assuming you have a CSS file with the same styles

const IslamicSearch = () => {
  const [userQuery, setUserQuery] = useState('');
  const [resultList, setResultList] = useState([]);

  const search = async () => {
    // Clear previous results
    setResultList([]);

    const response = await fetch("https://islamicsearch-4dbe9a36a60c.herokuapp.com/Quran", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_query: userQuery }),
    });

    const data = await response.json();

    if (data && Array.isArray(data["documents"])) {
      setResultList(data["documents"][0]);
    }
  };

  return (
    <div className="container">
      <h1>Islamic Search</h1>
      <input
        style={{ width: '80%', height: '30px' }}
        type="text"
        value={userQuery}
        onChange={(e) => setUserQuery(e.target.value)}
        placeholder="Enter your query"
        maxLength="100"
      />
      <button onClick={search}>Search</button>
      <ol>
        {resultList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ol>
    </div>
  );
};

export default IslamicSearch;
