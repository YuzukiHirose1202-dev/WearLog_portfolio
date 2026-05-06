function DayCard({ data, direction }) {
  return (
    <div className={`card slide-${direction}`}>
      <p className="date">{data.date} {data.weather}</p>
      <img className="image" src={data.image} alt="" />
      <p className="event">{data.event}</p>
    </div>
  )
}

export default DayCard