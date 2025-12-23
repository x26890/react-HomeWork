
import React from 'react';

const VideoPreview = ({ loading, video, onOpenModal }) => {
  return (
    <div className="h-100 d-flex flex-column">
      <h6 className="text-info mb-3 fw-bold">
        <span className="spinner-grow spinner-grow-sm me-2 text-warning"></span>
        FURTHEST SCHEDULED
      </h6>
      
      {loading || !video ? (
        <div className="d-flex justify-content-center align-items-center bg-black border border-secondary rounded flex-grow-1" style={{ minHeight: '300px' }}>
          <div className="spinner-border text-info"></div>
        </div>
      ) : (
        <div 
          className="card bg-dark border-secondary shadow-hover-bright flex-grow-1 d-flex flex-column" 
          style={{ cursor: 'pointer' }} 
          onClick={onOpenModal}
        >
          <div className="ratio ratio-16x9">
            <img 
              src={video.snippet.thumbnails.high.url} 
              className="rounded-top" 
              style={{ objectFit: 'cover' }} 
              alt="thumbnail" 
            />
          </div>
          <div className="card-body p-3 d-flex flex-column justify-content-between">
            <p className="small fw-bold text-white mb-2 text-truncate-2">
              {video.snippet.title}
            </p>
            <p className="text-info small mb-0">
              <i className="bi bi-clock-fill me-2"></i>
              Target: {video.liveStreamingDetails?.scheduledStartTime 
                ? new Date(video.liveStreamingDetails.scheduledStartTime).toLocaleString() 
                : 'Recently Published'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPreview;