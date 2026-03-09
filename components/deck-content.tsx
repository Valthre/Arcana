// components/deck-content.tsx
"use client"

import { useState, useEffect, useMemo } from "react"
import { Sidebar } from "@/components/sidebar"
import { CardGrid } from "@/components/card-grid"
import { Starfield } from "@/components/starfield"
import { CardModal } from "@/components/card-modal"
import { CreateCardModal } from "@/components/create-card-modal"
import { SettingsPanel } from "@/components/settings-panel"
import { useArcana, type Card } from "@/contexts/arcana-context"
import { useDeviceOptimization } from "@/hooks/use-device-optimization"
import { 
  Plus, 
  Search, 
  X, 
  Sparkles, 
  Rocket, 
  Layers,
  Zap,
  Heart,
  Wand2
} from "lucide-react"

export function DeckContent() {
  const { settings, searchQuery, setSearchQuery } = useArcana()
  const { isMobile, shouldReduceEffects } = useDeviceOptimization()
  
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeView, setActiveView] = useState<"deck" | "boost" | "sobre">("deck")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  
  /* ════════════════════════════════════════════════════════════════
     ⏱️ ANIMAÇÃO INICIAL + TRANSIÇÃO ENTRE VIEWS
     📱 Delays reduzidos em mobile para UX mais responsiva
  ════════════════════════════════════════════════════════════════ */
  const [isReady, setIsReady] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [currentView, setCurrentView] = useState(activeView)
  
  // 📱 Delay menor em mobile
  const initialDelay = shouldReduceEffects ? 200 : 400

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
      setShowContent(true)
    }, initialDelay)
    return () => clearTimeout(timer)
  }, [initialDelay])

  useEffect(() => {
    if (!isReady) return
    if (activeView === currentView) return
    
    setShowContent(false)
    
    // 📱 Transição mais rápida em mobile
    const transitionDelay = shouldReduceEffects ? 150 : 250
    
    const timer = setTimeout(() => {
      setCurrentView(activeView)
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setShowContent(true)
        })
      })
    }, transitionDelay)
    
    return () => clearTimeout(timer)
  }, [activeView, isReady, currentView, shouldReduceEffects])

  /* ════════════════════════════════════════════════════════════════
     🎨 INTENSIDADES OTIMIZADAS PARA MOBILE
     Reduz carga visual em 50% para melhor performance
  ════════════════════════════════════════════════════════════════ */
  const neonIntensity = useMemo(() => {
    const base = settings.neonIntensity / 100
    return shouldReduceEffects ? base * 0.5 : base
  }, [settings.neonIntensity, shouldReduceEffects])

  // 📱 Blur reduzido em mobile (backdrop-filter é pesado)
  const blurValue = shouldReduceEffects ? "blur(2px)" : "blur(8px)"
  
  const isSearchActive = isSearchFocused || searchQuery.length > 0

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  /* ════════════════════════════════════════════════════════════════
     🎯 RENDER CONTENT - Views com otimizações condicionais
  ════════════════════════════════════════════════════════════════ */
  const renderContent = () => {
    switch (currentView) {
      case "deck":
        return <CardGrid onCardClick={setSelectedCard} />

      case "boost":
        return (
          <div className="flex min-h-full items-center justify-center px-4 py-8">
            <div className="text-center">
              {/* 🚀 BOOST: CONTAINER DO ÍCONE */}
              <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center">
                {/* Círculos decorativos - 📱 Animação condicional */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.2))",
                    animation: shouldReduceEffects ? "none" : "pulse 3s ease-in-out 0s infinite",
                    boxShadow: `0 0 ${40 * neonIntensity}px rgba(147, 51, 234, ${0.4 * neonIntensity})`
                  }}
                />
                
                <div 
                  className="absolute inset-4 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(147, 51, 234, 0.3))",
                    animation: shouldReduceEffects ? "none" : "pulse 3s ease-in-out 0.5s infinite"
                  }}
                />
                
                {/* Ícone central */}
                <div 
                  className="relative flex h-16 w-16 items-center justify-center rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #9333ea, #ec4899)",
                    boxShadow: `0 0 ${30 * neonIntensity}px rgba(147, 51, 234, ${0.6 * neonIntensity})`
                  }}
                >
                  <Rocket className="h-8 w-8 text-white" />
                </div>

                {/* 🖥️ Partículas flutuantes - Só em desktop */}
                {!shouldReduceEffects && (
                  <>
                    <div 
                      className="absolute -right-2 top-4 h-3 w-3 rounded-full bg-arcana-cyan"
                      style={{ animation: "float 4s ease-in-out 0s infinite" }}
                    />
                    <div 
                      className="absolute -left-1 bottom-6 h-2 w-2 rounded-full bg-arcana-pink"
                      style={{ animation: "float 4s ease-in-out 1s infinite" }}
                    />
                    <div 
                      className="absolute right-4 bottom-2 h-2.5 w-2.5 rounded-full bg-arcana-purple"
                      style={{ animation: "float 4s ease-in-out 2s infinite" }}
                    />
                  </>
                )}
              </div>
              
              <h3 className="mb-3 text-2xl font-bold text-white">
                Arcana Boost
              </h3>

              <p className="mb-6 text-gray-400">
                Recursos avançados em desenvolvimento
              </p>

              <div className="mx-auto grid max-w-md gap-3">
                {[
                  { icon: Zap, label: "Snippets com IA", color: "#22d3ee" },
                  { icon: Layers, label: "Coleções", color: "#a855f7" },
                  { icon: Sparkles, label: "Templates Mágicos", color: "#ec4899" },
                  { icon: Wand2, label: "E muito mais! ✨", color: "#fb923c", isSpecial: true },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-xl px-4 py-3"
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.08)"
                    }}
                  >
                    <div 
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ background: `${feature.color}20` }}
                    >
                      <feature.icon className="h-5 w-5" style={{ color: feature.color }} />
                    </div>
                    <span 
                      className={`text-sm ${feature.isSpecial ? "font-medium text-orange-400" : "text-gray-300"}`}
                    >
                      {feature.label}
                    </span>
                    {!feature.isSpecial && (
                      <span 
                        className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium uppercase"
                        style={{
                          background: "rgba(251, 146, 60, 0.15)",
                          color: "#fb923c"
                        }}
                      >
                        Em breve
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "sobre":
        return (
          <div className="flex min-h-full items-center justify-center px-4 py-8">
            <div className="max-w-2xl text-center">
              {/* 🖼️ SOBRE: LOGO */}
              <div className="relative mx-auto mb-8 h-40 w-40">
                {/* Glow - 📱 Animação condicional */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-50 blur-3xl"
                  style={{
                    background: "linear-gradient(135deg, #9333ea, #ec4899)",
                    animation: shouldReduceEffects ? "none" : "pulse 4s ease-in-out 0s infinite"
                  }}
                />
                <img 
                  src="/images/icon (512px).png" 
                  alt="Arcana Logo" 
                  className={`relative h-40 w-40 rounded-3xl object-cover ${
                    shouldReduceEffects ? "" : "transition-transform duration-300 hover:scale-105"
                  }`}
                  style={{
                    border: "2px solid rgba(147, 51, 234, 0.5)",
                    boxShadow: `0 0 ${40 * neonIntensity}px rgba(147, 51, 234, ${0.4 * neonIntensity})`
                  }}
                />
              </div>
              
              {/* 📝 SOBRE: NOME "ARCANA" - 📱 Animação simplificada em mobile */}
              <h3 
                className="arcana-title mb-3 text-5xl font-black tracking-wider md:text-6xl"
                style={{
                  background: "linear-gradient(135deg, var(--color-1), var(--color-2), var(--color-3), var(--color-4), var(--color-1))",
                  backgroundSize: "300% 300%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: shouldReduceEffects 
                    ? "none" 
                    : "rgbGradient 8s ease infinite, textGlow 2s ease-in-out infinite alternate",
                  backgroundPosition: shouldReduceEffects ? "50% 50%" : undefined,
                  filter: `drop-shadow(0 0 ${shouldReduceEffects ? 15 : 30}px rgba(147, 51, 234, 0.5))`
                }}
              >
                ARCANA
              </h3>

              <style jsx>{`
                .arcana-title {
                  --color-1: #ffffff;
                  --color-2: #a855f7;
                  --color-3: #ec4899;
                  --color-4: #22d3ee;
                }
                
                @keyframes rgbGradient {
                  0%, 100% { background-position: 0% 50%; }
                  25% { background-position: 50% 100%; }
                  50% { background-position: 100% 50%; }
                  75% { background-position: 50% 0%; }
                }
                
                @keyframes textGlow {
                  0% {
                    filter: drop-shadow(0 0 20px rgba(147, 51, 234, 0.4)) drop-shadow(0 0 40px rgba(236, 72, 153, 0.2));
                  }
                  100% {
                    filter: drop-shadow(0 0 30px rgba(236, 72, 153, 0.6)) drop-shadow(0 0 60px rgba(34, 211, 238, 0.3));
                  }
                }
              `}</style>
              
              <p className="mb-2 text-lg font-semibold text-arcana-cyan md:text-xl">
                Sua Biblioteca Local
              </p>
              
              <div className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5" style={{
                background: "rgba(34, 211, 238, 0.15)",
                border: "1px solid rgba(34, 211, 238, 0.3)"
              }}>
                <span className="text-xs font-medium text-arcana-purple">v0.3.6-beta</span>
              </div>
              
              <p className="mb-10 text-base leading-relaxed text-gray-400 md:text-lg">
                Gerenciador de snippets e informações técnicas com armazenamento 
                local e privado. Organize, busque e acesse seus códigos favoritos 
                com segurança e elegância.
              </p>

              {/* Info Cards */}
              <div 
                className="mb-10 grid grid-cols-3 gap-4 rounded-2xl p-6"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: shouldReduceEffects ? "none" : "0 4px 20px rgba(0, 0, 0, 0.2)"
                }}
              >
                {[
                  { label: "Licença", value: "MIT" },
                  { label: "Storage", value: "Local" },
                  { label: "Open Source", value: "GitHub" },
                ].map((info, index) => (
                  <div key={index} className="text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 md:text-xs">
                      {info.label}
                    </p>
                    <p className="mt-2 text-sm font-bold text-white md:text-base">
                      {info.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Links */}
              <div className="space-y-4">
                <a 
                  href="https://github.com/Valthre/Arcana" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`group mx-auto flex w-fit items-center gap-3 rounded-xl px-5 py-3 ${
                    shouldReduceEffects ? "" : "transition-all duration-300 hover:scale-105"
                  }`}
                  style={{
                    background: "rgba(147, 51, 234, 0.1)",
                    border: "1px solid rgba(147, 51, 234, 0.3)",
                  }}
                >
                  <svg 
                    className={`h-5 w-5 text-arcana-purple ${
                      shouldReduceEffects ? "" : "transition-transform duration-300 group-hover:rotate-12"
                    }`} 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 0.3.3-beta 0.3.3-beta 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 0.3.3-beta 0-0.3.3-beta 1.236-3.221-.124-.303-.535-0.3.3-beta 0 0 1.008-.322 3.301 0.3.3-beta 1.983-.399 3.003-.404 0.3.3-beta 0.3.3-beta 0.3.3-beta 2.291-1.552 3.297-1.23 3.297-0.3.3-beta 0.3.3-beta 0.3.3-beta 0.3.3-beta 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 0.3.3-beta 0.3.3-beta 2.222v3.293c0 .0.3.3-beta 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className={`text-sm font-semibold text-arcana-purple ${
                    shouldReduceEffects ? "" : "transition-colors group-hover:text-arcana-pink"
                  }`}>
                    Ver no GitHub
                  </span>
                </a>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <span>Criado com</span>
                  <Heart 
                    className="h-4 w-4 text-arcana-pink" 
                    style={{ 
                      animation: shouldReduceEffects ? "none" : "pulse 2s ease-in-out 0s infinite" 
                    }} 
                  />
                  <span>por</span>
                  <span className="font-medium text-white">Luna</span>
                  <span className="text-gray-500">&</span>
                  <a 
                    href="https://github.com/Valthre" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`font-semibold text-arcana-cyan ${
                      shouldReduceEffects 
                        ? "" 
                        : "transition-all duration-200 hover:scale-105 hover:text-arcana-purple"
                    }`}
                  >
                    Valthre
                  </a>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return <CardGrid onCardClick={setSelectedCard} />
    }
  }

  return (
    <div className="relative h-dvh overflow-hidden bg-black">
      <Starfield />

      <div className="relative z-10 flex h-full min-h-0 flex-col md:flex-row">
        <Sidebar 
          activeView={activeView} 
          onViewChange={setActiveView} 
          onSettingsClick={() => setIsSettingsOpen(true)} 
        />

        <main className="min-h-0 flex-1 overflow-hidden p-1 md:p-3">
          {/* 📦 PAINEL PRINCIPAL */}
          <div
            className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl md:rounded-3xl"
            style={{
              border: "2px solid rgba(147, 51, 234, 0.25)",
              background: "rgba(5, 0, 15, 0.3)",
              // 📱 Blur reduzido em mobile
              backdropFilter: blurValue,
              WebkitBackdropFilter: blurValue,
              // 📱 Shadow simplificado em mobile
              boxShadow: shouldReduceEffects
                ? `0 0 ${20 * neonIntensity}px rgba(147, 51, 234, ${0.1 * neonIntensity})`
                : `
                    0 0 ${40 * neonIntensity}px rgba(147, 51, 234, ${0.15 * neonIntensity}),
                    inset 0 1px 0 rgba(255, 255, 255, 0.02)
                  `,
            }}
          >
            {/* 🖥️ Linha decorativa superior - Só em desktop */}
            {!shouldReduceEffects && (
              <div 
                className="absolute left-8 right-8 top-0 h-px"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(147, 51, 234, 0.3), transparent)"
                }}
              />
            )}

            {/* 🔍 SEARCH BAR */}
            {activeView === "deck" && (
              <div className="shrink-0 p-4 pb-0 md:p-6 md:pb-0">
                <div
                  className={`relative flex items-center overflow-hidden rounded-2xl transition-all ${
                    shouldReduceEffects ? "duration-150" : "duration-300"
                  } ${
                    isSearchActive ? "scale-[1.01]" : "scale-100"
                  }`}
                  style={{
                    background: isSearchActive
                      ? "rgba(20, 10, 40, 0.6)"
                      : "rgba(15, 8, 30, 0.4)",
                    border: isSearchActive
                      ? "1px solid rgba(147, 51, 234, 0.4)"
                      : "1px solid rgba(147, 51, 234, 0.2)",
                    // 📱 Shadow condicional
                    boxShadow: isSearchActive && !shouldReduceEffects
                      ? `0 0 ${25 * neonIntensity}px rgba(147, 51, 234, ${0.2 * neonIntensity})`
                      : undefined,
                  }}
                >
                  <div
                    className={`ml-3 flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                      shouldReduceEffects ? "duration-150" : "duration-300"
                    } md:ml-4 md:h-10 md:w-10 ${
                      isSearchActive ? "scale-105" : "scale-100"
                    }`}
                    style={{
                      background: isSearchActive ? "rgba(147, 51, 234, 0.15)" : "transparent",
                    }}
                  >
                    <Search
                      className={`h-4 w-4 transition-colors ${
                        shouldReduceEffects ? "duration-150" : "duration-300"
                      } md:h-5 md:w-5 ${
                        isSearchActive ? "text-arcana-purple" : "text-gray-500"
                      }`}
                    />
                  </div>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder="Pesquisar cartas, tags, código..."
                    className="flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none md:px-4 md:py-4 md:text-base"
                    style={{ caretColor: "#a855f7" }}
                  />

                  {searchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className={`mr-3 flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 ${
                        shouldReduceEffects ? "" : "transition-all hover:bg-white/10 hover:text-white"
                      } md:mr-4`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Header da view Boost */}
            {activeView === "boost" && (
              <div className="shrink-0 p-4 pb-0 md:p-6 md:pb-0">
                <div className="flex items-center gap-3">
                  <div 
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      background: "rgba(34, 211, 238, 0.15)",
                    }}
                  >
                    <Rocket className="h-5 w-5 text-arcana-cyan" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white md:text-xl">
                      Arcana Boost
                    </h2>
                    <p className="text-xs text-gray-500 md:text-sm">
                      Recursos premium e avançados
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 📦 ÁREA DE CONTEÚDO PRINCIPAL */}
            <div 
              className={`min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-2 transition-all md:p-6 ${
                showContent 
                  ? `translate-y-0 opacity-100 ${shouldReduceEffects ? "duration-200" : "duration-400"} ease-out` 
                  : `-translate-y-2 opacity-0 ${shouldReduceEffects ? "duration-100" : "duration-250"} ease-in`
              }`}
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(147, 51, 234, 0.3) transparent'
              }}
            >
              {renderContent()}
            </div>

            {/* 🖥️ Linha decorativa inferior - Só em desktop */}
            {!shouldReduceEffects && (
              <div 
                className="absolute bottom-0 left-8 right-8 h-px"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.2), transparent)"
                }}
              />
            )}
          </div>
        </main>
      </div>

{/* ➕ FAB: BOTÃO FLUTUANTE "NOVA CARTA" */}
{activeView === "deck" && (
  <button
    onClick={() => setIsCreateModalOpen(true)}
    className={`group fixed right-4 z-50 flex h-14 w-14 items-center justify-center rounded-2xl transition-all ${
      shouldReduceEffects ? "duration-150" : "duration-300"
    } hover:scale-110 hover:-translate-y-1 active:scale-95 md:bottom-8 md:right-8 md:h-16 md:w-16`}
    style={{
      // 📱 Safe area: bottom-4 (1rem) + safe area inset
      bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)",
      background: "linear-gradient(135deg, rgba(147, 51, 234, 0.9), rgba(236, 72, 153, 0.8))",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: shouldReduceEffects
        ? `0 4px 15px rgba(0, 0, 0, 0.3), 0 0 ${20 * neonIntensity}px rgba(147, 51, 234, ${0.4 * neonIntensity})`
        : `
            0 4px 20px rgba(0, 0, 0, 0.4),
            0 0 ${35 * neonIntensity}px rgba(147, 51, 234, ${0.6 * neonIntensity}),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `,
    }}
  >
    <Plus className={`h-7 w-7 text-white transition-transform ${
      shouldReduceEffects ? "duration-150" : "duration-300"
    } group-hover:rotate-90 md:h-8 md:w-8`} />
          
          {/* 🖥️ Tooltip "Nova Carta" - Só em desktop */}
          {!isMobile && (
            <span 
              className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-white opacity-0 transition-all group-hover:opacity-100 md:block"
              style={{
                background: "rgba(15, 10, 26, 0.95)",
                border: "1px solid rgba(147, 51, 234, 0.4)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
              }}
            >
              Nova Carta
              <Sparkles className="ml-1.5 inline-block h-3.5 w-3.5 text-arcana-pink" />
            </span>
          )}

          {/* 🖥️ Efeito ping - Só em desktop */}
          {!shouldReduceEffects && (
            <div 
              className="absolute inset-0 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(147, 51, 234, 0.4), rgba(236, 72, 153, 0.3))",
                animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) 1s infinite"
              }}
            />
          )}
        </button>
      )}

      {/* Modais */}
      {selectedCard && (
        <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
      {isCreateModalOpen && (
        <CreateCardModal onClose={() => setIsCreateModalOpen(false)} />
      )}
      {isSettingsOpen && (
        <SettingsPanel onClose={() => setIsSettingsOpen(false)} />
      )}

      {/* ════════════════════════════════════════════════════════════════
          🎨 ESTILOS GLOBAIS COM OTIMIZAÇÕES MOBILE
      ════════════════════════════════════════════════════════════════ */}
      <style jsx global>{`
        /* 🖥️ Animações completas só em desktop + sem preferência de redução */
        @media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
          @keyframes float {
            0%, 100% {
              transform: translateY(0) scale(1);
            }
            50% {
              transform: translateY(-10px) scale(1.1);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.05);
              opacity: 0.7;
            }
          }

          @keyframes ping {
            75%, 100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
        }

        /* 📱 Em mobile, animações são mais simples ou desativadas */
        @media (max-width: 767px) {
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.85; }
          }
          
          /* Desativa animações pesadas */
          @keyframes float { }
          @keyframes ping { }
        }

        /* ♿ Respeita preferência do usuário */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Scrollbar estilizada */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.3);
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.5);
        }
        
        /* 📱 Em mobile, scrollbar mais fina */
        @media (max-width: 767px) {
          .overflow-y-auto::-webkit-scrollbar {
            width: 2px;
          }
        }
      `}</style>
    </div>
  )
}
