function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-950 via-indigo-900 to-blue-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      {/* Main content */}
      <div className="text-center flex-1 flex flex-col justify-center relative z-10">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent mb-6 tracking-tight drop-shadow-2xl">
            Christian von.com
          </h1>
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div>
            <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full"></div>
            <div className="w-8 h-1 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Bottom message with enhanced styling */}
      <div className="pb-8 relative z-10">
        <div className="px-6 py-3 bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-indigo-900/40 backdrop-blur-sm border border-white/10 rounded-full">
          <p className="text-white/80 text-lg font-medium tracking-wide">
            comedy coming soon or not. fuck it.
          </p>
        </div>
      </div>
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>
    </div>
  )
}

export default App
