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
            <h2>A career with the<br />chains taught Bob<br />what mattered <em>most</em>.</h2>
            <p>
              After years with a national eyewear chain, <strong>Bob Pierce</strong> saw something the corporate manuals had missed — that Dubuque deserved better quality, kinder service, and a fairer price.
            </p>
            <p>
              So in 1997, he opened Eyedeal Optical on Pennsylvania Avenue. Nearly three decades later, Bob still hand-picks every frame in the studio and personally cuts every lens on the premises. Each pair of glasses that leaves the door is, in the truest sense, locally made.
            </p>
            <div className="story-quote">
              <p>"My patients aren't customers. They're friends and neighbors — and I want them looking great, seeing clearly, and walking out feeling like an informed consumer."</p>
              <div className="attr">— Bob Pierce, Owner</div>
            </div>
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
