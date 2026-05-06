import DayCard from "./DayCard"
import "./App.css"
import { useState , useRef , useEffect} from "react" 



function App() {
  const[datalist, setDatalist] = useState([
    {
      date: "2026-03-06",
      weather: "🌧️",
      event: "友達とカフェ",
      image: "/images/Data1.png"
    },
    {
      date: "2026-03-07",
      weather: "☀️",
      event: "映画館",
      image: "/images/Data2.png"
    },
    {
      date: "2026-03-08",
      weather: "☀️",
      event: "ショッピング",
      image: "/images/Data3.png"
    },
    {
      date: "2026-03-09",
      weather: "☁️",
      event: "友達とカフェ",
      image: "/images/Data4.png"
    },
    {
      date: "2026-03-10",
      weather: "🌧️",
      event: "読書",
      image: "/images/Data5.png"
    },
    {
      date: "2026-03-11",
      weather: "☀️",
      event: "大学",
      image: "/images/Data6.png"
    },
    {
      date: "2026-03-12",
      weather: "☁️",
      event: "美術館",
      image: "/images/Data7.png"
    },
    {
      date: "2026-03-13",
      weather: "☀️",
      event: "大学",
      image: "/images/Data8.png"
    },
    {
      date: "2026-03-14",
      weather: "☀️",
      event: "友達とランチ",
      image: "/images/Data9.png"
    }
  ])

  const [index, setIndex] = useState(0) 
  const [sortType, setSortType] = useState("date")

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
              `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`
            )
            const data = await res.json()

            const main = data.weather[0].main

            if (main === "Clear") return resolve("☀️")
            if (main === "Clouds") return resolve("☁️")
            if (main === "Rain") return resolve("🌧️")
            if (main === "Snow") return resolve("❄️")

            resolve("❓")
          } catch (e) {
            console.error(e)
            resolve("❓")
          }
        },
        (error) => {
          console.error(error)
          resolve("❓")
        }
      )
    })
  }


  const handleAdd = async() => {
    const imageUrl = imageFile ? URL.createObjectURL(imageFile) : ""

    const weather=await getWeather()

    const today = new Date()
    const formattedDate = `${today.getFullYear()}-0${today.getMonth()+1}-0${today.getDate()}`

    const newData = {
      date: formattedDate,
      weather: weather,
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

  return (
    
    <div className="wrapper">
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
        <button 
          className="delete-btn"
          onClick={handleDelete}>
            削除
          </button>
          <select onChange={(e) => setSortType(e.target.value)}>
            <option value="date">日付順</option>
            <option value="weather">天気順</option>
            <option value="event">イベント順</option>
          </select>
      </div>
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
          key={index}
          data={currentData} 
          direction={direction} 
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


      <div className="form">
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
            if (file) {
              setImageFile(file)
            }
          }}
        />



        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="preview"
            style={{ width: "150px", marginTop: "10px" }}
          />
        )}

        <button onClick={handleAdd}>
          {isEditing ? "更新" : "追加"}
        </button>
      </div>

  </div>
  )
}

export default App