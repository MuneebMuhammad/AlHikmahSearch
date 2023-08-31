import React, { useEffect, useState } from 'react';
import '../IslamicSearch.css'; // assuming you have a CSS file with the same styles

const IslamicSearch = () => {
  const [userQuery, setUserQuery] = useState('');
  const [resultList, setResultList] = useState([]);
  const [metadataList, setMetadataList] = useState([]); // Store metadata separately
  const [loading, setLoading] = useState(false);
  const [tafsir_ibn_kathir, set_tafsir_ibn_kathir] =useState([])
  const [groupVerses, setGroupVerses] = useState([])
  const [arabicText, setArabicText] = useState([]);
  const [showTafsir, setShowTafsir] = useState(null);

  const search = async () => {
    setLoading(true);
    setResultList([]);
    setMetadataList([]);

    const response = await fetch("https://islamicsearch-4dbe9a36a60c.herokuapp.com/Quran", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_query: userQuery }),
    });

    const data = await response.json();

    if (data && Array.isArray(data["documents"]) && Array.isArray(data["metadatas"])) {
      setResultList(data["documents"][0]);
      setMetadataList(data["metadatas"][0]);
    }

    const fetchTafsir = async (verseKey) => {
        const response = await fetch(`https://api.qurancdn.com/api/qdc/tafsirs/en-tafisr-ibn-kathir/by_ayah/${verseKey}`);
        const data = await response.json();
        return {
          text: data['tafsir']['text'],
          verses: Object.keys(data['tafsir']['verses']),
        };
      };
      
    const fetchAllTafsirs = async () => {
    const startVerseKeys = data["metadatas"][0].map(singleGroup => singleGroup['verse_key']);
    const tafsirs = await Promise.all(startVerseKeys.map(fetchTafsir));
    
    const tafsirTexts = tafsirs.map(tafsir => tafsir.text);
    const groupVerses = tafsirs.map(tafsir => tafsir.verses);
    set_tafsir_ibn_kathir(tafsirTexts);
    setGroupVerses(groupVerses);
    };
    fetchAllTafsirs();    

    setLoading(false);
  };

  const fetchArabicText = async (key) => {
    const response = await fetch(`https://api.quran.com/api/v4/quran/verses/indopak?verse_key=${key}`);
    const data = await response.json();
    return data["verses"][0]["text_indopak"] + '[' + data["verses"][0]["verse_key"].split(':')[1] + ']';
    };

    const fetchAllArabicTexts = async () => {
    const allGroups = await Promise.all(
        groupVerses.map(async (group) => {
        console.log("group:", group)
        const textsInGroup = await Promise.all(group.map(fetchArabicText));
        return textsInGroup.join(' ');
        })
    );

    setArabicText(allGroups);
    };

    const toggleTafsir = (index) => {
        if (showTafsir === index) {
          setShowTafsir(null); // Hide if clicking the same index
        } else {
          setShowTafsir(index); // Show new index
        }
      };

  useEffect(()=>{
    fetchAllArabicTexts();
}, [groupVerses])


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
      {loading ? (
        <p>Loading...</p>
      ) : (
        arabicText.map((text, index) => (
          <div key={index}>
            <div>
                <p><strong>Start Verse:</strong>{groupVerses[index][0]}</p>
              <p><strong>Arabic:</strong> {text}</p>
              <p><strong>Translation:</strong> {resultList[index]}</p>
              <button onClick={() => toggleTafsir(index)}>Tafsir</button>

              {showTafsir === index && (
                <div className="tafsir-popup">
                  <p>{tafsir_ibn_kathir[index]}</p>
                </div>
              )}
            </div>
          </div>
        ))
      )}
      
    </div>
  );
};

export default IslamicSearch;
