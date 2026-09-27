import { useState } from "react"
import "./index.css"

function App() {
  const [url, setUrl] = useState("")
  const [review, setReview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleRoast() {
    if (url.trim() === "") {
      setError("Please enter your portfolio URL.")
      return
    }

    setLoading(true)
    setError("")
    setReview(null)

    try {
      const response = await fetch("http://roast-my-portfolio-6smm.onrender.com/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: url
        })
      })

      if (!response.ok) {
        throw new Error("Something went wrong.")
      }

      const data = await response.json()

      setReview(data.review)
    } catch (error) {
      setError(
        "Unable to analyze the portfolio. Make sure the backend is running."
      )
    }

    setLoading(false)
  }

  return (
    <div className="app">

      <header className="navbar">
        <div className="logo">
          🔥 Roast<span>MyPortfolio</span>
        </div>

        <div className="badge">
          ✨ AI Powered
        </div>
      </header>

      <main className="hero">

        <div className="hero-content">

          <div className="fire">🔥</div>

          <h1>
            Roast My<br />
            <span>Portfolio.</span>
          </h1>

          <p className="description">
            Drop your portfolio URL and let AI review your
            design, performance, accessibility and UX.
          </p>

          <div className="url-form">

            <input
              className="url-input"
              type="text"
              placeholder="https://yourportfolio.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <button
              className="roast-button"
              onClick={handleRoast}
              disabled={loading}
            >
              {loading ? "🔥 Roasting..." : "🔥 Roast My Portfolio"}
            </button>

          </div>

          {error && (
            <p
              style={{
                marginTop: "20px",
                color: "#ff4444",
                fontWeight: "bold"
              }}
            >
              {error}
            </p>
          )}

          {review && (
            <div className="review-dashboard">

              <h2>🔥 Your Portfolio Roast</h2>

              <div className="score-grid">

                <div className="score-card">
                  <h3>🎨 UI / UX</h3>
                  <div className="score">
                    {review.ui_ux_score}
                    <span>/100</span>
                  </div>
                </div>

                <div className="score-card">
                  <h3>⚡ Performance</h3>
                  <div className="score">
                    {review.performance_score}
                    <span>/100</span>
                  </div>
                </div>

                <div className="score-card">
                  <h3>♿ Accessibility</h3>
                  <div className="score">
                    {review.accessibility_score}
                    <span>/100</span>
                  </div>
                </div>

              </div>

              <div className="review-section">

                <h3>💪 Strengths</h3>

                <ul>
                  {review.strengths.map((strength, index) => (
                    <li key={index}>
                      {strength}
                    </li>
                  ))}
                </ul>

              </div>

              <div className="review-section">

                <h3>🔥 Improvement Suggestions</h3>

                <ul>
                  {review.suggestions.map((suggestion, index) => (
                    <li key={index}>
                      {suggestion}
                    </li>
                  ))}
                </ul>

              </div>

            </div>
          )}

          <div className="features">

            <div className="feature">
              <h3>🎨 UI / UX</h3>
              <p>
                Analyze your design, layout and user experience.
              </p>
            </div>

            <div className="feature">
              <h3>⚡ Performance</h3>
              <p>
                Check loading speed and website optimization.
              </p>
            </div>

            <div className="feature">
              <h3>♿ Accessibility</h3>
              <p>
                Find ways to make your portfolio accessible.
              </p>
            </div>

          </div>

        </div>

      </main>

      <footer>
        Built with React + AI
      </footer>

    </div>
  )
}

export default App