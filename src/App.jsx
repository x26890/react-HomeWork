import { useState, useMemo } from 'react';

// 樣式與常數配置
import './App.css';
import { MEMBER_LIST } from './constants/memberList';

// 自定義 Hooks (邏輯抽離層)
import { useYouTubeChannels } from './hooks/useYouTubeChannels';
import { useVideoScanner } from './hooks/useVideoScanner';

// 功能組件 (表現層)
import ProfileCard from './components/ProfileCard';
import VideoPreview from './components/VideoPreview';
import MemberSelector from './components/MemberSelector';
import SubscriberChart from './components/SubscriberChart';
import TopVideos from './components/TopVideos';
import Footer from './components/Footer';

function App() {
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  // --- 狀態管理 ---
  const [selectedMemberId, setSelectedMemberId] = useState(MEMBER_LIST[0].id);
  const [showModal, setShowModal] = useState(false);

  // --- 1. 頻道數據與圖表數據 Hook ---
  // 傳入 selectedMemberId，Hook 會直接回傳該成員格式化好的 currentChartData
  const { 
    members, 
    isQuotaExceeded, 
    currentChartData 
  } = useYouTubeChannels(MEMBER_LIST, API_KEY, selectedMemberId);
  
  // 計算當前選中的成員完整資料物件 (從 API 回傳的 members 中查找)
  const selectedMember = useMemo(() => {
    return members.find(m => m.id === selectedMemberId) || null;
  }, [members, selectedMemberId]);

  // --- 2. 影片掃描 Hook (掃描最新直播與熱門影片) ---
  const { 
    selectedVideo, 
    topVideos, 
    videoLoading, 
    topLoading, 
    setSelectedVideo 
  } = useVideoScanner(selectedMember, MEMBER_LIST, API_KEY);

  return (
    <div className="bg-dark min-vh-100 text-white font-monospace pb-5 d-flex flex-column">
      
      {/* 導覽列 */}
      <nav className="navbar navbar-dark bg-black border-bottom border-info mb-4 shadow sticky-top">
        <div className="container justify-content-center">
          <h4 className="text-info fw-bold m-0" style={{ letterSpacing: '4px' }}>
            MERIDIAN HUB
          </h4>
        </div>
      </nav>

      <div className="container py-3 flex-grow-1">
        {/* 錯誤提示：API 配額耗盡 */}
        {isQuotaExceeded && (
          <div className="alert alert-danger text-center shadow-sm border-0 mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            YouTube API 額度已用盡，部分數據可能無法顯示。
          </div>
        )}

        {/* 成員選擇器元件 */}
        <MemberSelector
          members={members}
          selectedMember={selectedMember}
          onSelectMember={(m) => setSelectedMemberId(m.id)}
          memberConfig={MEMBER_LIST}
        />

        {/* 核心資訊區：頻道資訊卡 + 影片預覽 */}
        <div className="row g-4 align-items-stretch mb-5">
          <div className="col-lg-7">
            <ProfileCard selectedMember={selectedMember} />
          </div>
          <div className="col-lg-5">
            <VideoPreview
              loading={videoLoading}
              video={selectedVideo}
              onOpenModal={() => setShowModal(true)}
            />
          </div>
        </div>

      </div>

      {/* 頁尾 */}
      <Footer />

      {/* 全域影片播放彈窗 (Modal) */}
      {showModal && selectedVideo && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content-custom" onClick={e => e.stopPropagation()}>
            <div className="d-flex justify-content-end bg-black p-2 border-bottom border-info">
              <button 
                className="btn btn-sm text-info fw-bold" 
                onClick={() => setShowModal(false)}
              >
                ✕ CLOSE
              </button>
            </div>
            <div className="ratio ratio-16x9">
              <iframe 
                src={`https://www.youtube.com/embed/${selectedVideo.id.videoId || selectedVideo.id}?autoplay=1`} 
                allowFullScreen 
                title="YouTube Video Player"
              ></iframe>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;