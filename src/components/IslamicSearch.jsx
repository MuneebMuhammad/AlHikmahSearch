import React, { useEffect, useState } from 'react';
import GroupVerse from './GroupVerse';
import '../IslamicSearch.css'; // assuming you have a CSS file with the same styles
import LoadingButton from '@mui/lab/LoadingButton';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert';

const IslamicSearch = () => {
  const [showAlert, setShowAlert] = useState(true);
  const [userQuery, setUserQuery] = useState('');
  const [resultList, setResultList] = useState([]);
  const [metadataList, setMetadataList] = useState([]); // Store metadata separately
  const [loading, setLoading] = useState(false);
  const [tafsir_ibn_kathir, set_tafsir_ibn_kathir] =useState([])
  const [groupVerses, setGroupVerses] = useState([])
  const [arabicText, setArabicText] = useState([]);
  const [maarif_ul_quran, set_maarif_ul_quran] = useState([])

  const search = async () => {
    setShowAlert(false);
    setResultList([]);
    setMetadataList([]);
    set_tafsir_ibn_kathir([])
    setArabicText([])
    setLoading(true);
    if (userQuery.length == 0) return
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
    const currentGroupVerses = tafsirs.map(tafsir => tafsir.verses);
    set_tafsir_ibn_kathir(tafsirTexts);
    setGroupVerses(currentGroupVerses);
    };
    fetchAllTafsirs();    

    
  };

  const fetchTextAndTafsir = async (key) => {
    const arabicPromise = fetch(`https://api.quran.com/api/v4/quran/verses/indopak?verse_key=${key}`)
      .then(response => response.json())
      .then(data => data["verses"][0]["text_indopak"] + '[' + data["verses"][0]["verse_key"].split(':')[1] + ']');
  
    const tafsirPromise = fetch(`https://api.qurancdn.com/api/qdc/tafsirs/en-tafsir-maarif-ul-quran/by_ayah/${key}`)
      .then(response => response.json())
      .then(data => data['tafsir']['text']);
  
    return Promise.all([arabicPromise, tafsirPromise]);
  };
  
  const fetchAllTexts = async () => {
    const allGroups = await Promise.all(
      groupVerses.map(async (group) => {
        const allDataInGroup = await Promise.all(group.map(fetchTextAndTafsir));
  
        let combinedArabicText = "";
        let combinedTafsirText = "";
        const uniqueTafsirTexts = new Set();
  
        allDataInGroup.forEach(data => {
          const [arabicText, tafsirText] = data;
          combinedArabicText += arabicText + ' ';
  
          if (!uniqueTafsirTexts.has(tafsirText)) {
            uniqueTafsirTexts.add(tafsirText);
            combinedTafsirText += tafsirText + ' ';
          }
        });
  
        return {
          arabicText: combinedArabicText.trim(),
          tafsirText: combinedTafsirText.trim()
        };
      })
    );
  
    setArabicText(allGroups.map(group => group.arabicText));
    set_maarif_ul_quran(allGroups.map(group => group.tafsirText));
    setLoading(false);
  };


  useEffect(() => {
    fetchAllTexts();
  }, [groupVerses]);
  





  return (
    <div >
      <h1>Al-Hikmah Search</h1>
      
<Box display="flex"
  justifyContent="center"
  alignItems="center"
  padding={3}>
  <Paper
      onSubmit={(e) => e.preventDefault()}
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width:'80%' }}
    >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="What is my mission"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          inputProps={{ maxLength: 100 }}
        />
       
        <LoadingButton
        type='Submit'
          style={{paddingRight: "17px"}}
          size="small"
          onClick={search}
          endIcon={<SearchIcon />}
          loading={loading}
          loadingPosition="center"
          variant="contained"
        >
      </LoadingButton>
    </Paper>
</Box>
{showAlert && 
<div>
  <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" padding={1}>
    <div style={{ marginBottom: '10px' }}>
      <Alert severity='info' style={{maxWidth: "500px"}}>
        🌟<b>Discover Quranic Wisdom Through AI</b>🌟<br />
        Enter your query in the search bar to explore relevant verses from the Holy Quran. Our advanced AI technology connects you with the teachings of the Quran like never before. Start your journey of knowledge and inspiration today.
      </Alert>
    </div>
    
    <div style={{ marginTop: '10px' }}>
      <Alert severity="warning" style={{maxWidth: "500px"}}>
        <b>Important Note</b><br />
        Please be aware that the results returned may not always be the perfect match from the Quran or directly relevant to your query. For more in-depth understanding, consider referring to the Tafsir of the verses.
      </Alert>
    </div>
  </Box>
</div>
}
      {
        arabicText.map((text, index) => (
          <div key={index}>
            <GroupVerse startVerse={groupVerses[index][0]} arabicText={text} englishTranslation={resultList[index]} tafsir_ibn_kathir={tafsir_ibn_kathir[index]} maarif_ul_quran={maarif_ul_quran[index]}></GroupVerse>
            <Divider />
          </div>
        ))
      }      
      
    </div>
  );
};

export default IslamicSearch;
