import { addMonths, startOfMonth, ymd } from '../../lib/appointmentTime'

type Props = {
  month: Date
  selected: string
  onMonthChange: (d: Date) => void
  onSelectDay: (ymd: string) => void
  /** Dates (yyyy-mm-dd) that have at least one event */
  markedDays?: Set<string>
  minYmd: string
}

export default function MonthGrid({ month, selected, onMonthChange, onSelectDay, markedDays, minYmd }: Props) {
  const start = startOfMonth(month)
  const startDow = start.getDay()
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const label = month.toLocaleString(undefined, { month: 'long', year: 'numeric' })

  const cells: (number | null)[] = []
  for (let i = 0; i < startDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="appt-cal">
      <div className="appt-cal-head">
        <button type="button" className="appt-cal-nav" onClick={() => onMonthChange(addMonths(month, -1))} aria-label="Previous month">
          ‹
        </button>
        <div className="appt-cal-title">{label}</div>
        <button type="button" className="appt-cal-nav" onClick={() => onMonthChange(addMonths(month, 1))} aria-label="Next month">
          ›
        </button>
      </div>
      <div className="appt-cal-dow" aria-hidden>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((c, i) => (
          <span key={i}>
            {c}
          </span>
        ))}
      </div>
      <div className="appt-cal-grid">
        {cells.map((d, i) => {
          if (d == null) return <span key={`e-${i}`} className="appt-cal-cell appt-cal-cell--empty" />
          const date = new Date(month.getFullYear(), month.getMonth(), d)
          const key = ymd(date)
          const isSel = key === selected
          const isPast = key < minYmd
          const hasMark = markedDays?.has(key)
          return (
            <button
              key={key}
              type="button"
              disabled={isPast}
              className={`appt-cal-cell appt-cal-cell--day${isSel ? ' is-selected' : ''}${hasMark ? ' has-mark' : ''}`}
              onClick={() => onSelectDay(key)}
            >
              {d}
            </button>
          )
        })}
      </div>
    </div>
  )
}
