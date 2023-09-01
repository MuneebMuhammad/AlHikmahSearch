import React, { useEffect, useState } from 'react';
import GroupVerse from './GroupVerse';
import '../IslamicSearch.css'; // assuming you have a CSS file with the same styles
import LoadingButton from '@mui/lab/LoadingButton';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box'


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

    
  };

  const fetchArabicText = async (key) => {
    const response = await fetch(`https://api.quran.com/api/v4/quran/verses/indopak?verse_key=${key}`);
    const data = await response.json();
    return data["verses"][0]["text_indopak"] + '[' + data["verses"][0]["verse_key"].split(':')[1] + ']';
    };

    const fetchAllArabicTexts = async () => {
    const allGroups = await Promise.all(
        groupVerses.map(async (group) => {
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
    setLoading(false);
}, [groupVerses])


  return (
    <div className="container">
      <h1>Al-Hikmah Search</h1>

<Box display="flex"
  justifyContent="center"
  alignItems="center"
  padding={3}>
  <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width:'80%', maxWidth: 800 }}
    >
        <InputBase
          sx={{ ml: 1, flex: 1 , width: 400}}
          placeholder="What is my mission"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          inputProps={{ maxLength: 100 }}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <LoadingButton
          size="small"
          onClick={search}
          endIcon={<SearchIcon />}
          loading={loading}
          loadingPosition="end"
          variant="contained"
        >
          <span>Search</span>
      </LoadingButton>
    </Paper>
</Box>
      {
        arabicText.map((text, index) => (
          <div key={index}>
            <GroupVerse startVerse={groupVerses[index][0]} arabicText={text} englishTranslation={resultList[index]} tafsir_ibn_kathir={tafsir_ibn_kathir[index]}></GroupVerse>
            <Divider />
            {/* <div>
                <p><strong>Start Verse:</strong>{groupVerses[index][0]}</p>
              <p> {text}</p>
              <p> {resultList[index]}</p>
              <button onClick={() => toggleTafsir(index)}>Tafsir</button>

              {showTafsir === index && (
                <div className="tafsir-popup">
                  <p>{tafsir_ibn_kathir[index]}</p>
                </div>
              )}
            </div> */}
          </div>
        ))
      }
      
    </div>
  );
};

export default IslamicSearch;
