import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const CACHE_KEY = 'meridian_v3_main';
const SUBS_HISTORY_KEY = 'meridian_subs_history_v1';
const CHANNEL_DURATION = 12 * 60 * 60 * 1000;

/**
 * @param {Array} memberList - 成員設定清單
 * @param {string} apiKey - YouTube API Key
 * @param {string} selectedMemberId - 當前畫面選中的成員 ID
 */
export function useYouTubeChannels(memberList, apiKey, selectedMemberId) {
  const [members, setMembers] = useState([]);
  const [subsHistory, setSubsHistory] = useState({});
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- 內部邏輯：更新訂閱歷史 ---
  const updateSubsHistory = (currentData) => {
    const now = new Date();
    const monthTag = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    const existingHistory = JSON.parse(localStorage.getItem(SUBS_HISTORY_KEY) || '{}');
    let hasChanged = false;

    currentData.forEach(m => {
      const id = m.id;
      const count = parseInt(m.statistics.subscriberCount);
      const name = m.snippet.title.split(' / ')[0];

      if (!existingHistory[id]) {
        existingHistory[id] = { name: name, history: {} };
      }
      if (existingHistory[id].history[monthTag] !== count) {
        existingHistory[id].history[monthTag] = count;
        hasChanged = true;
      }
    });

    if (hasChanged) {
      localStorage.setItem(SUBS_HISTORY_KEY, JSON.stringify(existingHistory));
    }
    setSubsHistory(existingHistory);
  };

  // --- 核心邏輯：抓取 API 數據 ---
  useEffect(() => {
    const fetchChannels = async () => {
      if (!apiKey) return;
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CHANNEL_DURATION) {
          setMembers(data);
          updateSubsHistory(data);
          setLoading(false);
          return;
        }
      }
      try {
        const ids = memberList.map(m => m.id).join(',');
        const res = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
          params: { part: 'snippet,statistics', id: ids, key: apiKey }
        });
        const data = res.data.items || [];
        setMembers(data);
        updateSubsHistory(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
      } catch (err) {
        if (err.response?.status === 403) setIsQuotaExceeded(true);
      } finally {
        setLoading(false);
      }
    };
    fetchChannels();
  }, [apiKey]);

  // --- 新增：抽離出來的圖表計算邏輯 ---
  // 當 subsHistory 或 selectedMemberId 改變時，會自動重新計算
  const currentChartData = useMemo(() => {
    if (!selectedMemberId || !subsHistory[selectedMemberId]) return [];
    
    const history = subsHistory[selectedMemberId].history;
    // 取得所有月份 Key 並排序 (2024-01, 2024-02...)
    return Object.keys(history)
      .sort()
      .map(month => ({
        name: month,
        subs: history[month]
      }));
  }, [subsHistory, selectedMemberId]);

  return { 
    members, 
    isQuotaExceeded, 
    loading, 
    currentChartData // 直接回傳格式化好的圖表數據
  };
}