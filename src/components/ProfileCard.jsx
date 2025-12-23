
import React from 'react';

const ProfileCard = ({ selectedMember }) => {
  if (!selectedMember) return null;

  const { snippet, statistics } = selectedMember;
  const subscriberCount = parseInt(statistics.subscriberCount).toLocaleString();

  return (
    <div className="card bg-black border-secondary border-opacity-25 shadow-lg h-100">
      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex align-items-center mb-4">
          <img 
            src={snippet.thumbnails.high.url} 
            className="rounded border border-secondary me-4 shadow" 
            style={{ width: '90px', height: '90px', objectFit: 'cover' }} 
            alt={snippet.title} 
          />
          <div>
            <h3 className="text-info fw-bold mb-1">
              {snippet.title.split(' / ')[0]}
            </h3>
            <p className="text-secondary small mb-0">
              {subscriberCount} Subscribers
            </p>
          </div>
        </div>
        <p 
          className="text-secondary small custom-scrollbar flex-grow-1 mb-0" 
          style={{ maxHeight: '200px', overflowY: 'auto', lineHeight: '1.6' }}
        >
          {snippet.description}
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;