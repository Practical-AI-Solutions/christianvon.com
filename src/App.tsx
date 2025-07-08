function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex flex-col items-center justify-center relative overflow-hidden">
      {/* 90s geometric background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rotate-45"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-lime-300 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-40 h-20 bg-pink-300 skew-x-12"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-orange-300 rotate-12"></div>
      </div>
      
      <div className="text-center relative z-10">
        <h1 className="text-7xl md:text-9xl font-black text-white mb-4 tracking-wider transform -skew-x-6 drop-shadow-[4px_4px_0px_#000000]">
          christianvon.com
        </h1>
        <div className="w-full h-2 bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 mx-auto"></div>
      </div>
    </div>
  )
}

export default App
