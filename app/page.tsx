"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { LoadingScreen } from "@/components/loading-screen"
import { roastIdea } from "./actions"

export default function Home() {
  const [idea, setIdea] = useState("")
  const [page, setPage] = useState<"input" | "loading" | "result">("input")
  const [aiResult, setAiResult] = useState("") // Store ONLY AI response here
  const [coinCount, setCoinCount] = useState(0)
  const coinCountRef = useRef(0)

  // Extract coin comment from AI response (text before separator)
  const getCoinComment = (aiResponse: string) => {
    if (aiResponse.includes('<<<SEPARATOR>>>')) {
      return aiResponse.split('<<<SEPARATOR>>>')[0].trim();
    }
    // Fallback if separator is missing - try to find the verdict header as backup
    const lines = aiResponse.split('\n');
    const verdictIndex = lines.findIndex(line => line.trim().toUpperCase().includes('THE VERDICT'));
    if (verdictIndex > 0) {
      return lines.slice(0, verdictIndex).filter(l => l.trim()).join(' ');
    }

    // Ultimate fallback
    return "Collecting digital coins? *burp* Classic displacement activity. Let's see if your idea is worth anything.";
  }

  // Get AI response without the coin comment
  // Get AI response without the coin comment (text after separator)
  const getAiResponseWithoutCoinComment = (aiResponse: string) => {
    if (aiResponse.includes('<<<SEPARATOR>>>')) {
      return aiResponse.split('<<<SEPARATOR>>>')[1].trim();
    }

    // Fallback logic
    const lines = aiResponse.split('\n');
    const verdictIndex = lines.findIndex(line => line.trim().toUpperCase().includes('THE VERDICT'));
    if (verdictIndex > 0) {
      return lines.slice(verdictIndex).join('\n');
    }
    return aiResponse;
  }

  const handleRoast = async () => {
    if (!idea.trim()) return

    setCoinCount(0)
    coinCountRef.current = 0
    setPage("loading")

    try {
      // Make API call - coin count will be captured from ref when response comes back
      // The ref is updated continuously by LoadingScreen during the loading phase
      const formData = new FormData()
      formData.append("idea", idea)

      // Start API call - coin count will be updated during the call
      // We'll capture the final count right before making the API call
      // Wait a moment to allow initial coin collection
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Capture the current coin count - prioritize state over ref since state is more reliable
      const currentCoinCount = coinCount > 0 ? coinCount : coinCountRef.current
      console.log("[DEBUG] About to call roastIdea with formData, coin count:", currentCoinCount, "state:", coinCount, "ref:", coinCountRef.current)

      // Call the Server Action - pass coin count
      const response = await roastIdea(formData, currentCoinCount)
      console.log("[DEBUG] Received response from roastIdea, coin count used:", currentCoinCount)

      setAiResult(response || "The AI refused to speak.")
      setPage("result")

    } catch (error: any) {
      console.error("[DEBUG] Error in handleRoast:", error)
      const errorMsg = error?.message || "Unknown error occurred"
      setAiResult(`[SYSTEM_ERROR]: Failed to connect to AI service. ${errorMsg}`)
      setPage("result")
    }
  }

  // Update coin count handler that also updates the ref
  const handleCoinsCollected = (coins: number) => {
    setCoinCount(coins)
    coinCountRef.current = coins
  }

  const handleReset = () => {
    setIdea("")
    setAiResult("")
    setCoinCount(0)
    setPage("input")
  }

  return (
    <main className="min-h-screen bg-black text-green-400 flex flex-col items-center px-4 py-8 font-mono">

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {/* PAGE 1: INPUT */}
        {page === "input" && (
          <div className="w-full max-w-2xl space-y-12 animate-in fade-in duration-500">
            <div className="border-b border-green-400 pb-8 space-y-2">
              <div className="text-green-400 text-sm opacity-75">$ startup_evaluator --mode=brutal</div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance text-green-400 font-mono">
                Will Your Startup Die?
              </h1>
              <p className="text-green-300 text-sm opacity-80 pt-2">&gt; Initialize diagnostic. Prepare for truth.</p>
            </div>

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
          </div>
        )}

        {/* PAGE 2: LOADING (The Game) */}
        {page === "loading" && (
          <LoadingScreen
            idea={idea}
            onCoinsCollected={handleCoinsCollected}
          />
        )}

        {/* PAGE 3: RESULT */}
        {page === "result" && (
          <div className="w-full max-w-2xl space-y-12 animate-in fade-in duration-500">
            <div className="border-b border-green-400 pb-8 space-y-2">
              <div className="text-green-400 text-sm opacity-75">$ analysis_complete</div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance text-green-400 font-mono">
                The Verdict
              </h1>
              <div className="text-green-300 text-sm font-mono pt-2">$ final_coin_count: {coinCount}</div>
            </div>

            <div className="space-y-4">
              <div className="text-green-300 text-sm font-mono opacity-75">$ your_idea:</div>
              <div className="bg-black border-2 border-green-400 p-6 font-mono text-sm leading-relaxed text-green-400">
                <div className="text-green-500">{">> [INPUT_STORED]"}</div>
                <p className="mt-2 text-green-400">{idea}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-green-300 text-sm font-mono opacity-75">$ roast_output:</div>
              <div className="bg-black border-2 border-green-400 p-6 font-mono text-sm leading-relaxed text-green-400 space-y-4">
                <div className="text-green-500">{">> ----[ANALYSIS_COMPLETE]----"}</div>

                {/* COIN COMMENT (AI Generated) - Seamlessly flows into AI response */}
                <p className="text-yellow-400 mb-3">
                  {getCoinComment(aiResult)}
                </p>

                {/* AI ROAST - Plain text terminal style, seamless continuation */}
                <div className="text-white space-y-1.5 font-mono text-sm leading-relaxed">
                  {getAiResponseWithoutCoinComment(aiResult).split('\n').map((line, idx) => {
                    if (!line.trim()) return <div key={idx} className="h-2" />;

                    // Preserve indentation (leading spaces)
                    const leadingSpaces = line.match(/^(\s*)/)?.[1] || '';
                    const trimmed = line.trim();

                    // Strip markdown syntax but preserve structure
                    let cleanLine = trimmed
                      .replace(/^#+\s+/, '') // Remove headers
                      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold markers
                      .replace(/\*(.+?)\*/g, '$1') // Remove italic markers
                      .replace(/^[•*]\s+/, '- ') // Convert bullet markers to dashes
                      .replace(/^-\s+/, '- ') // Normalize existing dashes
                      .replace(/^\d+\.\s+/, '- '); // Convert numbered lists to dashes

                    return (
                      <div key={idx} className="text-white whitespace-pre-wrap break-words">
                        {leadingSpaces}{cleanLine}
                      </div>
                    );
                  })}
                </div>

                <div className="text-green-500 mt-4">{"<< ----[END_REPORT]----"}</div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleReset}
                className="flex-1 h-12 text-base font-bold tracking-widest bg-green-400 hover:bg-green-300 text-black border-2 border-green-400 font-mono active:scale-95 active:brightness-75 transition-all duration-75"
              >
                &gt; Try Another
              </Button>
              <Button
                className="flex-1 h-12 text-base font-bold tracking-widest bg-blue-600 hover:bg-blue-500 text-white border-2 border-blue-400 font-mono active:scale-95 active:brightness-75 transition-all duration-75"
                onClick={async () => {
                  const text = `My startup idea just got destroyed by AI. I scored ${coinCount} coins while crying. Try it:`
                  const url = "https://unicorpse.vercel.app"

                  if (typeof navigator !== 'undefined' && navigator.share) {
                    try {
                      await navigator.share({
                        title: 'Unicorpse - Will Your Startup Die?',
                        text: text,
                        url: url
                      })
                    } catch (err) {
                      console.log('Error sharing:', err)
                    }
                  } else {
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text + " " + url)}`, '_blank')
                  }
                }}
              >
                &gt; Share Pain
              </Button>
            </div>
          </div>
        )}
      </div>

      <footer className="w-full text-center py-6 text-green-400/50 text-xs font-mono mt-8">
        <a
          href="https://github.com/QuantumChrono"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-green-400 transition-colors border-b border-dashed border-green-400/30 hover:border-green-400 pb-0.5"
        >
          QuantumChrono
        </a>
        <span className="ml-2">predicted your failure in every timeline.</span>
      </footer>
    </main>
  )
}