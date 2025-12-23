import React from 'react';

const TopVideos = ({ videos, loading, onVideoClick }) => {
  if (loading) {
    return (
      <div className="row mt-5">
        <div className="col-12 text-center py-5">
          <div className="spinner-border text-warning"></div>
          <p className="text-warning mt-2 small">SCANNING REPOSITORY...</p>
        </div>
      </div>
    );
  }

  if (!videos || videos.length === 0) return null;

  return (
    <div className="row mt-5">
      <div className="col-12">
        <div className="d-flex align-items-center mb-4">
          <h6 className="text-warning fw-bold m-0 border-start border-warning border-4 ps-3">
            MOST VIEWED CONTENT
          </h6>
          <div className="flex-grow-1 border-bottom border-warning border-opacity-25 ms-3"></div>
        </div>

        <div className="row row-cols-1 row-cols-md-3 g-4">
          {videos.map((v) => (
            <div key={v.id} className="col">
              <div 
                className="card bg-black border-secondary border-opacity-25 h-100 shadow-hover-fire" 
                style={{ cursor: 'pointer' }} 
                onClick={() => onVideoClick(v)}
              >
                <div className="ratio ratio-16x9">
                  <img 
                    src={v.snippet.thumbnails.high.url} 
                    className="card-img-top" 
                    alt="thumbnail" 
                    loading="lazy"
                  />
                </div>
                <div className="card-body p-3">
                  <p className="small text-white mb-2 text-truncate-2" style={{ height: '2.5rem' }}>
                    {v.snippet.title}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-secondary small fw-bold">
                      {parseInt(v.statistics.viewCount).toLocaleString()} views
                    </span>
                    <span className="badge bg-warning text-dark px-2">HOT</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopVideos;