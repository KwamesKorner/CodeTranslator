import React, { useState, useRef } from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from "react-router-dom";
import $ from 'jquery';
import './App.css';
import loadGif from './loading.gif';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import ReactGA from 'react-ga4';

ReactGA.initialize('G-MRJNYMVTTC');

function Comp() {
//   ReactGA.ga('set', 'page', window.location.pathname + window.location.search);
  ReactGA.send({ hitType: "pageview", page: "/comp" });
  const [input, setInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [explanationLoaded, setExplanationLoaded] = useState(false)
  const [output, setOutput] = useState('');
  const auth = "Bearer " + process.env.REACT_APP_API_KEY;
  const textAreaRef = useRef(null);
  const copyButtonRef = useRef(null);

  function Transpile() {
    ReactGA.event({category: 'Button', action: 'Click', label: 'Convert'})
    setLoading(true);
    setExplanationLoaded(false);
    setOutput('');
    setErrorMessage('');

    if (input.trim()) {
        $.ajax({
            type: 'POST',
            url: 'https://api.openai.com/v1/engines/code-davinci-002/completions',
            headers: {
            'Content-Type': 'application/json',
            Authorization: auth,
            },
            data: JSON.stringify({
                prompt: `convert the following steps to Python code:\n ${input}`,
                temperature: 0,
                max_tokens: 512,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            }),
            success: function(response) {
                setLoading(false);
                var output_exp = response.choices[0].text;
                setOutput(`<pre>${output_exp}</pre>`);
                setExplanationLoaded(true);
            },
            error: function() {
                setErrorMessage('Error Loading Explanation. Please Try Again.');
            }
        }) 
    } 
    else {
        setLoading(false)
        setErrorMessage('Please Enter Code Above.');
    }
}

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
      <HelmetProvider>
        <Helmet>
            <link href='https://fonts.googleapis.com/css?family=Quicksand' rel='stylesheet' />
        </Helmet>
      </HelmetProvider>
      <h1>COMP</h1>
      <form>
        <label htmlFor="input-box">Insert Instructions Here:</label>
        <br />
        <textarea id="input-box" rows={10} cols={50} value={input} onChange={(e) => setInput(e.target.value)} />
        <br /><br />
        <button type="button" id="submit-button" onClick={Transpile}>Convert</button>
      </form>
      <div id="error" style={{ display: errorMessage ? 'block' : 'none' }}>
        <FontAwesomeIcon icon={faExclamationTriangle} size="10x" color="#666"/>
        <br />
        <label id="error-message">{errorMessage}</label>
      </div>
      {loading && <img id="loading-gif" src={loadGif} alt="loading" />}
      { explanationLoaded && <div ref={textAreaRef} id="output" dangerouslySetInnerHTML={{ __html: output }}></div> }
      { explanationLoaded && <button ref={copyButtonRef} id="copy-button" onClick={handleCopy}>Copy</button> }
      <form>
        <Link to="/" className='link'>
            <button>
                    BABL
            </button>
        </Link>
      </form>
    </>
  );
}

export default Comp;
