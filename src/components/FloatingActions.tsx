type Props = {
  numbers: string[]
}

export default function FloatingActions({ numbers }: Props) {
  return (
    <div className="floating-actions-container">
      {numbers.map((number) => (
        <a 
          key={number} 
          href={`https://wa.me/${number.replace(/[^0-9]/g, '')}`} 
          target="_blank" 
          rel="noreferrer"
          className="floating-action-btn"
          title={`WhatsApp ${number}`}
        >
          <span className="wa-icon">💚</span>
          <span className="wa-number">{number}</span>
        </a>
      ))}
    </div>
  )
}
