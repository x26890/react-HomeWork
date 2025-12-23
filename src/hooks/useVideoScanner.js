// src/hooks/useVideoScanner.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const VIDEO_CACHE_KEY = 'meridian_v10_deep_scan';
const MOST_POPULAR_CACHE_KEY = 'meridian_v10_most_popular';
const VIDEO_DURATION = 30 * 60 * 1000; // 30分鐘
const POPULAR_DURATION = 7 * 24 * 60 * 60 * 1000; // 7天

export function useVideoScanner(selectedMember, memberList, apiKey) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [topVideos, setTopVideos] = useState([]);
  const [videoLoading, setVideoLoading] = useState(false);
  const [topLoading, setTopLoading] = useState(false);

  useEffect(() => {
    if (!selectedMember || !apiKey) return;
    let active = true;
    setSelectedVideo(null);
    setVideoLoading(true);

    const scanVideos = async () => {
      const cache = JSON.parse(localStorage.getItem(VIDEO_CACHE_KEY) || '{}');
      if (cache[selectedMember.id] && (Date.now() - cache[selectedMember.id].timestamp < VIDEO_DURATION)) {
        if (active) {
          setSelectedVideo(cache[selectedMember.id].video);
          setVideoLoading(false);
        }
        return;
      }

      try {
        const config = memberList.find(m => m.id === selectedMember.id);
        const { uploadId, standbyId } = config;
        let allVideoIds = [];

        // 抓取兩頁 PlaylistItems (共100支)
        const res1 = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
          params: { part: 'contentDetails', playlistId: uploadId, maxResults: 50, key: apiKey }
        });
        allVideoIds = res1.data.items.map(i => i.contentDetails.videoId);

        if (res1.data.nextPageToken) {
          const res2 = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
            params: { part: 'contentDetails', playlistId: uploadId, maxResults: 50, pageToken: res1.data.nextPageToken, key: apiKey }
          });
          allVideoIds = [...allVideoIds, ...res2.data.items.map(i => i.contentDetails.videoId)];
        }

        let idSet = new Set(allVideoIds);
        if (standbyId) idSet.add(standbyId);
        const finalIdList = Array.from(idSet);

        // 分批抓取影片細節
        let allDetails = [];
        for (let i = 0; i < finalIdList.length; i += 50) {
          const chunk = finalIdList.slice(i, i + 50).join(',');
          const videoRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: { part: 'snippet,liveStreamingDetails', id: chunk, key: apiKey }
          });
          allDetails = [...allDetails, ...(videoRes.data.items || [])];
        }

        if (active) {
          const upcoming = allDetails.filter(v => v.liveStreamingDetails?.scheduledStartTime);
          let finalVideo = upcoming.length > 0 
            ? upcoming.sort((a, b) => new Date(b.liveStreamingDetails.scheduledStartTime).getTime() - new Date(a.liveStreamingDetails.scheduledStartTime).getTime())[0] 
            : allDetails[0];

          setSelectedVideo(finalVideo);
          cache[selectedMember.id] = { timestamp: Date.now(), video: finalVideo };
          localStorage.setItem(VIDEO_CACHE_KEY, JSON.stringify(cache));
        }
      } catch (err) {
        console.error("Video Scan Error:", err);
      } finally {
        if (active) setVideoLoading(false);
      }
    };

    const timer = setTimeout(scanVideos, 300);
    return () => { active = false; clearTimeout(timer); };
  }, [selectedMember, apiKey]);

  // 熱門影片邏輯 (fetchMostPopular)
  useEffect(() => {
    if (!selectedMember || !apiKey) return;
    let active = true;

    const fetchTop = async () => {
      const cache = JSON.parse(localStorage.getItem(MOST_POPULAR_CACHE_KEY) || '{}');
      if (cache[selectedMember.id] && (Date.now() - cache[selectedMember.id].timestamp < POPULAR_DURATION)) {
        if (active) setTopVideos(cache[selectedMember.id].videos);
        return;
      }

      setTopLoading(true);
      try {
        const config = memberList.find(m => m.id === selectedMember.id);
        const res = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
          params: { part: 'contentDetails', playlistId: config.uploadId, maxResults: 50, key: apiKey }
        });
        
        const ids = res.data.items.map(i => i.contentDetails.videoId).join(',');
        const detailRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
          params: { part: 'snippet,statistics', id: ids, key: apiKey }
        });

        const sorted = (detailRes.data.items || [])
          .filter(v => !v.snippet.title.toLowerCase().includes("shorts"))
          .sort((a, b) => parseInt(b.statistics.viewCount) - parseInt(a.statistics.viewCount))
          .slice(0, 3);

        if (active) {
          setTopVideos(sorted);
          cache[selectedMember.id] = { timestamp: Date.now(), videos: sorted };
          localStorage.setItem(MOST_POPULAR_CACHE_KEY, JSON.stringify(cache));
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setTopLoading(false);
      }
    };

    fetchTop();
    return () => { active = false; };
  }, [selectedMember, apiKey]);

  return { selectedVideo, topVideos, videoLoading, topLoading, setSelectedVideo };
}