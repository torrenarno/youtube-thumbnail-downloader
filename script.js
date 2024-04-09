document.getElementById('fetchButton').addEventListener('click', function() {
  fetchThumbnails().then(() => {
    // Scroll to the thumbnails container
    const thumbnailContainer = document.getElementById('thumbnail-container');
    thumbnailContainer.scrollIntoView({ behavior: 'smooth' });
  }).catch(error => {
    console.error('Error fetching thumbnails:', error);
  });
});

function extractVideoIdFromUrl(url) {
  const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

async function fetchThumbnail(url, quality) {
  const proxy = 'https://corsproxy.io/?';
  const videoId = extractVideoIdFromUrl(url);

  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  const thumbnailUrl = `${proxy}https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
  const response = await fetch(thumbnailUrl);

  if (!response.ok) {
    throw new Error('Failed to fetch thumbnail');
  }

  return thumbnailUrl;
}

async function fetchThumbnails() {
  const youtubeUrl = document.getElementById('url').value;
  const thumbnailContainer = document.getElementById('thumbnail-container');

  try {
    if (!youtubeUrl) {
      throw new Error('URL is empty');
    }

    const qualityOptions = {
      '4k': 'maxresdefault',
      'High': 'hqdefault',
      'Medium': 'mqdefault',
      'Low': 'default'
    };

    const thumbnails = [];

    for (const [qualityName, qualityValue] of Object.entries(qualityOptions)) {
      try {
        const thumbnailUrl = await fetchThumbnail(youtubeUrl, qualityValue);
        const thumbnail = {
          name: qualityName,
          url: thumbnailUrl
        };
        thumbnails.push(thumbnail);
      } catch (error) {
        console.error(`Error fetching thumbnail for quality ${qualityName}:`, error);
      }
    }

    thumbnailContainer.innerHTML = ''; // Clear previous thumbnails
    thumbnails.forEach(thumbnail => {
      const container = document.createElement('div');
      container.classList.add('thumbnail-container', 'show'); // Add the 'show' class for animation

      const img = document.createElement('img');
      img.src = thumbnail.url;
      img.alt = `Thumbnail - ${thumbnail.name}`;
      img.classList.add('thumbnail', 'thumbnail-image'); // Add the 'thumbnail-image' class
      container.appendChild(img);

      const downloadBtn = document.createElement('button');
      downloadBtn.textContent = `Download ${thumbnail.name}`;
      downloadBtn.classList.add('download-btn');
      container.appendChild(downloadBtn);

      thumbnailContainer.appendChild(container);
    });
  } catch (error) {
    console.error('Error fetching thumbnails:', error);
  }
}
