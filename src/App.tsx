import './App.css'
import { useState, useRef, useEffect } from 'react'

const FILTERS = [
  { name: 'None', css: '' },
  { name: 'Grayscale', css: 'grayscale(1)' },
  { name: 'Sepia', css: 'sepia(1)' },
  { name: 'Pink Glow', css: 'drop-shadow(0 0 16px #FFC0CB) brightness(1.1)' },
  { name: 'Contrast+', css: 'contrast(1.5)' },
  { name: 'Blur', css: 'blur(2px)' },
  { name: 'Cool', css: 'hue-rotate(180deg) saturate(1.2)' },
]

const MAX_PHOTOS = 3

function App() {
  const [coinInserted, setCoinInserted] = useState(false)
  const [showStart, setShowStart] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [filterIdx, setFilterIdx] = useState(0)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [photos, setPhotos] = useState<string[]>([])
  const [isShooting, setIsShooting] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [folderVisible, setFolderVisible] = useState(false)
  const [openPressed, setOpenPressed] = useState(false)

  const handleInsertCoin = () => {
    setCoinInserted(true)
    setTimeout(() => {
      setShowStart(true)
    }, 1200)
  }

  const handleStart = () => {
    setShowCamera(true)
    setIsShooting(true)
    // Do NOT start countdown here; wait for camera icon click
  }

  useEffect(() => {
    if (showCamera && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
            videoRef.current.play()
          }
        })
        .catch((err) => {
          alert('Could not access webcam: ' + err)
        })
    }
  }, [showCamera])

  const handlePrevFilter = () => {
    setFilterIdx((idx) => (idx - 1 + FILTERS.length) % FILTERS.length)
  }
  const handleNextFilter = () => {
    setFilterIdx((idx) => (idx + 1) % FILTERS.length)
  }

  // Camera icon click: start countdown (manual trigger)
  const handleCameraClick = () => {
    if (countdown !== null || !isShooting) return
    if (photos.length === 0) {
      startCountdown()
    }
  }

  // Start countdown and take photo
  const startCountdown = () => {
    setCountdown(3)
    let current = 3
    const interval = setInterval(() => {
      current--
      if (current > 0) {
        setCountdown(current)
      } else {
        clearInterval(interval)
        setCountdown(null)
        setTimeout(() => takePhoto(), 200)
      }
    }, 1000)
  }

  // Take photo from video
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.filter = FILTERS[filterIdx].css || 'none'
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const newPhoto = canvas.toDataURL('image/png')
        setPhotos((prev) => [...prev, newPhoto])
      }
    }
  }

  // After each photo, if we need more, start the next countdown
  useEffect(() => {
    if (isShooting && photos.length > 0 && photos.length < MAX_PHOTOS && countdown === null) {
      const timeout = setTimeout(() => startCountdown(), 800)
      return () => clearTimeout(timeout)
    }
    if (photos.length === MAX_PHOTOS) {
      setIsShooting(false)
      setSessionComplete(true)
    }
  }, [photos, isShooting, countdown])

  useEffect(() => {
    if (sessionComplete) {
      setTimeout(() => setFolderVisible(true), 100) // slight delay for animation
    } else {
      setFolderVisible(false)
    }
  }, [sessionComplete])

  return (
    <div className="insert-coin-bg">
      {sessionComplete ? (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            width: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            className={folderVisible ? 'folder-animate' : ''}
            style={{
              transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
              transform: folderVisible ? 'translateY(60px)' : 'translateY(-120px)',
              pointerEvents: 'auto',
              position: 'relative',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              src="/folder.png"
              alt="Session Complete"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
            <button
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'none',
                border: 'none', // Remove border
                borderRadius: '0', // Remove border radius
                outline: 'none', // Remove outline
                padding: '0.5rem 1.2rem',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                color: openPressed ? '#ff69b4' : '#d72660',
                cursor: 'pointer',
                boxShadow: 'none',
                pointerEvents: 'auto',
                transition: 'color 0.3s',
              }}
              onClick={() => setOpenPressed(true)}
            >
              Open
            </button>
            {openPressed && (
              <div className="hearts-burst">
                {[0,1,2].map(i => (
                  <img
                    key={i}
                    src="/heart.png"
                    alt="heart"
                    className={`burst-heart burst-heart-${i}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="center-column">
          {!coinInserted && (
            <div className="insert-coin-title">Insert the coin here</div>
          )}
          {countdown !== null && (
            <div className="countdown-overlay">
              <div className="heart-row pixel-heart-row">
                {[0, 1, 2].map((i) => (
                  <img
                    key={i}
                    src="/heart.png"
                    alt="heart"
                    className={`countdown-heart${countdown <= i + 1 ? ' filled' : ''}`}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="camera-box">
            {/* Water fill animation overlay */}
            <div className={`water-fill${coinInserted || showStart ? ' water-fill-animate' : ''}`}></div>
            {showCamera ? (
              <>
                {isShooting ? (
                  <>
                    <video
                      ref={videoRef}
                      className="webcam-video"
                      autoPlay
                      playsInline
                      style={{ filter: FILTERS[filterIdx].css }}
                    />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                  </>
                ) : null}
              </>
            ) : showStart ? (
              <button className="start-message pressable" onClick={handleStart}>
                Okiee, let's start!
              </button>
            ) : (
              <>
                <img
                  src="/Page_2___Pixel_Coin_Vector_Art__Icons__and_Graphics_for_Free_Download-removebg-preview.png"
                  alt="Coin"
                  className={`coin-image${coinInserted ? ' coin-inserting' : ''}`}
                />
                <div className="coin-inserter">
                  <div className="coin-slot"></div>
                  <div className="coin-label" onClick={handleInsertCoin}>Insert Coin</div>
                </div>
              </>
            )}
          </div>
          {showCamera && !sessionComplete && (
            <>
              <div className="filter-controls">
                <button className="filter-btn" onClick={handlePrevFilter}>&lt;</button>
                <span className="filter-name">{FILTERS[filterIdx].name}</span>
                <button className="filter-btn" onClick={handleNextFilter}>&gt;</button>
              </div>
              <div className="camera-icon" onClick={handleCameraClick}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 7V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V7C20 5.89543 19.1046 5 18 5H15.8284C15.298 5 14.7893 4.78929 14.4142 4.41421L13.5858 3.58579C13.2107 3.21071 12.702 3 12.1716 3H11.8284C11.298 3 10.7893 3.21071 10.4142 3.58579L9.58579 4.41421C9.21071 4.78929 8.702 5 8.17157 5H6C4.89543 5 4 5.89543 4 7Z" stroke="#d72660" strokeWidth="2"/>
                  <circle cx="12" cy="14" r="4" stroke="#d72660" strokeWidth="2"/>
                </svg>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default App
