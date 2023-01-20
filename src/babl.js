import React, { useState, useRef } from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import $ from 'jquery';
import './App.css';
import loadGif from './loading.gif';
import Helmet from 'react-helmet'
import ReactGA from 'react-ga'

ReactGA.initialize('G-MRJNYMVTTC')

function Babl() {
  ReactGA.ga('set', 'page', window.location.pathname + window.location.search);
  ReactGA.ga('send', 'pageview');
  const [input, setInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [explanationLoaded, setExplanationLoaded] = useState(false)
  const [output, setOutput] = useState('');
  const auth = "Bearer " + process.env.REACT_APP_API_KEY;
  const textAreaRef = useRef(null);
  const copyButtonRef = useRef(null);

  function Transpile() {
    ReactGA.event({category: 'Button', action: 'Click', label: 'Trasnpile'})
    setLoading(true);
    setExplanationLoaded(false);
    setOutput('');
    setErrorMessage('');

    if (input.trim()) {
        $.ajax({
        type: 'POST',
        url: 'https://api.openai.com/v1/engines/text-davinci-003/completions',
        headers: {
            'Content-Type': 'application/json',
            Authorization: auth,
        },
        data: JSON.stringify({
            prompt: `Can I execute this code as-is without error: ${input}`,
            max_tokens: 2036,
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        }),
        success: function (response) {
            if (!response.choices[0].text.toUpperCase().slice(0, 5).includes('\n\nYES')) {
            setLoading(false);
            setErrorMessage('Not Valid Code. Please Try Again.');
            } else {
            $.ajax({
                type: 'POST',
                url: 'https://api.openai.com/v1/engines/text-davinci-003/completions',
                headers: {
                'Content-Type': 'application/json',
                Authorization: auth,
                },
                data: JSON.stringify({
                prompt: `explain the following code as a comment in the language the code is written in: ${input}`,
                max_tokens: 2036,
                }),
                success: function(response) {
                setLoading(false);
                var output_exp = response.choices[0].text;
                setOutput(output_exp);
                setExplanationLoaded(true);
            },
            error: function() {
                setErrorMessage('Error Loading Explanation. Please Try Again.');
            }
        });
        }},
        error: function() {
            setLoading(false)
            setErrorMessage('Error Loading Explanation. Please Try Again.');
        }});  
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
      <Helmet>
        <link href='https://fonts.googleapis.com/css?family=Quicksand' rel='stylesheet' />
      </Helmet>
      <h1>BABL</h1>
      <form>
        <label htmlFor="input-box">Insert Code Here:</label>
        <br />
        <textarea id="input-box" rows={10} cols={50} value={input} onChange={(e) => setInput(e.target.value)} />
        <br /><br />
        <button type="button" id="submit-button" onClick={Transpile}>Transpile</button>
      </form>
      <div id="error" style={{ display: errorMessage ? 'block' : 'none' }}>
        <FontAwesomeIcon icon={faExclamationTriangle} size="10x" color="#666"/>
        <br />
        <label id="error-message">{errorMessage}</label>
      </div>
      {loading && <img id="loading-gif" src={loadGif} alt="loading" />}
      { explanationLoaded && <div ref={textAreaRef} id="output" dangerouslySetInnerHTML={{ __html: output }}></div> }
      { explanationLoaded && <button ref={copyButtonRef} id="copy-button" onClick={handleCopy}>Copy</button> }
    </>
  );
}

export default Babl;
