import DayCard from "./DayCard"
import "./App.css"
import { useState , useRef , useEffect} from "react" 
import.meta.env.VITE_APP_WEATHER_API_KEY



function App() {
  const[datalist, setDatalist] = useState([
    {
      date: "2026-03-06",
      weather: "🌧️",
      temp:18,
      humidity: 87,
      event: "友達とカフェ",
      image: "/images/Data1.png"
    },
    {
      date: "2026-03-07",
      weather: "☀️",
      temp: 22,
      humidity: 65,
      event: "映画館",
      image: "/images/Data2.png"
    },
    {
      date: "2026-03-08",
      weather: "☀️",
      temp: 24,
      humidity: 55,
      event: "ショッピング",
      image: "/images/Data3.png"
    },
    {
      date: "2026-03-09",
      weather: "☁️",
      temp: 19,
      humidity: 75,
      event: "友達とカフェ",
      image: "/images/Data4.png"
    },
    {
      date: "2026-03-10",
      weather: "🌧️",
      temp: 16,
      humidity: 90,
      event: "読書",
      image: "/images/Data5.png"
    },
    {
      date: "2026-03-11",
      weather: "☀️",
      temp: 22,
      humidity: 65,
      event: "大学",
      image: "/images/Data6.png"
    },
    {
      date: "2026-03-12",
      weather: "☁️",
      temp: 18,
      humidity: 80,
      event: "美術館",
      image: "/images/Data7.png"
    },
    {
      date: "2026-03-13",
      weather: "☀️",
      temp: 24,
      humidity: 55,
      event: "大学",
      image: "/images/Data8.png"
    },
    {
      date: "2026-03-14",
      weather: "☀️",
      temp: 22,
      humidity: 65,
      event: "友達とランチ",
      image: "/images/Data9.png"
    }
  ])

  const [index, setIndex] = useState(0) 
  const [sortType, setSortType] = useState("date")
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("diaryData")
    if (saved) {
      setDatalist(JSON.parse(saved))
    }
  }, [])


  useEffect(() => {
    localStorage.setItem("diaryData", JSON.stringify(datalist))
  }, [datalist])

  useEffect(() => {
  setIndex(0)
  }, [sortType])

const handleDelete = () => {
  const newList = datalist.filter((_, i) => i !== index)
  setDatalist(newList)

  // index調整（これ大事）
  if (index > 0) {
    setIndex(index - 1)
  } else {
    setIndex(0)
  }
}


  const [direction, setDirection] = useState("right")

  const [event, setEvent] = useState("")
  const [image, setImage] = useState("")

  const[imageFile, setImageFile] = useState(null)

  const fileInputRef = useRef(null)

  const [isEditing, setIsEditing] = useState(false)

  const [date, setDate] = useState("")

const getWeather = async () => {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude
          const lon = position.coords.longitude

          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_APP_WEATHER_API_KEY}&units=metric`
          )
          const data = await res.json()
          console.log("weather data:", data)

          const main = data.weather[0].main

          const icon =
            main === "Clear" ? "☀️" :
            main === "Clouds" ? "☁️" :
            main === "Rain" ? "🌧️" :
            main === "Snow" ? "❄️" : "❓"

          resolve({
            icon: icon,
            temp: Math.round(data.main.temp),
            humidity: data.main.humidity
          })

        } catch (e) {
          console.error(e)
          resolve({
            icon: "❓",
            temp: "--",
            humidity: "--"
          })
        }
      },
      (error) => {
        console.error(error)
        resolve({
          icon: "❓",
          temp: "--",
          humidity: "--"
        })
      }
    )
  })
}


  const handleAdd = async() => {
    const imageUrl = imageFile ? URL.createObjectURL(imageFile) : ""

    const weather=await getWeather()

    const today = new Date()
    const formattedDate = today.toISOString().split("T")[0]
    const newData = {
      date: formattedDate,
      weather: weather.icon,
      temp: weather.temp,  
      humidity: weather.humidity, 
      event: event,
      image: imageUrl
    }

    if (isEditing) {
      const updated = datalist.map((item, i) =>
        i === index ? newData : item
      )
      setDatalist(updated)
      setIsEditing(false)
    } else {
      setDatalist((prev) => [newData, ...prev])
      setIndex(0)
    }

    setEvent("")
    setImageFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }


  const sortedData = [...datalist].sort((a, b) => {
    if (sortType === "date") {
      return new Date(b.date) - new Date(a.date)
    }

    if (sortType === "weather") {
      const order = ["☀️", "☁️", "🌧️", "❄️"]
      return order.indexOf(a.weather) - order.indexOf(b.weather)
    }

    if (sortType === "event") {
      return a.event.localeCompare(b.event)
    }

    return 0
  })

  const currentData = sortedData[index] || {}

  const getRecommendation = () => {
  if (!currentData.temp || !currentData.humidity || datalist.length === 0) return null

  let bestMatch = null
  let bestScore = Infinity

  datalist.forEach(item => {
    //自分は除外
    if (item.date === currentData.date) return
    if (!item.temp || !item.humidity) return

    const tempDiff = Math.abs(item.temp - currentData.temp)
    const humidityDiff = Math.abs(item.humidity - currentData.humidity)

    // スコア評価（温度差 + 湿度差の半分）
    const score = tempDiff + humidityDiff * 0.5

    if (score < bestScore) {
      bestScore = score
      bestMatch = item
    }
  })

  return bestMatch
}

const recommended = getRecommendation()

const [activeTab, setActiveTab] = useState("home")

return (
    
    <div className="wrapper">
    {/* 操作系 */}
    {activeTab === "home" && (
    <div className="action-buttons">
      <button
        className="edit-btn"
        onClick={() => {
          setEvent(currentData.event || "")
          setImageFile(null)
          setIsEditing(true)
          setDate(currentData.date || "")
        }}
      >
        編集
      </button>

      <button className="delete-btn" onClick={handleDelete}>
        削除
      </button>

      <select onChange={(e) => setSortType(e.target.value)}>
        <option value="date">日付順</option>
        <option value="weather">天気順</option>
        <option value="event">イベント順</option>
      </select>
    </div>
    )}

    {/* ホーム画面　カード表示 */}
    {activeTab === "home" && (
      <div className="container">
        <button
          className="nav-btn"
          onClick={() => {
            setDirection("left")
            setIndex(index - 1)
          }}
          disabled={index === 0}
        >
          ←
        </button>

        <DayCard
          data={currentData}
          direction="none"
          isRecommend={true}
        />

        <button
          className="nav-btn"
          onClick={() => {
            setDirection("right")
            setIndex(index + 1)
          }}
          disabled={index === sortedData.length - 1}
        >
          →
        </button>
      </div>
    )}

    {activeTab === "recommend" && recommended && (
      <div className="container">
        <DayCard
          data={recommended}
          direction="none"
          isRecommend={true}
        />
      </div>
        )}

    {/* 追加ボタン */}
    <button className="add-btn" onClick={() => setIsModalOpen(true)}>
      ＋ 追加
    </button>

    {/* モーダル */}
    {isModalOpen && (
      <div
        className="modal-backdrop"
        onClick={() => setIsModalOpen(false)}
      >
        <div className="modal" onClick={(e) => e.stopPropagation()}>

          <h3>コーデ追加</h3>

          <input
            type="text"
            placeholder="イベント名"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0]
              if (file) setImageFile(file)
            }}
          />

          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              style={{ width: "120px", marginTop: "10px" }}
            />
          )}
          

        <button
          className="save-btn"
          onClick={() => {
            handleAdd()
            setIsModalOpen(false)
          }}
        >
          保存
        </button>

        <button
          className="cancel-btn"
          onClick={() => setIsModalOpen(false)}
        >
          キャンセル
        </button>

        </div>
      </div>
    )}

    <div className="bottom-nav">
  <button
    className={activeTab === "home" ? "active" : ""}
    onClick={() => setActiveTab("home")}
  >
    🏠 ホーム
  </button>

  <button
    className={activeTab === "recommend" ? "active" : ""}
    onClick={() => setActiveTab("recommend")}
  >
    🌟 おすすめ
  </button>
</div>

  </div>
)
}

export default App