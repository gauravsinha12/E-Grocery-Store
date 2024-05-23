import React from 'react'
import ReactModal from 'react-modal';

const SpinnerLoader = ({show, closeShow}) => {
    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)' // Change the opacity value (0.5) as needed
        }
      };

      
  return (
    <ReactModal
        isOpen={show}
        onRequestClose={closeShow || ""}
        style={customStyles}
        contentLabel="Loader Modal"
      >
        <svg className="spin-loader" xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
            </svg>
      </ReactModal>
  )
}

export default SpinnerLoader
