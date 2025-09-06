async function loadHackerNews() {
  const hnList = document.getElementById('hn-list');
  hnList.innerHTML = '<li>Loading...</li>';
  try {
    const ids = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      .then(r => r.json());
    hnList.innerHTML = '';
    for (const id of ids.slice(0, 3)) {
      const story = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        .then(r => r.json());
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = story.url || `https://news.ycombinator.com/item?id=${id}`;
      a.textContent = story.title;
      a.target = '_blank';
      li.appendChild(a);
      hnList.appendChild(li);
    }
  } catch (e) {
    hnList.innerHTML = '<li>Error loading stories</li>';
  }
}

async function loadHuggingFace() {
  const hfList = document.getElementById('hf-list');
  hfList.innerHTML = '<li>Loading...</li>';
  try {
    const res = await fetch('https://huggingface.co/api/papers?limit=2');
    const json = await res.json();
    const papers = Array.isArray(json) ? json : (json.papers || []);
    hfList.innerHTML = '';
    papers.slice(0, 2).forEach(paper => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = paper.url || paper.link || `https://huggingface.co/papers/${paper.id || paper.paperId || ''}`;
      a.textContent = paper.title || paper.paper_title || 'Untitled';
      a.target = '_blank';
      li.appendChild(a);
      hfList.appendChild(li);
    });
  } catch (e) {
    hfList.innerHTML = '<li>Error loading papers</li>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadHackerNews();
  loadHuggingFace();
});
