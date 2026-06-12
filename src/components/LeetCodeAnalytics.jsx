import React, { useState, useEffect } from 'react';

const LeetCodeAnalytics = () => {
  const username = "isha282006";
  const [profileData, setProfileData] = useState(null);
  const [contestData, setContestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user statistics and calendar from Vercel hosted API for speed and reliability
        const profileRes = await fetch(`https://leetcode-api-faisal.vercel.app/${username}`);
        if (!profileRes.ok) {
          throw new Error('Failed to fetch LeetCode profile statistics.');
        }
        const profileJson = await profileRes.json();

        // Fetch contest data (falls back quietly to defaults if Render API is sleeping or fails)
        let contestJson = null;
        try {
          const contestRes = await fetch(`https://alfa-leetcode-api.onrender.com/userContestRankingInfo/${username}`);
          if (contestRes.ok) {
            contestJson = await contestRes.json();
          }
        } catch (e) {
          console.warn("Contest endpoint error, falling back to empty contest details:", e);
        }

        setProfileData(profileJson);
        setContestData(contestJson);
      } catch (err) {
        console.error("Error loading LeetCode data:", err);
        setError(err.message || 'An unexpected error occurred while fetching LeetCode analytics.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  // Observer to trigger scroll reveals after loading is complete
  useEffect(() => {
    if (loading || error) return;

    const revealElements = document.querySelectorAll('#leetcode .reveal-fade, #leetcode .reveal-left, #leetcode .reveal-right, #leetcode .reveal-up');
    
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, error]);

  // Streak Calculation helper
  const calculateStreaks = (submissionCalendar) => {
    if (!submissionCalendar || Object.keys(submissionCalendar).length === 0) {
      return { currentStreak: 0, maxStreak: 0 };
    }

    // Convert timestamps (in seconds) to YYYY-MM-DD date strings
    const dates = Object.keys(submissionCalendar)
      .map(ts => {
        const d = new Date(parseInt(ts) * 1000);
        return d.toISOString().split('T')[0];
      });

    // Deduplicate and sort dates ascending
    const uniqueDates = [...new Set(dates)].sort();

    let maxStreak = 0;
    let tempStreak = 0;

    const isConsecutive = (d1, d2) => {
      const date1 = new Date(d1);
      const date2 = new Date(d2);
      const diff = Math.abs(date2 - date1);
      return diff <= 86400000 * 1.5 && diff >= 86400000 * 0.5; // Check if roughly 1 day
    };

    if (uniqueDates.length > 0) {
      tempStreak = 1;
      maxStreak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        if (isConsecutive(uniqueDates[i - 1], uniqueDates[i])) {
          tempStreak++;
        } else {
          if (tempStreak > maxStreak) maxStreak = tempStreak;
          tempStreak = 1;
        }
      }
      if (tempStreak > maxStreak) maxStreak = tempStreak;
    }

    // Current Streak calculation
    let currentStreak = 0;
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const lastDateStr = uniqueDates[uniqueDates.length - 1];
    if (lastDateStr === todayStr || lastDateStr === yesterdayStr) {
      let curr = 1;
      for (let i = uniqueDates.length - 1; i > 0; i--) {
        if (isConsecutive(uniqueDates[i - 1], uniqueDates[i])) {
          curr++;
        } else {
          break;
        }
      }
      currentStreak = curr;
    }

    return { currentStreak, maxStreak };
  };

  // Generate heatmap data
  const getHeatmapData = (submissionCalendar) => {
    const data = [];
    const today = new Date();

    const startDate = new Date();
    startDate.setDate(today.getDate() - 364);

    // Align start date to preceding Sunday
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const calendarMap = {};
    if (submissionCalendar) {
      Object.entries(submissionCalendar).forEach(([ts, count]) => {
        const dateStr = new Date(parseInt(ts) * 1000).toISOString().split('T')[0];
        calendarMap[dateStr] = (calendarMap[dateStr] || 0) + count;
      });
    }

    const currentDate = new Date(startDate);
    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = calendarMap[dateStr] || 0;
      data.push({
        date: dateStr,
        count: count,
        dayName: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
        formattedDate: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
  };

  // Format timestamp helper
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const subDate = new Date(parseInt(timestamp) * 1000);
    const diffMs = now - subDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Cell coloring helper
  const getHeatmapColor = (count) => {
    if (count === 0) return 'rgba(255, 255, 255, 0.03)';
    if (count <= 2) return 'rgba(212, 175, 55, 0.25)';
    if (count <= 5) return 'rgba(212, 175, 55, 0.55)';
    return '#FFD700'; // Bright Gold
  };

  const getSubStatusColor = (status) => {
    if (status === 'Accepted') return 'rgba(212, 175, 55, 0.15)';
    return 'rgba(255, 255, 255, 0.05)';
  };

  const getSubStatusTextColor = (status) => {
    if (status === 'Accepted') return 'var(--gold)';
    return '#A0A0A0';
  };

  // SVG circular dial parameters
  const radius = 40;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;

  if (loading) {
    return (
      <section id="leetcode" className="leetcode-section section-container">
        <div className="container">
          <div className="section-header-center">
            <span className="section-tag reveal-fade reveal-active">ANALYTICS</span>
            <h2 className="section-title reveal-fade reveal-active">LeetCode Progress</h2>
          </div>
          <div className="leetcode-loading-skeleton glass-card">
            <div className="skeleton-loader-bar"></div>
            <div className="skeleton-cards-grid">
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
            </div>
            <div className="skeleton-heatmap"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !profileData) {
    return (
      <section id="leetcode" className="leetcode-section section-container">
        <div className="container">
          <div className="section-header-center">
            <span className="section-tag">ANALYTICS</span>
            <h2 className="section-title">LeetCode Progress</h2>
          </div>
          <div className="leetcode-error-card glass-card">
            <div className="error-icon-wrapper">
              <i className="fa-solid fa-circle-exclamation"></i>
            </div>
            <h3>Unable to fetch live LeetCode stats</h3>
            <p>{error || "Please verify network connectivity or check back later."}</p>
            <button onClick={() => window.location.reload()} className="cta-button primary-cta">
              TRY AGAIN <i className="fa-solid fa-rotate-right"></i>
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Extract variables
  const {
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
    totalQuestions,
    easyQuestions = 949, // Fallback standard totals if not returned
    mediumQuestions = 2067,
    hardQuestions = 942,
    ranking,
    contributionPoint,
    submissionCalendar
  } = profileData;

  const totalEasy = profileData.totalEasy || easyQuestions;
  const totalMedium = profileData.totalMedium || mediumQuestions;
  const totalHard = profileData.totalHard || hardQuestions;

  const easyPercentage = Math.round((easySolved / totalEasy) * 100);
  const mediumPercentage = Math.round((mediumSolved / totalMedium) * 100);
  const hardPercentage = Math.round((hardSolved / totalHard) * 100);

  const { currentStreak, maxStreak } = calculateStreaks(submissionCalendar);
  const heatmapCells = getHeatmapData(submissionCalendar);

  // Contest variables
  const contestInfo = contestData?.userContestRanking;
  const contestRating = contestInfo ? Math.round(contestInfo.rating) : '1500';
  const contestRanking = contestInfo ? contestInfo.globalRanking : 'Unrated';
  const contestAttendance = contestData?.userContestRankingHistory?.filter(c => c.attended).length || 0;

  // Group cells into columns of 7 elements (weeks)
  const columns = [];
  for (let i = 0; i < heatmapCells.length; i += 7) {
    columns.push(heatmapCells.slice(i, i + 7));
  }

  // Months labels for the calendar top header
  const getMonthLabels = () => {
    const labels = [];
    let prevMonth = '';
    columns.forEach((col, colIndex) => {
      const date = new Date(col[0].date);
      const monthStr = date.toLocaleDateString('en-US', { month: 'short' });
      if (monthStr !== prevMonth && colIndex % 4 === 0) {
        labels.push({ text: monthStr, index: colIndex });
        prevMonth = monthStr;
      }
    });
    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <section id="leetcode" className="leetcode-section section-container">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header-center reveal-fade">
          <span className="section-tag">ANALYTICS</span>
          <h2 className="section-title">LeetCode Stats</h2>
          <p className="section-subtitle">
            Synchronized live stats highlighting problem-solving, active coding streaks, and recent submission logs.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="leetcode-grid">
          
          {/* Main Solved Chart Card */}
          <div className="leetcode-card glass-card span-col-2 reveal-left">
            <h3 className="card-heading"><i className="fa-solid fa-chart-pie card-icon"></i> Problems Breakdown</h3>
            <div className="solved-charts-container">
              
              {/* Radial Solved stats */}
              <div className="solved-main-dial">
                <svg className="solved-svg" width="120" height="120">
                  <circle cx="60" cy="60" r="50" className="dial-bg-circle" />
                  <circle 
                    cx="60" 
                    cy="60" 
                    r="50" 
                    className="dial-fill-circle"
                    style={{
                      strokeDasharray: 2 * Math.PI * 50,
                      strokeDashoffset: 2 * Math.PI * 50 * (1 - (totalSolved / (totalEasy + totalMedium + totalHard)))
                    }}
                  />
                </svg>
                <div className="dial-content">
                  <span className="dial-number">{totalSolved}</span>
                  <span className="dial-label">Solved</span>
                </div>
              </div>

              {/* Progress Dials per category */}
              <div className="difficulty-dials-list">
                
                {/* Easy Dial */}
                <div className="difficulty-dial-item">
                  <div className="dial-svg-wrapper">
                    <svg width="60" height="60">
                      <circle cx="30" cy="30" r={radius - 15} className="dial-sub-bg" strokeWidth="4" />
                      <circle 
                        cx="30" 
                        cy="30" 
                        r={radius - 15} 
                        className="dial-sub-fill easy-fill" 
                        strokeWidth="4"
                        style={{
                          strokeDasharray: 2 * Math.PI * (radius - 15),
                          strokeDashoffset: 2 * Math.PI * (radius - 15) * (1 - easySolved / totalEasy)
                        }}
                      />
                    </svg>
                    <span className="dial-sub-percentage">{easyPercentage}%</span>
                  </div>
                  <div className="difficulty-meta">
                    <span className="difficulty-name easy-text">Easy</span>
                    <span className="difficulty-fraction">{easySolved}/{totalEasy}</span>
                  </div>
                </div>

                {/* Medium Dial */}
                <div className="difficulty-dial-item">
                  <div className="dial-svg-wrapper">
                    <svg width="60" height="60">
                      <circle cx="30" cy="30" r={radius - 15} className="dial-sub-bg" strokeWidth="4" />
                      <circle 
                        cx="30" 
                        cy="30" 
                        r={radius - 15} 
                        className="dial-sub-fill medium-fill" 
                        strokeWidth="4"
                        style={{
                          strokeDasharray: 2 * Math.PI * (radius - 15),
                          strokeDashoffset: 2 * Math.PI * (radius - 15) * (1 - mediumSolved / totalMedium)
                        }}
                      />
                    </svg>
                    <span className="dial-sub-percentage">{mediumPercentage}%</span>
                  </div>
                  <div className="difficulty-meta">
                    <span className="difficulty-name medium-text">Medium</span>
                    <span className="difficulty-fraction">{mediumSolved}/{totalMedium}</span>
                  </div>
                </div>

                {/* Hard Dial */}
                <div className="difficulty-dial-item">
                  <div className="dial-svg-wrapper">
                    <svg width="60" height="60">
                      <circle cx="30" cy="30" r={radius - 15} className="dial-sub-bg" strokeWidth="4" />
                      <circle 
                        cx="30" 
                        cy="30" 
                        r={radius - 15} 
                        className="dial-sub-fill hard-fill" 
                        strokeWidth="4"
                        style={{
                          strokeDasharray: 2 * Math.PI * (radius - 15),
                          strokeDashoffset: 2 * Math.PI * (radius - 15) * (1 - hardSolved / (totalHard || 1))
                        }}
                      />
                    </svg>
                    <span className="dial-sub-percentage">{hardPercentage}%</span>
                  </div>
                  <div className="difficulty-meta">
                    <span className="difficulty-name hard-text">Hard</span>
                    <span className="difficulty-fraction">{hardSolved}/{totalHard}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* User Rankings & Streaks Cards */}
          <div className="leetcode-card glass-card reveal-right">
            <h3 className="card-heading"><i className="fa-solid fa-trophy card-icon"></i> Contest Performance</h3>
            <div className="stats-row">
              <div className="stat-box-inner">
                <span className="stat-box-label">Contest Rating</span>
                <span className="stat-box-value highlight-gold">{contestRating}</span>
              </div>
              <div className="stat-box-inner">
                <span className="stat-box-label">Global Rank</span>
                <span className="stat-box-value">{contestRanking}</span>
              </div>
            </div>
            <div className="leetcode-simple-bar-wrapper">
              <div className="simple-bar-meta">
                <span>Contests Attended</span>
                <span>{contestAttendance}</span>
              </div>
              <div className="simple-bar-track">
                <div className="simple-bar-fill" style={{ width: `${Math.min(contestAttendance * 10, 100)}%` }}></div>
              </div>
            </div>
          </div>

          <div className="leetcode-card glass-card reveal-right">
            <h3 className="card-heading"><i className="fa-solid fa-fire card-icon"></i> Activity Streaks</h3>
            <div className="stats-row">
              <div className="stat-box-inner">
                <span className="stat-box-label">Current Streak</span>
                <span className="stat-box-value highlight-gold">{currentStreak} <span className="stat-unit">days</span></span>
              </div>
              <div className="stat-box-inner">
                <span className="stat-box-label">Maximum Streak</span>
                <span className="stat-box-value">{maxStreak} <span className="stat-unit">days</span></span>
              </div>
            </div>
            <div className="leetcode-simple-bar-wrapper">
              <div className="simple-bar-meta">
                <span>Contribution Points</span>
                <span>{contributionPoint}</span>
              </div>
              <div className="simple-bar-track">
                <div className="simple-bar-fill" style={{ width: `${Math.min((contributionPoint / 1500) * 100, 100)}%` }}></div>
              </div>
            </div>
          </div>

          {/* Submission calendar Heatmap */}
          <div className="leetcode-card glass-card span-col-full reveal-up">
            <h3 className="card-heading"><i className="fa-solid fa-calendar-days card-icon"></i> Submission Calendar</h3>
            
            <div className="heatmap-outer-wrapper">
              <div className="heatmap-container">
                
                {/* Months labels */}
                <div className="heatmap-months-header">
                  {monthLabels.map((label, idx) => (
                    <span 
                      key={idx} 
                      className="heatmap-month-label"
                      style={{ left: `calc(${label.index} * 14px + 30px)` }}
                    >
                      {label.text}
                    </span>
                  ))}
                </div>

                <div className="heatmap-grid-layout">
                  {/* Days labels */}
                  <div className="heatmap-days-column">
                    <span>Sun</span>
                    <span>Tue</span>
                    <span>Thu</span>
                    <span>Sat</span>
                  </div>

                  {/* Columns */}
                  <div className="heatmap-weeks-columns">
                    {columns.map((week, colIdx) => (
                      <div key={colIdx} className="heatmap-week-column">
                        {week.map((day, cellIdx) => (
                          <div
                            key={cellIdx}
                            className="heatmap-cell"
                            style={{ backgroundColor: getHeatmapColor(day.count) }}
                            onMouseEnter={(e) => {
                              const rect = e.target.getBoundingClientRect();
                              setActiveTooltip({
                                date: day.formattedDate,
                                count: day.count,
                                top: rect.top - 45 + window.scrollY,
                                left: rect.left + rect.width / 2 + window.scrollX
                              });
                            }}
                            onMouseLeave={() => setActiveTooltip(null)}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Heatmap Legend */}
            <div className="heatmap-legend">
              <span className="legend-text">Less</span>
              <div className="legend-cells">
                <div className="legend-cell" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}></div>
                <div className="legend-cell" style={{ backgroundColor: 'rgba(212, 175, 55, 0.25)' }}></div>
                <div className="legend-cell" style={{ backgroundColor: 'rgba(212, 175, 55, 0.55)' }}></div>
                <div className="legend-cell" style={{ backgroundColor: '#FFD700' }}></div>
              </div>
              <span className="legend-text">More</span>
            </div>
          </div>


        </div>

        {/* LeetCode Button */}
        <div className="leetcode-profile-action reveal-fade">
          <a 
            href={`https://leetcode.com/u/${username}/`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="cta-button primary-cta"
          >
            LEETCODE PROFILE <i className="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>

      </div>

      {/* Dynamic Heatmap Tooltip */}
      {activeTooltip && (
        <div 
          className="heatmap-tooltip"
          style={{
            top: `${activeTooltip.top}px`,
            left: `${activeTooltip.left}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <strong>{activeTooltip.count} submission{activeTooltip.count !== 1 ? 's' : ''}</strong> on {activeTooltip.date}
        </div>
      )}
    </section>
  );
};

export default LeetCodeAnalytics;
