import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import ProfileHeader from "../components/ProfileHeader";
import StatsGrid from "../components/StatsGrid";
import SpotlightRepo from "../components/SpotlightRepo";
import SmartAnalysis from "../components/SmartAnalysis";
import { FaDownload, FaCopy, FaTimes } from "react-icons/fa";

function OverviewTab({ profile }) {
  const captureRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareImage, setShareImage] = useState(null);
  const [shareBlob, setShareBlob] = useState(null);

  const generateSocialCard = async () => {
    if (!captureRef.current) return;
    try {
      setIsGenerating(true);
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const bgColor = isDark ? '#0f172a' : '#f8fafc'; 
      
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: bgColor,
        scale: 2, 
        useCORS: true, 
        logging: false,
      });

      const dataUrl = canvas.toDataURL("image/png", 1.0);
      setShareImage(dataUrl);

      canvas.toBlob((blob) => {
        setShareBlob(blob);
        setShowShareModal(true);
        setIsGenerating(false);
      }, 'image/png');
    } catch (err) {
      console.error("Failed to generate social card", err);
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = `gitrank-${profile.username}-stats.png`;
    link.href = shareImage;
    link.click();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.write([
        new window.ClipboardItem({ "image/png": shareBlob })
      ]);
      alert("Image copied to clipboard! Paste it anywhere.");
    } catch (err) {
      alert("Your browser does not support copying images directly.");
    }
  };

  return (
    <>
      <div 
        ref={captureRef} 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '24px', 
          padding: '24px', 
          margin: '-24px', 
          borderRadius: '32px',
          marginBottom: '0px'
        }}
      >
        <ProfileHeader 
          profile={profile} 
          onShare={generateSocialCard} 
          isGenerating={isGenerating} 
        />
        <StatsGrid profile={profile} />
      </div>

      <SpotlightRepo profile={profile} />

      <SmartAnalysis profile={profile} />

      {/* Custom Share Modal */}
      {showShareModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          animation: 'fade-in 0.2s ease-out'
        }}>
          <div className="glass-panel" style={{
            width: '90%', maxWidth: '500px',
            padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Share Your GitRank</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px' }}
              >
                <FaTimes />
              </button>
            </div>

            <div style={{ 
              borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)',
              background: 'var(--card-bg)'
            }}>
              <img src={shareImage} alt="GitRank Card Preview" style={{ width: '100%', display: 'block' }} />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={handleCopy} 
                className="search-btn" 
                style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--text-muted)', color: 'var(--text-primary)', boxShadow: 'none' }}
              >
                <FaCopy style={{ marginRight: '8px' }} /> Copy Image
              </button>
              <button 
                onClick={handleDownload} 
                className="search-btn" 
                style={{ flex: 1 }}
              >
                <FaDownload style={{ marginRight: '8px' }} /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OverviewTab;