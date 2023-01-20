import React, { useRef } from 'react';

function CopyCode() {
  const textAreaRef = useRef(null);
  const copyButtonRef = useRef(null);

  const handleCopy = async () => {
    try {
        await navigator.clipboard.writeText(textAreaRef.current.innerText);
        alert('Copied!');
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
  }

  return (
    <>
      <div ref={textAreaRef} id="output"></div>
      <button ref={copyButtonRef} id="copy-button" onClick={handleCopy}>Copy</button>
    </>
  );
}

export default CopyCode;