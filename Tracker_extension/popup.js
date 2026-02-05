const messageEl = document.getElementById("message");

document.getElementById("addJobBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Immediately show "Job Saved"
  messageEl.textContent = "Job Saved";

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => document.body.innerText
    },
    async (results) => {
      if (!results || !results[0]) return;
      const text = results[0].result;

      try {
        // Send to server in the background, no need to wait
        fetch("http://localhost:5000/extract", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ text })
        })
        .then(res => res.json())
        .then(data => {
          console.log("Server response:", data);
        })
        .catch(err => console.error(err));

      } catch (err) {
        console.error("Error sending job to server", err);
      }
    }
  );
});
