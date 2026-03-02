"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Save, FileText, Tag, Code2, Plus, Check, Sparkles } from "lucide-react"
import { useArcana } from "@/contexts/arcana-context"

interface CreateCardModalProps {
  onClose: () => void
}

const commonTags = [
  "REACT HOOK",
  "UTILITY",
  "CSS/TAILWIND",
  "DATABASE",
  "API",
  "TYPESCRIPT",
  "NODE.JS",
  "PYTHON",
  "ASYNC",
  "STATE",
  "PROMPT",
  "SYSTEM PROMPT",
]

const languages = [
  { value: "typescript", label: "TypeScript", color: "#3178c6" },
  { value: "javascript", label: "JavaScript", color: "#f7df1e" },
  { value: "tsx", label: "TSX", color: "#61dafb" },
  { value: "python", label: "Python", color: "#3776ab" },
  { value: "css", label: "CSS", color: "#264de4" },
  { value: "html", label: "HTML", color: "#e34f26" },
  { value: "sql", label: "SQL", color: "#00758f" },
  { value: "json", label: "JSON", color: "#292929" },
  { value: "bash", label: "Bash", color: "#4eaa25" },
  { value: "go", label: "Go", color: "#00add8" },
  { value: "rust", label: "Rust", color: "#dea584" },
  { value: "other", label: "Outro", color: "#6b7280" },
]

export function CreateCardModal({ onClose }: CreateCardModalProps) {
  const { addCard, settings } = useArcana()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [language, setLanguage] = useState("typescript")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [customTag, setCustomTag] = useState("")
  const [isFlipped, setIsFlipped] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const neonIntensity = settings.neonIntensity / 100

  // Animação de entrada (flip)
  useEffect(() => {
    const timer = setTimeout(() => setIsFlipped(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setIsFlipped(false)
    setTimeout(onClose, 400)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => 
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const addCustomTag = () => {
    const trimmed = customTag.trim().toUpperCase()
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags([...selectedTags, trimmed])
      setCustomTag("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    await new Promise(resolve => setTimeout(resolve, 300))
    
    addCard({
      title,
      content,
      language,
      tags: selectedTags,
    })
    handleClose()
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${
        isFlipped && !isClosing 
          ? "backdrop-blur-md bg-black/40" 
          : "backdrop-blur-none bg-black/0"
      }`}
      style={{ perspective: "1500px" }}
      onClick={handleClose}
    >
      {/* Card Container com Flip 3D */}
      <div
        className="relative w-full max-w-3xl transition-all duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(0deg)" : "rotateY(180deg)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-3xl"
          style={{
            backfaceVisibility: "hidden",
            background: "linear-gradient(180deg, #1a0f2e 0%, #0f0a1a 100%)",
            border: "1px solid rgba(147, 51, 234, 0.4)",
            boxShadow: `
              0 0 ${60 * neonIntensity}px rgba(147, 51, 234, ${0.3 * neonIntensity}),
              0 0 ${120 * neonIntensity}px rgba(147, 51, 234, ${0.1 * neonIntensity}),
              inset 0 1px 0 rgba(255, 255, 255, 0.05)
            `,
          }}
        >
          {/* Decorative top glow */}
          <div 
            className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(147, 51, 234, ${0.8 * neonIntensity}), transparent)`
            }}
          />

          {/* Header */}
          <div className="relative flex shrink-0 items-center gap-4 border-b border-white/5 p-6">
            {/* Icon with glow */}
            <div 
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.2))",
                boxShadow: `0 0 ${20 * neonIntensity}px rgba(147, 51, 234, ${0.4 * neonIntensity})`
              }}
            >
              <Sparkles className="h-6 w-6 text-arcana-purple" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-bold tracking-wide text-white">
                Criar Nova Carta
              </h2>
              <p className="mt-0.5 text-sm text-gray-400">
                Adicione um novo snippet à sua coleção
              </p>
            </div>
            
            <button
              onClick={handleClose}
              className="group rounded-xl p-2.5 text-gray-500 transition-all hover:bg-white/5 hover:text-white"
            >
              <X className="h-5 w-5 transition-transform group-hover:rotate-90" />
            </button>
          </div>

          {/* Form with custom scrollbar */}
          <form 
            onSubmit={handleSubmit} 
            className="min-h-0 flex-1 overflow-y-auto p-6"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(147, 51, 234, 0.3) transparent'
            }}
          >
            {/* Title Input */}
            <div className="mb-6">
              <label className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-300">
                <FileText className="h-4 w-4 text-arcana-purple" />
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white transition-all placeholder:text-gray-600 hover:border-arcana-purple/30 focus:border-arcana-purple focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-arcana-purple/20"
                placeholder="Ex: useDebounce Hook, API Helper, etc..."
              />
            </div>

            {/* Language Selector */}
            <div className="mb-6">
              <label className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-300">
                <Code2 className="h-4 w-4 text-arcana-cyan" />
                Linguagem
              </label>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {languages.map((lang) => (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() => setLanguage(lang.value)}
                    className={`relative rounded-xl px-4 py-2 text-xs font-medium transition-all ${
                      language === lang.value
                        ? "bg-white/10 text-white"
                        : "bg-white/5 text-gray-400 hover:bg-white/[0.07] hover:text-gray-300"
                    }`}
                    style={
                      language === lang.value
                        ? {
                            boxShadow: `0 0 ${15 * neonIntensity}px ${lang.color}40`,
                            borderColor: lang.color,
                            border: `1px solid ${lang.color}60`
                          }
                        : { border: "1px solid transparent" }
                    }
                  >
                    {language === lang.value && (
                      <span 
                        className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-white"
                        style={{ backgroundColor: lang.color }}
                      >
                        <Check className="h-2.5 w-2.5" />
                      </span>
                    )}
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Section */}
            <div className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Tag className="h-4 w-4 text-arcana-pink" />
                  Tags
                  {selectedTags.length > 0 && (
                    <span 
                      className="ml-1 rounded-full px-2 py-0.5 text-xs"
                      style={{
                        background: "rgba(147, 51, 234, 0.2)",
                        color: "#c084fc"
                      }}
                    >
                      {selectedTags.length} selecionada{selectedTags.length > 1 ? 's' : ''}
                    </span>
                  )}
                </label>
              </div>
              
              {/* Common Tags */}
              <div className="mb-4 flex flex-wrap gap-2">
                {commonTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`group relative rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wide transition-all duration-200 ${
                        isSelected
                          ? "text-white"
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                      style={{
                        background: isSelected 
                          ? "linear-gradient(135deg, rgba(147, 51, 234, 0.4), rgba(236, 72, 153, 0.3))"
                          : "rgba(255, 255, 255, 0.05)",
                        border: isSelected 
                          ? "1px solid rgba(147, 51, 234, 0.6)" 
                          : "1px solid rgba(255, 255, 255, 0.1)",
                        boxShadow: isSelected 
                          ? `0 0 ${20 * neonIntensity}px rgba(147, 51, 234, ${0.4 * neonIntensity})`
                          : undefined
                      }}
                    >
                      {isSelected && (
                        <Check className="mr-1.5 inline-block h-3 w-3" />
                      )}
                      {tag}
                    </button>
                  )
                })}
              </div>
              
              {/* Custom Tag Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addCustomTag()
                      }
                    }}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-white transition-all placeholder:text-gray-600 hover:border-arcana-cyan/30 focus:border-arcana-cyan focus:outline-none focus:ring-2 focus:ring-arcana-cyan/20"
                    placeholder="Criar tag personalizada..."
                  />
                  {customTag && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                      Enter ↵
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={addCustomTag}
                  disabled={!customTag.trim()}
                  className="flex items-center gap-2 rounded-xl border border-arcana-cyan/30 bg-arcana-cyan/10 px-4 py-3 text-sm font-medium text-arcana-cyan transition-all hover:bg-arcana-cyan/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Adicionar</span>
                </button>
              </div>
              
              {/* Selected Custom Tags */}
              {selectedTags.filter(tag => !commonTags.includes(tag)).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedTags.filter(tag => !commonTags.includes(tag)).map(tag => (
                    <span 
                      key={tag}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-arcana-cyan"
                      style={{
                        background: "rgba(34, 211, 238, 0.1)",
                        border: "1px solid rgba(34, 211, 238, 0.3)"
                      }}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className="ml-1 rounded-full p-0.5 hover:bg-white/10"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Content Textarea */}
            <div className="mb-8">
              <label className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Code2 className="h-4 w-4 text-green-400" />
                  Conteúdo
                </span>
                <span className="text-xs text-gray-500">
                  {content.split('\n').length} linhas · {content.length} caracteres
                </span>
              </label>
              <div 
                className="relative overflow-hidden rounded-xl"
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  background: "rgba(0, 0, 0, 0.4)"
                }}
              >
                {/* Line numbers decoration */}
                <div className="absolute bottom-0 left-0 top-0 w-12 border-r border-white/5 bg-black/20" />
                
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={12}
                  className="w-full resize-none bg-transparent py-4 pl-16 pr-4 font-mono text-sm leading-relaxed text-white placeholder:text-gray-600 focus:outline-none"
                  placeholder="// Cole seu código aqui..."
                  style={{ tabSize: 2 }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSaving || !title.trim() || !content.trim()}
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl py-4 text-base font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              style={{
                background: "linear-gradient(135deg, rgba(147, 51, 234, 0.4), rgba(236, 72, 153, 0.3))",
                border: "1px solid rgba(147, 51, 234, 0.5)",
                boxShadow: `
                  0 0 ${40 * neonIntensity}px rgba(147, 51, 234, ${0.4 * neonIntensity}),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `
              }}
            >
              {/* Animated background on hover */}
              <div 
                className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                  background: "linear-gradient(135deg, rgba(147, 51, 234, 0.5), rgba(236, 72, 153, 0.4))"
                }}
              />
              
              <span className="relative flex items-center gap-3">
                {isSaving ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Criar Carta
                    <Sparkles className="h-4 w-4 text-arcana-pink" />
                  </>
                )}
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        form::-webkit-scrollbar {
          width: 6px;
        }
        form::-webkit-scrollbar-track {
          background: transparent;
        }
        form::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.3);
          border-radius: 3px;
        }
        form::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.5);
        }
      `}</style>
    </div>
  )
}
