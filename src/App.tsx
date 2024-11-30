import { useEffect, useRef, useState } from "react";
import { GoChevronLeft, GoChevronRight, GoX } from "react-icons/go";

interface TitleData {
  title: string;
  day: string;
}

const App = () => {
  const [year, setYear] = useState(new Date());
  const titleRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const [titleData, setTitleData] = useState<TitleData[]>([]);

  const months: string[] = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust",
    "Sentabr", "Oktyabr", "Noyabr", "Dekabr",
  ];

  const weeks: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (month: number, year: number): number[] => {
    const date = new Date(year, month, 0);
    const monthDay = date.getDate();
    let days: number[] = [];
    for (let day = 1; day <= monthDay; day++) {
      days.push(day);
    }
    return days;
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(year);
    newDate.setMonth(year.getMonth() + delta);
    setYear(newDate);
  };

  const daysInMonth = getDaysInMonth(year.getMonth() + 1, year.getFullYear());
  const firstDayOfMonth = new Date(year.getFullYear(), year.getMonth(), 1).getDay();

  const openModal = () => setIsModalOpen(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);

  const save = () => {
    if (!titleRef.current?.value || !dateRef.current?.value) {
      alert("Iltimos, matn va sanani kiriting");
      return;
    }

    const data: TitleData = {
      title: titleRef.current.value,
      day: dateRef.current.value,
    };

    const updatedData = [...titleData, data];
    setTitleData(updatedData);
    localStorage.setItem("data", JSON.stringify(updatedData));
    setIsModalOpen(false)
  };

  useEffect(() => {
    const storedData = localStorage.getItem("data");
    if (storedData) {
      setTitleData(JSON.parse(storedData));
    }
  }, []);

  const handleDelete = (index: number) => {
    const updatedData = titleData.filter((_, i) => i !== index);
    setTitleData(updatedData);
    localStorage.setItem("data", JSON.stringify(updatedData));
  };
  
  return (
    <div className="w-full px-10 md:w-1/2">
      <div className="p-4 flex flex-col bg-white/90 text-blue-950 rounded-lg shadow-lg ">
        <div className="flex justify-between w-full gap-6 items-center mb-4">
          <h2 className="text-xl font-black">{months[year.getMonth()]} {year.getFullYear()}</h2>
          <div className="flex gap-5">

          <GoChevronLeft
            className="text-xl text-white bg-blue-950 rounded-full font-black"
            onClick={() => changeMonth(-1)}
            />
          <GoChevronRight
            className="text-xl bg-blue-950 text-white rounded-full"
            onClick={() => changeMonth(1)}
            />
            </div>
        </div>

        <div className="grid grid-cols-5 w-full md:grid-cols-7 gap-2 text-center">
          {weeks.map((week, index) => (
            <div key={index} className="font-bold">{week}</div>
          ))}

          {Array(firstDayOfMonth).fill(null).map((_, index) => (
            <div key={index}></div>
          ))}

          {daysInMonth.map((day) => (
            <div
              key={day}
              onClick={openModal}
              className="p-2 bg-blue-950 text-white font-bold rounded-lg cursor-pointer"
            >
              {day}
            </div>
          ))}
        </div>
        <button
          onClick={openModal}
          className="bg-black hover:bg-black/80 w-full duration-300 text-white rounded-md px-5 mt-3 font-bold py-2 sm:w-1/2"
        >
          Rejalashtirish
        </button>
      </div>

      <div className="max-w-[600px] mt-4 text-white flex flex-col p-4 rounded-md mx-auto gap-2">
        {titleData.length > 0 &&
          titleData.map((value, index) => (
            <div key={index} className="border flex justify-between border-solid px-2 py-1 border-blue-200 rounded-md">
              <h1>{value.title}</h1>
              <div className="flex flex-col items-end">
                <div>

              <span>{value.day.slice(0, 10)}</span>
              <span className="ml-2">{value.day.slice(11, 20)}</span>
                </div>
              <div onClick={() => handleDelete(index)} className="px-2 py-1 bg-red-600 rounded-md cursor-pointer">delet</div>
              </div>
            </div>
          ))}
      </div>

      <div className="relative">
        {isModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
            onClick={closeModal}
          >
            <div
              className="border-white text-white bg-blue-900 p-6 rounded-lg shadow-lg md:w-1/2 lg:w-1/3 w-full mx-10 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between">
                <h2 className="py-3 font-semibold flex-1 text-center text-xl">Kun belgilang</h2>
                <GoX onClick={closeModal} className="cursor-pointer" />
              </div>
              <div className="flex gap-2 items-center mt-2">
                <label htmlFor="title" className="text-lg">Kalit so`z</label>
                <input
                  ref={titleRef}
                  className="rounded-lg outline-none px-3 py-2 flex-1 text-blue-950 border-[2px] border-blue-800 border-solid"
                  type="text"
                  id="title"
                />
              </div>
              <div className="flex gap-2 mt-2 mx-auto items-center">
                <label htmlFor="data" className="text-lg">Sana</label>
                <input
                  ref={dateRef}
                  className="rounded-lg outline-none text-blue-950 py-2 px-3 border-[2px] border-blue-800 border-solid"
                  type="datetime-local"
                  id="data"
                />
              </div>
              <button onClick={save} className="bg-blue-950 text-white rounded-md mt-2 px-5 py-2">
                Saqlash
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
