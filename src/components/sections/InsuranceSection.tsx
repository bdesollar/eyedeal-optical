const plans = ['Eyemed', 'VSP', 'SISCO', 'Avesis', 'Health Choices', 'Care Credit', '+ many more']

export default function InsuranceSection() {
  return (
    <section className="insurance" id="insurance">
      <div className="wrap">
        <div className="row">
          <h4>Insurance plans we <em>accept</em>.</h4>
          <div className="insurance-logos">
            {plans.map((p) => (
              <span key={p} className="ins-pill">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
