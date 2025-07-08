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
  const [bricks, setBricks] = useState<Brick[]>([])
  const [ball, setBall] = useState<Ball>({ x: 400, y: 300, dx: 4, dy: -4, radius: 8 })
  const [paddle, setPaddle] = useState<Paddle>({ x: 350, y: 560, width: 100, height: 10 })
  const [score, setScore] = useState(0)

  const colors = ['#ff6b9d', '#45caff', '#96ceb4', '#ffeaa7', '#ff7675', '#a29bfe']

  const initializeBricks = useCallback(() => {
    const newBricks: Brick[] = []
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 10; col++) {
        newBricks.push({
          x: col * 82 + 10,
          y: row * 25 + 50,
          width: 75,
          height: 20,
          color: colors[row % colors.length],
          destroyed: false
        })
      }
    }
    setBricks(newBricks)
  }, [colors])

  const resetGame = () => {
    setBall({ x: 400, y: 300, dx: 4, dy: -4, radius: 8 })
    setPaddle({ x: 350, y: 560, width: 100, height: 10 })
    setScore(0)
    initializeBricks()
  }

  const startGame = () => {
    setGameStarted(true)
    resetGame()
  }

  useEffect(() => {
    if (!gameStarted) return

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

        // Reset if ball goes off bottom
        if (newBall.y > 600) {
          newBall = { x: 400, y: 300, dx: 4, dy: -4, radius: 8 }
        }

        return newBall
      })
    }, 16)

    return () => clearInterval(gameLoop)
  }, [gameStarted, paddle])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gameStarted) return
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
  }, [gameStarted])

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-7xl md:text-9xl font-bold text-white mb-4 tracking-tight">
            christianvon.com
          </h1>
        </div>
        <button
          onClick={startGame}
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-bold text-xl rounded-lg hover:from-pink-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg"
        >
          🎮 PLAY BRICK BREAKER 🎮
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-white mb-2">christianvon.com</h1>
        <div className="text-cyan-400 text-xl font-bold">SCORE: {score}</div>
      </div>
      
      <div
        id="game-area"
        className="relative bg-gray-900 border-4 border-cyan-400"
        style={{ width: '800px', height: '600px' }}
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
          className="absolute bg-white rounded-full shadow-lg"
          style={{
            left: ball.x - ball.radius,
            top: ball.y - ball.radius,
            width: ball.radius * 2,
            height: ball.radius * 2,
            boxShadow: '0 0 10px #fff'
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
        className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded hover:from-purple-600 hover:to-pink-600 transition-all"
      >
        BACK TO HOME
      </button>
    </div>
  )
}

export default App
