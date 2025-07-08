import { useState, useEffect, useCallback } from 'react'

interface Brick {
  x: number
  y: number
  width: number
  height: number
  color: string
  destroyed: boolean
}

interface Ball {
  x: number
  y: number
  dx: number
  dy: number
  radius: number
}

interface Paddle {
  x: number
  y: number
  width: number
  height: number
}

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [bricks, setBricks] = useState<Brick[]>([])
  const [ball, setBall] = useState<Ball>({ x: 400, y: 300, dx: 3, dy: -3, radius: 12 })
  const [paddle, setPaddle] = useState<Paddle>({ x: 350, y: 560, width: 100, height: 10 })
  const [score, setScore] = useState(0)

  const colors = ['#ff00ff', '#00ffff', '#ff0080', '#8000ff', '#ff4000', '#00ff80']

  const initializeBricks = useCallback(() => {
    const newBricks: Brick[] = []
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 10; col++) {
        newBricks.push({
          x: col * 78 + 10,
          y: row * 25 + 50,
          width: 68,
          height: 20,
          color: colors[row % colors.length],
          destroyed: false
        })
      }
    }
    setBricks(newBricks)
  }, [colors])

  const resetGame = () => {
    setBall({ x: 400, y: 300, dx: 3, dy: -3, radius: 12 })
    setPaddle({ x: 350, y: 560, width: 100, height: 10 })
    setScore(0)
    setGameOver(false)
    initializeBricks()
  }

  const startGame = () => {
    setGameStarted(true)
    resetGame()
  }

  useEffect(() => {
    if (!gameStarted || gameOver) return

    const gameLoop = setInterval(() => {
      setBall(prevBall => {
        let newBall = { ...prevBall }
        newBall.x += newBall.dx
        newBall.y += newBall.dy

        // Wall collisions
        if (newBall.x <= newBall.radius || newBall.x >= 800 - newBall.radius) {
          newBall.dx = -newBall.dx
        }
        if (newBall.y <= newBall.radius) {
          newBall.dy = -newBall.dy
        }

        // Paddle collision
        if (
          newBall.y + newBall.radius >= paddle.y &&
          newBall.x >= paddle.x &&
          newBall.x <= paddle.x + paddle.width
        ) {
          newBall.dy = -Math.abs(newBall.dy)
        }

        // Brick collisions
        setBricks(prevBricks => {
          const newBricks = [...prevBricks]
          newBricks.forEach(brick => {
            if (
              !brick.destroyed &&
              newBall.x >= brick.x &&
              newBall.x <= brick.x + brick.width &&
              newBall.y >= brick.y &&
              newBall.y <= brick.y + brick.height
            ) {
              brick.destroyed = true
              newBall.dy = -newBall.dy
              setScore(prev => prev + 10)
            }
          })
          return newBricks
        })

        // Game over if ball goes off bottom
        if (newBall.y > 600) {
          setGameOver(true)
        }

        return newBall
      })
    }, 16)

    return () => clearInterval(gameLoop)
  }, [gameStarted, gameOver, paddle])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gameStarted || gameOver) return
      const rect = document.getElementById('game-area')?.getBoundingClientRect()
      if (rect) {
        setPaddle(prev => ({
          ...prev,
          x: Math.max(0, Math.min(700, e.clientX - rect.left - prev.width / 2))
        }))
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [gameStarted, gameOver])

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Dark ambient background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="text-center mb-12 relative z-10">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-2xl">
              christianvon.com
            </span>
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mx-auto rounded-full mb-8 shadow-lg"></div>
          <p className="text-gray-400 text-lg font-medium tracking-wide">Welcome to the void</p>
        </div>
        
        <button
          onClick={startGame}
          className="px-10 py-5 bg-gradient-to-r from-purple-700 via-purple-600 to-cyan-600 text-white font-bold text-xl rounded-xl hover:from-purple-800 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-2xl border border-purple-400/50 relative z-10"
        >
          <span className="flex items-center gap-3">
            🎮 <span>PLAY BRICK BREAKER</span> 🎮
          </span>
        </button>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>
      </div>
    )
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Dark ambient background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="text-center mb-8 relative z-10">
          <div className="text-sm text-gray-500 mb-4 tracking-wider">christianvon.com</div>
          <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-6 drop-shadow-2xl">
            GAME OVER
          </h1>
          <div className="text-cyan-400 text-3xl font-bold mb-8 drop-shadow-lg">FINAL SCORE: {score}</div>
          <div className="space-y-4">
            <button
              onClick={startGame}
              className="block mx-auto px-8 py-4 bg-gradient-to-r from-purple-700 via-purple-600 to-cyan-600 text-white font-bold text-xl rounded-xl hover:from-purple-800 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-2xl border border-purple-400/50"
            >
              🎮 PLAY AGAIN 🎮
            </button>
            <button
              onClick={() => setGameStarted(false)}
              className="block mx-auto px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 font-bold rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all border border-gray-600/50"
            >
              BACK TO HOME
            </button>
          </div>
        </div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Dark ambient background effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="text-center mb-6 relative z-10">
        <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2 drop-shadow-lg">
          christianvon.com
        </h1>
        <div className="text-cyan-400 text-xl font-bold tracking-wider drop-shadow-lg">SCORE: {score}</div>
      </div>
      
      <div
        id="game-area"
        className="relative bg-black border-4 border-purple-400 shadow-2xl"
        style={{ width: '800px', height: '600px', boxShadow: '0 0 30px rgba(147, 51, 234, 0.5)' }}
      >
        {/* Bricks */}
        {bricks.map((brick, index) => (
          !brick.destroyed && (
            <div
              key={index}
              className="absolute border border-white"
              style={{
                left: brick.x,
                top: brick.y,
                width: brick.width,
                height: brick.height,
                backgroundColor: brick.color,
                boxShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
            />
          )
        ))}

        {/* Ball */}
        <div
          className="absolute bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full border-2 border-white"
          style={{
            left: ball.x - ball.radius,
            top: ball.y - ball.radius,
            width: ball.radius * 2,
            height: ball.radius * 2,
            boxShadow: '0 0 20px #ffff00, 0 0 40px #ff6600',
            zIndex: 10
          }}
        />

        {/* Paddle */}
        <div
          className="absolute bg-gradient-to-r from-cyan-400 to-pink-400 rounded"
          style={{
            left: paddle.x,
            top: paddle.y,
            width: paddle.width,
            height: paddle.height,
            boxShadow: '0 0 15px rgba(69, 202, 255, 0.5)'
          }}
        />
      </div>

      <button
        onClick={() => setGameStarted(false)}
        className="mt-6 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 font-bold rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all border border-gray-600/50 relative z-10"
      >
        BACK TO HOME
      </button>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>
    </div>
  )
}

export default App
