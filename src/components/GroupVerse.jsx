import React from 'react'
import MenuBookIcon from '@mui/icons-material/MenuBook';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';


import '../groupVerse.css'

function GroupVerse(props) {
    const modalId = `bd-example-modal-lg-${props.startVerse}`; // create a unique id based on startVerse or some other unique prop

    console.log("group tafsir:", props.tafsir_ibn_kathir)
  return (
    <div className="group-verse-container">
        <div className="left-side">
          <p>{props.startVerse}</p>
          <Tooltip title="Tafsir">
          <IconButton variant="text"><MenuBookIcon data-toggle="modal" data-target={`#${modalId}`}/></IconButton>
          </Tooltip>
        </div>
        
        <div className="right-side">
          <p>{props.arabicText}</p>
          <p>{props.englishTranslation}</p>
        </div>
        
        <div className="modal fade" id={modalId} tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content" dangerouslySetInnerHTML={{ __html: props.tafsir_ibn_kathir }}>
                
            </div>
          </div>
        </div>
    </div>
  )
}

export default GroupVerse;
