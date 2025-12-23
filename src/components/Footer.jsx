import React from 'react';

const Footer = ({ brandName = "MERIDIAN HUB" }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-5 border-top border-secondary border-opacity-25 bg-black text-center">
      <div className="container">
        <p className="text-secondary mb-2 small">
          &copy; {currentYear} <span className="text-info">{brandName}</span> FAN PROJECT
        </p>
        
        <div className="text-secondary-50 small" style={{ fontSize: '0.7rem', opacity: 0.6 }}>
          <p className="mb-1 fw-bold">【 練習申明 】</p>
          <p className="mb-0">
            本網頁僅供程式開發技術練習與學術交流使用，無任何商業營利行為。
            <br />
            所有影音內容與圖片版權均屬原作者及 YouTube 官方所有。
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;