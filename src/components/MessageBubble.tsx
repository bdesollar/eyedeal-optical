import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

type ChatRole = 'user' | 'assistant'

type ChatMessage = { id: string; role: ChatRole; text: string; createdAt: number }

const REPLIES = {
  hours: `**Hours**
• Monday–Friday: 9:00 a.m. to 5:00 p.m.
• Saturday: 9:00 a.m. to 12:00 p.m.
• Sunday: closed

We’re a small studio—if you’re unsure (holiday week, etc.), a quick call is always best: (563) 557-0995.`,

  contact: `**Contact & location**
• **Phone:** (563) 557-0995
• **Email:** eyedealoptical1997@yahoo.com
• **Address:** 2644 Pennsylvania Ave., Dubuque, IA 52001

You can also use **Visit Us** on this page to request an appointment or send a message.`,

  about: `**About Eyedeal**
We’re a **locally owned** boutique run by **Bob Pierce**, here since **1997**. Bob chooses the frame lines, and we cut a lot of lenses on-site, so your glasses are **locally fit and crafted**—not a one-size-fits-all chain. We work with the community (including the schools and the Lions) and treat patients like **friends and neighbors**.`,

  appointment: `**Appointments & requests**
To book a visit, ask about an exam, or get help with **frames, lenses, or adjustments**: use the **Book Appointment** control on this page, or call **(563) 557-0995** and we’ll get you on the right track. We’ll follow up the way you prefer.`,

  insurance: `**Insurance & plans**
We work with many vision plans and insurers (VSP, Eyemed, and others, depending on your plan). **Coverage and eligibility vary**, so the fastest way to know what works for *you* is a short call: **(563) 557-0995**—or bring your card when you come in.`,

  services: `**What we do**
**Eye exams,** frame **fitting & selection,** **contact** lens work, **lens** design and options, **repairs and adjustments,** and **sunglasses**—all with a focus on clear vision and a look you love. We’ll walk you through choices so you know what you’re getting.

Questions about something specific? Call the studio at **(563) 557-0995**—we’re happy to help.`,

  greeting: `Hi! You can ask about **studio hours,** **phone, email & address,** **what we offer,** or **how to book.** I’ll answer from the same info we share on the site.`,

  thanks: `You’re welcome! If you need more detail, **(563) 557-0995** is the best line, or use **Visit Us** on this page.`,

  goodbye: `Thanks for visiting Eyedeal Optical’s site—we hope to see you in the studio!`,

  help: `Try one of these ideas:
• “**What are your hours?**”
• “**What’s the phone / address?**”
• “**How do I book an appointment?**”
• “**Do you take insurance?**”

I match your message to the answers we already publish—**no off-site tools.**`,

  fallback: `I don’t have a scripted answer for that, but the studio can help directly.

**Call (563) 557-0995** for the quickest reply, or use **Visit Us** to send a note. You’ll also find **Our Story,** **Services,** and **Lens** sections on this page.`,
} as const

const OPEN_LABEL = 'Open quick answers chat'

/** Collapse multiline to single string for message bubble—strip ** markdown for plain text */
function toPlain(s: string) {
  return s
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .split('\n')
    .map((l) => l.replace(/^•\s*/, '• '))
    .join('\n')
    .trim()
}

function isAppointmentQuery(t: string) {
  if (/\bappoint(ment|ments)?\b|re-?schedul|reserv(ation|e|ing)\b/.test(t)) return true
  if (/\b(eye exam|exams? for|get (a|an) exam|make (a|an) exam|need (a|an) exam|walk[- ]?in|come in)\b/.test(t)) return true
  if (/\bcontact lens|contact lenses|new contacts?\b/.test(t)) return true
  if (
    /\b(tighten|repaired?|re-?pair|adjust(ment|s)?|screws?|temples?|nose|pads?|frame fitting|fix my|fix (a |the )?frame|broken (frames?|glasses?))\b/.test(t)
  )
    return true
  if (/\b(broken|bent) (frame|glasses?|hinge|pair|bridge)\b/.test(t)) return true
  if (/\bwhen can i (come|book|get|make)|can i (book|come|get|make|schedule)|could i (book|get)\b/.test(t)) return true
  if (/\bneed to (come|get|book)|make a visit|book (a|an) (visit|exam|time|slot|frame)|schedule (a|an|my)\b/.test(t)) return true
  if (/\bvisit( the| your)? (studio|shop|store|you|location)\b/.test(t)) return true
  if (/\bsee( the)? (optician|optometrist|doctor|dr|bob)\b/.test(t)) return true
  if (/(^|\s)book(ing|)(\s|!|\.)/.test(t) && /\b(exam|frame|time|us|it|visits?|appt|slot)\b/.test(t)) return true
  if (/^book$|^booking$/i.test(t.trim())) return true
  return false
}

function isHoursQuery(t: string) {
  if (
    /\b(hour|hours|opening|what time|how late|time(s|) (is|are)|we open|are you (open|closed|there)|open (saturday|sunday|monday|today|tomorrow)|closed (sunday|mon|today)|weekend|saturdays?|sundays?|weekday|9\s*[-–:]?\s*5|9\s*[-–:]?\s*12|before (i|we) (come|arrive|stop)|holiday hours)\b/.test(
      t,
    )
  )
    return true
  if (/\bwhen (are|do) you (open|close|shut|there)\b/.test(t)) return true
  if (/\b(am|pm|a\.?m|p\.?m|morning|afternoon|noon)\b/.test(t) && /\b(you|store|open|close|till?|'?til|through)\b/.test(t)) return true
  return false
}

function isContactQuery(t: string) {
  if (/\b(address|location|where to (go|find)|dubuque|pennsylvania|ia\s*52001|zip|map|landline|phone( number| #)?|call (you|us|the|eyedeal|here)|reaching|reach( you| us)?|@|e-?mail|yahoo|mailto|get in touch|visiting|directions?|mail(ing|ed)?( address| us)?\b|how (do|can) (i|we) (call|email|text|reach|contact|find you))\b/i.test(
    t,
  ))
    return true
  if (/563[.\s-]?\d{3}[.\s-]?\d{4}/.test(t)) return true
  if (t.includes('@') && t.includes('.')) return true
  return false
}

function isAboutQuery(t: string) {
  return /\b(bob|pierce|own(ed|s|er)?\b|locally|since|1997|about (us|eyedeal|you|this|the studio)|who (is|own|run|founded|started)|our story|lions|school( district|s)?|kids? in need|neighbors?|boutique|not a chain|history|years? (in dubuque|here))\b/.test(
    t,
  )
}

function isServicesQuery(t: string) {
  return (
    /\b(what (do|does) you|do you (offer|have|do|carry|sell|provide)|kinds? of|lens(es)?\b|frames?|eyeglass|sunglass(es)?|progressive|bifocal|trifocal|optical services|our services|lens technology|lens (options|types?)|nose|pads?)\b/i.test(
      t,
    ) || /\b(services?|eyewear|tune[- ]?up|anti[- ]?reflect|blue light|polar)\b/i.test(t)
  )
}

function isHelpQuery(t: string) {
  return /\b(help|how does this (chat|work)|what can (i|you) (ask|type|say)|suggest(ions|)|examples?|hint)\b/i.test(
    t,
  )
}

function getReplyForMessage(raw: string): string {
  const t = raw.toLowerCase().trim()
  if (!t) return toPlain(REPLIES.fallback)

  if (/^(hi|hello|hey|hiya|good (morning|afternoon|evening))\W*(!|\?|.)?$/.test(t)) {
    return toPlain(REPLIES.greeting)
  }
  if (/^(thanks?|thank you|thx|appreciate it|much appreciated)\W*$/i.test(raw.trim())) {
    return toPlain(REPLIES.thanks)
  }
  if (/^(bye|goodbye|see you|later|farewell|have a good one)\W*$/i.test(t)) {
    return toPlain(REPLIES.goodbye)
  }

  if (/\b(insur|vsp|eyemed|sisco|avesis|benefits|vision plan|coverage|medicaid|medicare|plan)\b/i.test(t)) {
    return toPlain(REPLIES.insurance)
  }

  if (isAppointmentQuery(t)) {
    return toPlain(REPLIES.appointment)
  }
  if (isHoursQuery(t)) {
    return toPlain(REPLIES.hours)
  }
  if (isContactQuery(t)) {
    return toPlain(REPLIES.contact)
  }
  if (isAboutQuery(t)) {
    return toPlain(REPLIES.about)
  }
  if (isServicesQuery(t)) {
    return toPlain(REPLIES.services)
  }
  if (isHelpQuery(t)) {
    return toPlain(REPLIES.help)
  }

  return toPlain(REPLIES.fallback)
}

export default function MessageBubble() {
  const loc = useLocation()
  const hidden = loc.pathname.startsWith('/admin')
  const panelId = useId()
  const listRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'w',
      role: 'assistant',
      text: toPlain(
        "Hi! Ask me about **hours,** **contact & address,** **the studio,** or **bookings**—I’ll match your question to our posted answers. No sign-up required.",
      ),
      createdAt: 0,
    },
  ])
  const [sending, setSending] = useState(false)

  const scrollToEnd = useCallback(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  useEffect(() => {
    if (open) scrollToEnd()
  }, [open, messages, sending, scrollToEnd])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (hidden) return null

  function send() {
    const t = input.trim()
    if (!t || sending) return
    const userId = `u-${Date.now()}`
    setMessages((m) => [
      ...m,
      { id: userId, role: 'user', text: t, createdAt: Date.now() },
    ])
    setInput('')
    setSending(true)
    const text = getReplyForMessage(t)
    window.setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text,
          createdAt: Date.now(),
        },
      ])
      setSending(false)
    }, 400)
  }

  return (
    <div className="msg-bubble-root" data-open={open}>
      <div
        className="msg-bubble-panel"
        id={panelId}
        role="dialog"
        aria-label="Quick answers for Eyedeal Optical"
        hidden={!open}
        data-open={open}
      >
        <div className="msg-bubble-panel-inner">
          <div className="msg-bubble-header">
            <div>
              <p className="msg-bubble-title">Eyedeal Optical</p>
              <p className="msg-bubble-sub">Quick answers</p>
            </div>
            <button type="button" className="msg-bubble-close" onClick={() => setOpen(false)} aria-label="Close chat">
              ×
            </button>
          </div>
          <div className="msg-bubble-messages" ref={listRef}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  m.role === 'user' ? 'msg-bubble-bubble user' : 'msg-bubble-bubble assistant msg-bubble-body'
                }
              >
                {m.text}
              </div>
            ))}
            {sending && (
              <div className="msg-bubble-bubble assistant msg-bubble-typing" aria-hidden>
                <span />
                <span />
                <span />
              </div>
            )}
          </div>
          <form
            className="msg-bubble-form"
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
          >
            <input
              type="text"
              className="msg-bubble-input"
              placeholder="Ask about hours, contact, or the studio…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              autoComplete="off"
            />
            <button type="submit" className="msg-bubble-send" disabled={sending || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      </div>

      <button
        type="button"
        className="msg-bubble-trigger"
        aria-haspopup="dialog"
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        title={open ? 'Close chat' : 'Quick answers'}
        aria-label={open ? 'Close message chat' : OPEN_LABEL}
      >
        <svg
          className="msg-bubble-trigger-ico"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22l5.1-1.1A8.4 8.4 0 0 0 7.9 20Z" />
        </svg>
      </button>
    </div>
  )
}
