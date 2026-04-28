export default function StorySection() {
  return (
    <section className="story" id="story">
      <div className="wrap">
        <div className="story-grid">
          {/* Photo */}
          <div className="story-photo reveal">
            <span className="corner tl" />
            <span className="corner br" />
            <img src="/bob-pierce.png" alt="Bob Pierce, owner of Eyedeal Optical" />
            <div className="badge">
              <div className="l1">Bob <em>Pierce</em></div>
              <div className="l2">Owner · Optician</div>
            </div>
          </div>

          {/* Content */}
          <div className="story-content reveal delay-1">
            <span className="eyebrow">Our Story</span>
            <h2>
              Locally owned &amp; <br />
              <em>crafted</em> in Dubuque
            </h2>
            <p>
              Eyedeal Optical is locally owned and operated by Bob Pierce. After beginning his career with a
              national eyewear chain, Bob discovered the importance of local business to his community and saw an
              opportunity to bring superior quality, better service and lower cost to his friends and neighbors.
              His vision was realized in 1997 with the opening of Eyedeal Optical. He hand-picks his incredible
              selection of frames and cuts all lenses on the premises so each pair of glasses is truly locally
              crafted. Bob is a member of the Lions Club International and works with the local school district
              to provide free exams and glasses to children in need.
            </p>
            <p>
              As a company, we strive to give every patient the most comprehensive eye care available, exceptional
              customer service, the latest in lens technology and an incredible selection of frames. We not only
              want our clients to look great and have superior vision, we want them to leave with the confidence
              and knowledge of an informed consumer.
            </p>
            <div className="story-pillars">
              <div className="pillar">
                <svg className="ico" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M18 4l4 8 9 1-6.5 6.5L26 28l-8-4-8 4 1.5-8.5L5 13l9-1z" />
                </svg>
                <h4>Lions Club International</h4>
                <p>Active member supporting vision causes worldwide.</p>
              </div>
              <div className="pillar">
                <svg className="ico" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M6 28V12l12-7 12 7v16" /><path d="M14 28v-9h8v9" />
                </svg>
                <h4>Schools Partnership</h4>
                <p>Free eye exams and glasses for local children in need.</p>
              </div>
              <div className="pillar">
                <svg className="ico" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M18 30s-10-6-10-14a6 6 0 0 1 10-4 6 6 0 0 1 10 4c0 8-10 14-10 14z" />
                </svg>
                <h4>Neighborhood First</h4>
                <p>A boutique studio that treats every visit like a house call.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
