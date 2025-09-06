async function loadHackerNews() {
  const hnList = document.getElementById('hn-list');
  hnList.innerHTML = '<tr><td>Loading...</td></tr>';
  try {
    const response = await fetch('https://news.ycombinator.com/');
    const html = await response.text();
    
    // Parse the HTML to extract story information
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Find story rows (they have class 'athing')
    const storyRows = doc.querySelectorAll('.athing');
    hnList.innerHTML = '';
    
    for (let i = 0; i < Math.min(3, storyRows.length); i++) {
      const storyRow = storyRows[i];
      const titleLink = storyRow.querySelector('.titleline a');
      const storyId = storyRow.id;
      
      if (titleLink) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        const a = document.createElement('a');
        a.href = titleLink.href || `https://news.ycombinator.com/item?id=${storyId}`;
        a.textContent = titleLink.textContent;
        a.target = '_blank';
        td.appendChild(a);
        tr.appendChild(td);
        hnList.appendChild(tr);
      }
    }
  } catch (e) {
    hnList.innerHTML = '<tr><td>Error loading stories</td></tr>';
  }
}

async function loadHuggingFace() {
  const hfList = document.getElementById('hf-list');
  hfList.innerHTML = '<tr><td colspan="2">Loading...</td></tr>';
  try {
    const response = await fetch('https://huggingface.co/papers');
    const html = await response.text();
    
    // Parse the HTML to extract paper information
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Find paper links - try multiple selectors
    let paperLinks = doc.querySelectorAll('a[href*="/papers/"]');
    
    // If no papers found, try alternative selectors
    if (paperLinks.length === 0) {
      paperLinks = doc.querySelectorAll('a[href*="arxiv.org"]');
    }
    if (paperLinks.length === 0) {
      paperLinks = doc.querySelectorAll('a[href*="papers"]');
    }
    
    hfList.innerHTML = '';

    let count = 0;
    for (const link of paperLinks) {
      if (count >= 2) break;

      const title = link.textContent.trim();
      if (title && title.length > 10) {
        const tr = document.createElement('tr');
        const titleTd = document.createElement('td');
        const pdfTd = document.createElement('td');

        const a = document.createElement('a');
        const href = link.getAttribute('href');
        if (href) {
          if (href.startsWith('http')) {
            a.href = href;
          } else if (href.startsWith('/')) {
            a.href = `https://huggingface.co${href}`;
          } else {
            a.href = `https://huggingface.co/papers/${href}`;
          }
        } else {
          a.href = 'https://huggingface.co/papers';
        }

        a.textContent = title;
        a.target = '_blank';
        titleTd.appendChild(a);

        try {
          const paperResp = await fetch(a.href);
          const paperHtml = await paperResp.text();
          const parser = new DOMParser();
          const paperDoc = parser.parseFromString(paperHtml, 'text/html');
          const pdfLink = paperDoc.querySelector('a[href$=".pdf"], a[href*="arxiv.org/pdf"]');
          if (pdfLink && pdfLink.href) {
            const pdfA = document.createElement('a');
            pdfA.href = pdfLink.href;
            pdfA.textContent = 'PDF';
            pdfA.target = '_blank';
            pdfA.download = '';
            pdfTd.appendChild(pdfA);
          } else {
            pdfTd.textContent = 'N/A';
          }
        } catch (err) {
          pdfTd.textContent = 'N/A';
        }

        tr.appendChild(titleTd);
        tr.appendChild(pdfTd);
        hfList.appendChild(tr);
        count++;
      }
    }
    
    // If still no papers found, show a fallback with a link to the papers page
    if (count === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 2;
      const a = document.createElement('a');
      a.href = 'https://huggingface.co/papers';
      a.textContent = 'View Papers on Hugging Face';
      a.target = '_blank';
      td.appendChild(a);
      tr.appendChild(td);
      hfList.appendChild(tr);
    }
  } catch (e) {
    // Fallback on error - show a link to the papers page
    hfList.innerHTML = '<tr><td colspan="2"><a href="https://huggingface.co/papers" target="_blank">' +
      'View Papers on Hugging Face</a></td></tr>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadHackerNews();
  loadHuggingFace();
});
