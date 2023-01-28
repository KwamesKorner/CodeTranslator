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

function Babl() {
//   ReactGA.ga('set', 'page', window.location.pathname + window.location.search);
  ReactGA.send({ hitType: "pageview", page: "/" });
  const [input, setInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [explanationLoaded, setExplanationLoaded] = useState(false)
  const [output, setOutput] = useState('');
  const [option, setOption] = useState("translate");
  const auth = "Bearer " + process.env.REACT_APP_API_KEY;
  const textAreaRef = useRef(null);
  const copyButtonRef = useRef(null);

  function handleOptionChange(event){
    setOption(event.target.value);
    event.target.checked = !event.target.checked
  }

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

function Convert() {
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
                prompt: `"""\n ${input}\n"""`,
                temperature: 0,
                max_tokens: 1780,
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
      <h1>BABL</h1>
      <form>
        <label htmlFor="input-box">Insert Code Here:</label>
        <br />
        <div id="translate-convert-options">
            <label for="translate-option">
                <input type="radio" id="translate-option" name="translate-convert-options" value="translate" checked={option === 'translate'} onChange={(e) => handleOptionChange(e)}></input>
                <span class="inline-radio-buttons">Translate</span>
            </label>
            <label for="convert-option">
                <input type="radio" id="convert-option" name="translate-convert-options" value="convert" checked={option === 'convert'} onChange={(e) => handleOptionChange(e)}></input>
                <span class="inline-radio-buttons">Convert</span>
            </label>
        </div>
        <textarea id="input-box" rows={10} cols={50} value={input} onChange={(e) => setInput(e.target.value)} />
        <br /><br />
        <button type="button" id="submit-button" onClick={option === 'translate' ? Transpile : Convert}>Enter</button>
      </form>
      <div id="error" style={{ display: errorMessage ? 'block' : 'none' }}>
        <FontAwesomeIcon icon={faExclamationTriangle} size="10x" color="#666"/>
        <br />
        <label id="error-message">{errorMessage}</label>
      </div>
      {loading && <img id="loading-gif" src={loadGif} alt="loading" />}
      { explanationLoaded && <div ref={textAreaRef} id="output" dangerouslySetInnerHTML={{ __html: output }}></div> }
      { explanationLoaded && <button ref={copyButtonRef} id="copy-button" onClick={handleCopy}>Copy</button> }
      
      {/* <form>
        <Link to="/comp" className='link'>
            <button>
                    COMP
            </button>
        </Link>
      </form> */}
    </>
  );
}

export default Babl;
