
import React from 'react';

const MemberSelector = ({ members, selectedMember, onSelectMember, memberConfig }) => {
  
  // 內部渲染函式：負責處理分組配色與線條
  const renderGroup = (groupType, label, rowColsClass, wrapperClass = "col-md-5") => {
    const filteredMembers = members.filter(
      (m) => memberConfig.find((c) => c.id === m.id)?.group === groupType
    );

    if (filteredMembers.length === 0) return null;

    // 根據組別判斷顏色
    let textColorClass = "text-secondary border-secondary"; // 預設灰色
    if (groupType === '霓neo(n)') textColorClass = "text-warning border-warning";
    if (groupType === '月蝕屋MΦONLIT') textColorClass = "text-white border-white";
    if (groupType === 'meridian') textColorClass = "text-info border-info";

    return (
      <div className={wrapperClass}>
        {/* w-100 確保線條到底，移除 d-inline-block */}
        <p className={`${textColorClass} border-bottom pb-1 small w-100`}>
          {label}
        </p>

        <div className={`row ${rowColsClass} g-3 justify-content-center mt-1`}>
          {filteredMembers.map((m) => {
            const isSelected = selectedMember?.id === m.id;
            return (
              <div 
                key={m.id} 
                className="col text-center" 
                style={{ cursor: 'pointer' }} 
                onClick={() => onSelectMember(m)}
              >
                {/* 頭像與選中效果 */}
                <img 
                  src={m.snippet.thumbnails.high.url} 
                  className={`rounded-circle border border-2 mb-2 img-fluid ${
                    isSelected ? 'border-info scale-110 shadow-lg' : 'border-secondary opacity-50'
                  }`} 
                  style={{ 
                    width: '75px', 
                    height: '75px', 
                    objectFit: 'cover', 
                    transition: '0.3s' 
                  }} 
                  alt={m.snippet.title} 
                />
                {/* 名字與選中文字顏色 */}
                <div className={`small text-truncate ${
                  isSelected ? 'text-info fw-bold' : 'text-secondary'
                }`} style={{ fontSize: '0.75rem' }}>
                  {m.snippet.title.split(' / ')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="row justify-content-center mb-5 g-4 text-center">
      {/* 旗下藝人 */}
      <div className="col-12">
        {renderGroup('浠Mizuki', '旗下藝人', 'row-cols-2', "mt-2")}
      </div>
      
      {/* Partner 與 NEO 並排 */}
      {renderGroup('合作藝人', '合作藝人', 'row-cols-2')}
      {renderGroup('霓neo(n)', '霓neo(n)', 'row-cols-3')}
      
      {/* 月蝕屋 */}
      {renderGroup('月蝕屋MΦONLIT', '月蝕屋MΦONLIT', 'row-cols-3')}
      
      {/* 序境 */}
      <div className="col-12 mt-4">
        {renderGroup('meridian', 'TERAŹ 序境', 'row-cols-4', "mt-2")}
      </div>
    </div>
  );
};

export default MemberSelector;