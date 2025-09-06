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
    
    // Find paper links - they're typically in cards or list items
    const paperLinks = doc.querySelectorAll('a[href*="/papers/"]');
    hfList.innerHTML = '';
    
    let count = 0;
    for (const link of paperLinks) {
      if (count >= 2) break;
      
      const title = link.textContent.trim();
      if (title && title.length > 10) { // Filter out very short titles
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = link.href.startsWith('http') ? link.href : `https://huggingface.co${link.href}`;
        a.textContent = title;
        a.target = '_blank';
        li.appendChild(a);
        hfList.appendChild(li);
        count++;
      }
    }
    
    if (count === 0) {
      hfList.innerHTML = '<li>No papers found</li>';
    }
  } catch (e) {
    hfList.innerHTML = '<li>Error loading papers</li>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadHackerNews();
  loadHuggingFace();
});
