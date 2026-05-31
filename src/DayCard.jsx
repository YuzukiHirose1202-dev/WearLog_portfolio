function DayCard({ data, direction , isRecommend}) {
  return (
<div className={`card slide-${direction}`}>

  <div className="top-row">
    <p className="date">
      {data.date} {data.weather}
    </p>

    <div className="weather-detail">
      🌡 {data.temp ?? "--"}℃ 💧 {data.humidity ?? "--"}%
    </div>
  </div>

  <img className="image" src={data.image} alt="" />
  <p className="event">{data.event}</p>

  {!isRecommend && (
    <div className="card-buttons">
      <button>編集</button>
      <button>削除</button>
      <button>↑</button>
      <button>↓</button>
    </div>
  )}

</div>
  )
}

export default DayCard