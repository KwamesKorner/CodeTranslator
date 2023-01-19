$(document).ready(function() {
    $("#loading-gif").hide()
    $("#output").hide()
    $("#copy-button").hide()
    $("#error").hide()
    $("#submit-button").click(function() {
      $("#loading-gif").show();
      $("#output").hide()
      $("#copy-button").hide()
      $("#error").hide()
      var inputValue = $("#input-box").val();
      if (inputValue) {
        $.ajax({
            type: "POST",
            url: "https://api.openai.com/v1/engines/text-davinci-003/completions",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer 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"
            },
            data: JSON.stringify({
              prompt: "Is this valid code: " + inputValue,
              max_tokens: 2036
            }),
            success: function(response) {
              if(response.choices[0].text.toUpperCase().includes("NO")){
                $("#loading-gif").hide();
                $("#error-message").html("Not Valid Code. Please Try Again.")
                $("#error").show()
              } else {
                    $.ajax({
                        type: "POST",
                        url: "https://api.openai.com/v1/engines/text-davinci-003/completions",
                        headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer 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"
                        },
                        data: JSON.stringify({
                        prompt: "explain the following code as a comment in the language the code is written in: " + inputValue,
                        max_tokens: 2036
                        }),
                        success: function(response) {
                            $("#loading-gif").hide();
                            var output = response.choices[0].text;
                            $("#output").html(output);
                            $("#output").show();
                            $("#copy-button").show()
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            $("#loading-gif").hide();
                            $("#error-message").html("Error Loading Explanation. Please Try Again.")
                            $("#error").show()
                        }
                    });
              }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $("#loading-gif").hide();
                $("#error-message").html("Error Loading Explanation. Please Try Again.")
                $("#error").show()
            }
        });  
      } else {
        $("#loading-gif").hide();
        $("#error-message").html("Please Enter Code Above.")
        $("#error").show()
      }
    });
  });

  const copyButton = document.getElementById('copy-button');
  const textArea = document.getElementById('output');
  
  copyButton.addEventListener('click', async () => {
      try {
          await navigator.clipboard.writeText(textArea.innerText);
          alert('Copied!');
      } catch (err) {
          console.error('Failed to copy text: ', err);
      }
  });
  
  
  
  
  