import React from 'react';

function SocialShare({ eventUrl, eventTitle }) {
  const shareText = encodeURIComponent(`Check out this event: ${eventTitle}`);
  const url = encodeURIComponent(eventUrl);

  return (
    <div className="social-share">
      <button 
        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')}>
        Facebook
      </button>
      <button 
        className="twitter"
        onClick={() => window.open(`https://twitter.com/intent/tweet?url=${url}&text=${shareText}`, '_blank')}>
        Twitter
      </button>
      <button 
        className="whatsapp"
        onClick={() => window.open(`https://api.whatsapp.com/send?text=${shareText}%20${url}`, '_blank')}>
        WhatsApp
      </button>
    </div>
  );
}

export default SocialShare;
