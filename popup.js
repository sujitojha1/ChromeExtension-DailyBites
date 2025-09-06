async function loadHackerNews() {
  const hnList = document.getElementById('hn-list');
  hnList.innerHTML = '<li>Loading...</li>';
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
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = titleLink.href || `https://news.ycombinator.com/item?id=${storyId}`;
        a.textContent = titleLink.textContent;
        a.target = '_blank';
        li.appendChild(a);
        hnList.appendChild(li);
      }
    }
  } catch (e) {
    hnList.innerHTML = '<li>Error loading stories</li>';
  }
}

async function loadHuggingFace() {
  const hfList = document.getElementById('hf-list');
  hfList.innerHTML = '<li>Loading...</li>';
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
      if (title && title.length > 10) { // Filter out very short titles
        const li = document.createElement('li');
        const a = document.createElement('a');
        
        // Get the href attribute directly and ensure it's a proper Hugging Face URL
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
          // Fallback if no href found
          a.href = 'https://huggingface.co/papers';
        }
        
        a.textContent = title;
        a.target = '_blank';
        li.appendChild(a);
        hfList.appendChild(li);
        count++;
      }
    }
    
    // If still no papers found, show a fallback with a link to the papers page
    if (count === 0) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = 'https://huggingface.co/papers';
      a.textContent = 'View Papers on Hugging Face';
      a.target = '_blank';
      li.appendChild(a);
      hfList.appendChild(li);
    }
  } catch (e) {
    // Fallback on error - show a link to the papers page
    hfList.innerHTML = '<li><a href="https://huggingface.co/papers" target="_blank">View Papers on Hugging Face</a></li>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadHackerNews();
  loadHuggingFace();
});
