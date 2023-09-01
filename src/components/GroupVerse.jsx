import React, { useState } from 'react';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import CancelIcon from '@mui/icons-material/Cancel';
import '../groupVerse.css';

function GroupVerse(props) {
    const [selectedTafsir, setSelectedTafsir] = useState('tafsir-ibn-kathir');
    const modalId = `bd-example-modal-lg-${props.startVerse}`; // create a unique id based on startVerse or some other unique prop

    const renderTafsirContent = () => {
      if (selectedTafsir === 'tafsir-ibn-kathir') {
        return props.tafsir_ibn_kathir;
      } else if (selectedTafsir === 'maarif-ul-quran') {
        return props.maarif_ul_quran;
      }
    };

    return (
        <div className="group-verse-container" style={{marginLeft: "1%", marginRight: "1%"}}>
            <div className="left-side">
              <p>{props.startVerse}</p>
              <Tooltip title="Tafsir">
              <IconButton variant="text"><MenuBookIcon data-toggle="modal" data-target={`#${modalId}`} /></IconButton>
              </Tooltip>
            </div>
            
            <div className="right-side">
              <p dir="rtl">{props.arabicText}</p>
              <p>{props.englishTranslation}</p>
            </div>
            
            <div className="modal fade" id={modalId} tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-lg">
                
                <div className="modal-content">
                <div className="modal-header d-flex justify-content-between">
                  <div className="mx-auto"> 
                      <Stack direction="row" spacing={1}>
                          <Chip 
                              label="Tafsir Ibn Kathir" 
                              color={selectedTafsir === 'tafsir-ibn-kathir'? "success": "default"} 
                              onClick={() => setSelectedTafsir('tafsir-ibn-kathir')}
                          />
                          <Chip 
                              label="Maarif-Ul-Quran" 
                              color={selectedTafsir === 'maarif-ul-quran'? "success": "default"} 
                              onClick={() => setSelectedTafsir('maarif-ul-quran')}
                          />
                      </Stack>
                  </div>
                  <Tooltip title="Close">
                    <IconButton>
                    <CancelIcon data-dismiss="modal"/>
                    </IconButton>
                  </Tooltip>
                  
                  
                  
              </div>

                  <div className="modal-body" dangerouslySetInnerHTML={{ __html: renderTafsirContent() }}>
                  </div>
                </div>
              </div>
            </div>
        </div>
    );
}

export default GroupVerse;
