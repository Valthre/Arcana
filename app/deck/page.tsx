import { Suspense } from "react"
import { DeckContent } from "@/components/deck-content"

export default function DeckPage() {
  return (
    <Suspense fallback={null}>
      <DeckContent />
    </Suspense>
  )
}