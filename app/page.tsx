"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { LoadingScreen } from "@/components/loading-screen"

export default function Home() {
  const [idea, setIdea] = useState("")
  const [page, setPage] = useState<"input" | "loading" | "result">("input")
  const [result, setResult] = useState("")
  const [coinCount, setCoinCount] = useState(0)

  const handleRoast = async () => {
    if (!idea.trim()) return

    setPage("loading")
  }

  const handleCoinsCollected = (coins: number) => {
    setCoinCount(coins)

    const roastsByCoins: Record<string, string[]> = {
      low: [
        `${coins} coins? That's pathetic. Even your inability to navigate a scanner reflects your startup's future.`,
        `Only ${coins} coins collected. I see why your startup idea failed—lack of focus.`,
        `${coins} coins? Congratulations on achieving the bare minimum. Your startup will achieve less.`,
      ],
      medium: [
        `Hmm, ${coins} coins. Not bad. Your startup idea is about as mediocre.`,
        `${coins} coins—respectable effort. Too bad your business model isn't.`,
        `${coins} coins? That's decent. Your idea is decidedly not.`,
      ],
      high: [
        `${coins} coins! Impressive. Too bad your startup idea doesn't match your gaming skills.`,
        `${coins} coins collected! You're thorough—something your market research clearly wasn't.`,
        `Wow, ${coins} coins! Such commitment to collecting valuables, such negligence with business logic.`,
      ],
    }

    const getCoinCategory = (count: number) => {
      if (count < 8) return "low"
      if (count < 15) return "medium"
      return "high"
    }

    const category = getCoinCategory(coins)
    const roastsForCategory = roastsByCoins[category]
    const randomRoast = roastsForCategory[Math.floor(Math.random() * roastsForCategory.length)]

    setResult(randomRoast)
    setPage("result")
  }

  const handleReset = () => {
    setIdea("")
    setResult("")
    setCoinCount(0)
    setPage("input")
  }

  return (
    <main className="min-h-screen bg-black text-green-400 flex flex-col items-center justify-center px-4 py-8 font-mono">
      {page === "input" && (
        <div className="w-full max-w-2xl space-y-12 animate-in fade-in duration-500">
          {/* Terminal Header */}
          <div className="border-b border-green-400 pb-8 space-y-2">
            <div className="text-green-400 text-sm opacity-75">$ startup_evaluator --mode=brutal</div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance text-green-400 font-mono">
              Will Your Startup Die?
            </h1>
            <p className="text-green-300 text-sm opacity-80 pt-2">&gt; Initialize diagnostic. Prepare for truth.</p>
          </div>

          {/* Input Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-green-300 text-sm font-mono">$ describe_your_idea:</label>
              <Textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Enter your startup concept..."
                className="w-full bg-black border-2 border-green-400 text-green-400 placeholder-green-700 focus:border-green-300 focus:outline-none p-4 text-base min-h-32 font-mono caret-green-400"
              />
            </div>

            <Button
              onClick={handleRoast}
              disabled={!idea.trim()}
              className="w-full h-12 text-base font-bold tracking-widest bg-green-400 hover:bg-green-300 text-black border-2 border-green-400 font-mono active:scale-95 active:brightness-75 transition-all duration-75"
            >
              &gt; Roast My Idea
            </Button>
          </div>

          {/* Terminal Footer */}
          <div className="border-t border-green-400 pt-8 text-center">
            <p className="text-green-300 text-xs font-mono opacity-75">$ system_ready | awaiting_input</p>
          </div>
        </div>
      )}

      {page === "loading" && <LoadingScreen idea={idea} onCoinsCollected={handleCoinsCollected} />}

      {page === "result" && (
        <div className="w-full max-w-2xl space-y-12 animate-in fade-in duration-500">
          {/* Terminal Header */}
          <div className="border-b border-green-400 pb-8 space-y-2">
            <div className="text-green-400 text-sm opacity-75">$ analysis_complete</div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance text-green-400 font-mono">
              The Verdict
            </h1>
            <div className="text-green-300 text-sm font-mono pt-2">$ final_coin_count: {coinCount}</div>
          </div>

          {/* Your Idea Summary */}
          <div className="space-y-4">
            <div className="text-green-300 text-sm font-mono opacity-75">$ your_idea:</div>
            <div className="bg-black border-2 border-green-400 p-6 font-mono text-sm leading-relaxed text-green-400">
              <div className="text-green-500">{">> [INPUT_STORED]"}</div>
              <p className="mt-2 text-green-400">{idea}</p>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="text-green-300 text-sm font-mono opacity-75">$ roast_output:</div>
            <div className="bg-black border-2 border-green-400 p-6 font-mono text-sm leading-relaxed text-green-400 space-y-3">
              <div className="text-green-500">{">> ----[ANALYSIS_COMPLETE]----"}</div>
              <p className="whitespace-pre-wrap">{result}</p>
              <div className="text-green-500">{"<< ----[END_REPORT]----"}</div>
            </div>
          </div>

          <Button
            onClick={handleReset}
            className="w-full h-12 text-base font-bold tracking-widest bg-green-400 hover:bg-green-300 text-black border-2 border-green-400 font-mono active:scale-95 active:brightness-75 transition-all duration-75"
          >
            &gt; Try Another Idea
          </Button>

          {/* Terminal Footer */}
          <div className="border-t border-green-400 pt-8 text-center">
            <p className="text-green-300 text-xs font-mono opacity-75">$ ready_for_more_pain</p>
          </div>
        </div>
      )}
    </main>
  )
}
