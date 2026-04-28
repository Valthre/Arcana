// app/page.tsx
"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Starfield } from "@/components/starfield"
import { useDeviceOptimization } from "@/hooks/use-device-optimization"
import { useFirstVisit } from "@/hooks/use-first-visit"
import { Code2, Lock, Zap, ArrowRight } from "lucide-react"

export default function WelcomePage() {
  const router = useRouter()
  const { isMobile } = useDeviceOptimization()
  const { isFirstVisit, isLoading, markAsVisited } = useFirstVisit()
  
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  /* ════════════════════════════════════════════════════════════════
     🚀 REDIRECT: Se já visitou antes, vai direto pro deck
  ════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!isLoading && !isFirstVisit) {
      router.replace("/deck")
    }
  }, [isLoading, isFirstVisit, router])

  /* ════════════════════════════════════════════════════════════════
     ✨ ANIMAÇÃO: Só mostra conteúdo após verificar first visit
  ════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!isLoading && isFirstVisit) {
      const timer = setTimeout(() => setIsVisible(true), isMobile ? 50 : 100)
      return () => clearTimeout(timer)
    }
  }, [isLoading, isFirstVisit, isMobile])

  const handleNavigate = () => {
    setIsExiting(true)
    markAsVisited()
    
    setTimeout(() => {
      router.push("/deck")
    }, isMobile ? 600 : 1000)
  }

  const features = [
    { icon: Code2, text: "Snippets organizados" },
    { icon: Lock, text: "100% local e privado" },
    { icon: Zap, text: "Acesso instantâneo" },
  ]

  /* ════════════════════════════════════════════════════════════════
     ⏳ LOADING
  ════════════════════════════════════════════════════════════════ */
  if (isLoading || !isFirstVisit) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black">
        <div className="flex min-h-screen items-center justify-center">
          <div 
            className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent"
          />
        </div>
      </main>
    )
  }

  /* ════════════════════════════════════════════════════════════════
     🎨 WELCOME PAGE
  ════════════════════════════════════════════════════════════════ */
  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <Starfield />

      {/* ════════════════════════════════════════════════════════════════
          ✨ TRANSIÇÃO: FLASH DE SAÍDA 
      ════════════════════════════════════════════════════════════════ */}
     <div 
        className={`pointer-events-none fixed inset-0 z-50 bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-500 transition-opacity duration-500 ${
          isExiting ? "opacity-100" : "opacity-0"
        }`}
        style={{ mixBlendMode: "screen" }}
      />

      {/* ═══════════════════════════════════════════════════════
          ✨ TRANSIÇÃO: CORTINA DE SAÍDA - Círculo expandindo
      ═════════════════════════════════════════════════════════ */}
       <div 
        className={`pointer-events-none fixed inset-0 z-40 bg-black transition-all duration-700 ease-in-out ${
          isExiting ? "opacity-100" : "opacity-0"
        }`}
        style={{
          clipPath: isExiting ? "circle(150% at 50% 50%)" : "circle(0% at 50% 50%)",
          transition: "clip-path 0.8s ease-in-out, opacity 0.3s ease-out",
        }}
      />

      {/* ════════════════════════════════════════════════════════════════
          🔮 ORBS
      ════════════════════════════════════════════════════════════════ */}
      <div 
        className={`absolute left-1/4 top-1/4 rounded-full ${
          isMobile 
            ? `h-48 w-48 bg-purple-600/10 blur-[50px]`
            : `h-96 w-96 bg-purple-600/20 blur-[120px] ${!isExiting ? "animate-pulse" : ""}`
        }`}
        style={{
          opacity: isExiting ? 0 : 1,
          transform: isExiting ? "scale(1.5)" : "scale(1)",
          transition: `all ${isMobile ? 400 : 600}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
      />
      <div 
        className={`absolute bottom-1/4 right-1/4 rounded-full ${
          isMobile 
            ? `h-48 w-48 bg-cyan-600/10 blur-[50px]`
            : `h-96 w-96 bg-cyan-600/20 blur-[120px] ${!isExiting ? "animate-pulse" : ""}`
        }`} 
        style={{ 
          animationDelay: isMobile ? undefined : "1s",
          opacity: isExiting ? 0 : 1,
          transform: isExiting ? "scale(1.5)" : "scale(1)",
          transition: `all ${isMobile ? 400 : 600}ms cubic-bezier(0.4, 0, 0.2, 1) 50ms`,
        }} 
      />

      {/* ════════════════════════════════════════════════════════════════
          📐 CONTAINER CENTRAL
      ════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-between px-4 py-[7vh] md:h-auto md:justify-center md:gap-12 md:py-12 lg:gap-16 lg:py-16">
        
        {/* 📦 LOGO */}
        <div 
          style={{
            opacity: isExiting ? 0 : isVisible ? 1 : 0,
            transform: isExiting 
              ? isMobile ? "scale(1.1) translateY(-10px)" : "scale(1.2) translateY(-20px)"
              : isVisible ? "scale(1) translateY(0)" : "scale(0.95) translateY(-10px)",
            filter: isExiting && !isMobile ? "blur(8px)" : "blur(0px)",
            transition: isExiting
              ? `all ${isMobile ? 350 : 500}ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`
              : `all 700ms cubic-bezier(0.16, 1, 0.3, 1) 0ms`,
          }}
        >
          <div className="relative h-[16vh] w-[16vh] min-h-[80px] min-w-[80px] md:h-28 md:w-28 lg:h-32 lg:w-32">
            <div 
              className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 opacity-50 md:rounded-3xl ${
                isMobile ? "blur-xl" : "blur-2xl animate-pulse"
              }`} 
            />
            <img 
              src="/images/icon (512px).png"
              alt="Arcana Logo"
              className="relative h-full w-full rounded-2xl border-2 border-purple-500/50 object-cover shadow-lg md:rounded-3xl"
              style={{ 
                boxShadow: isMobile 
                  ? "0 0 15px rgba(147, 51, 234, 0.3)" 
                  : "0 0 30px rgba(147, 51, 234, 0.4)" 
              }}
            />
          </div>
        </div>

        {/* 📦 CONTEÚDO CENTRAL */}
        <div className="flex flex-col items-center gap-[2.5vh] text-center md:gap-5 lg:gap-6">
          
          {/* "Bem-vindo ao" */}
          <h2
            style={{
              marginTop: 'clamp(-30px, -4vh, -15px)',
              background: "linear-gradient(90deg, #d946ef 0%, #a855f7 30%, #6366f1 50%, #3b82f6 70%, #22d3ee 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              opacity: isExiting ? 0 : isVisible ? 1 : 0,
              transform: isExiting 
                ? `translateY(${isMobile ? "-15px" : "-25px"})` 
                : isVisible ? "translateY(0)" : "translateY(15px)",
              filter: isExiting && !isMobile ? "blur(4px)" : "blur(0px)",
              transition: isExiting
                ? `all ${isMobile ? 300 : 450}ms cubic-bezier(0.4, 0, 0.2, 1) ${isMobile ? 50 : 80}ms`
                : `all 700ms cubic-bezier(0.16, 1, 0.3, 1) 100ms`,
            }}
            className="text-[3.5vh] font-medium tracking-wide md:text-3xl lg:text-4xl xl:text-5xl"
          >
            Bem-vindo ao
          </h2>

          {/* "ARCANA" */}
          <h1
            className="arcana-title font-black tracking-wider md:text-8xl lg:text-9xl"
            style={{
              background: "linear-gradient(90deg, #d946ef 0%, #a855f7 20%, #6366f1 40%, #3b82f6 60%, #22d3ee 80%, #06b6d4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              opacity: isExiting ? 0 : isVisible ? 1 : 0,
              transform: isExiting 
                ? `scale(${isMobile ? 1.05 : 1.08})` 
                : isVisible ? "scale(1)" : "scale(0.92)",
              filter: isExiting 
                ? isMobile
                  ? "drop-shadow(0 0 30px rgba(147, 51, 234, 0.6))"
                  : "drop-shadow(0 0 60px rgba(147, 51, 234, 0.8)) drop-shadow(0 0 120px rgba(34, 211, 238, 0.5)) blur(6px)"
                : isMobile
                  ? "drop-shadow(0 0 20px rgba(147, 51, 234, 0.4))"
                  : "drop-shadow(0 0 40px rgba(147, 51, 234, 0.6)) drop-shadow(0 0 80px rgba(34, 211, 238, 0.3)) blur(0px)",
              transition: isExiting
                ? `all ${isMobile ? 400 : 600}ms cubic-bezier(0.4, 0, 0.2, 1) ${isMobile ? 30 : 50}ms`
                : `all 800ms cubic-bezier(0.16, 1, 0.3, 1) 200ms`,
            }}
          >
            ARCANA
          </h1>

          {/* Tagline */}
          <p
            className="font-medium italic tracking-wide md:text-xl lg:text-2xl xl:text-3xl"
            style={{
              marginTop: 'clamp(-30px, -4vh, -20px)',
              fontSize: 'clamp(14px, 2.2vh, 28px)',
              background: "linear-gradient(90deg, #8b5cf6, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 30px rgba(139, 92, 246, 0.8)",
              opacity: isExiting ? 0 : isVisible ? 1 : 0,
              transform: isExiting 
                ? `translateY(${isMobile ? "10px" : "20px"})` 
                : isVisible ? "translateY(0)" : "translateY(15px)",
              filter: isExiting && !isMobile ? "blur(4px)" : "blur(0px)",
              transition: isExiting
                ? `all ${isMobile ? 300 : 450}ms cubic-bezier(0.4, 0, 0.2, 1) ${isMobile ? 80 : 120}ms`
                : `all 700ms cubic-bezier(0.16, 1, 0.3, 1) 300ms`,
            }}
          >
            Sua Biblioteca Local
          </p>

          {/* Features */}
          <div 
            style={{
              marginTop: 'clamp(35px, 6vh, 70px)',
              gap: 'clamp(10px, 3vh, 30px)',
              opacity: isExiting ? 0 : isVisible ? 1 : 0,
              transform: isExiting 
                ? `translateY(${isMobile ? "15px" : "25px"})` 
                : isVisible ? "translateY(0)" : "translateY(20px)",
              filter: isExiting && !isMobile ? "blur(4px)" : "blur(0px)",
              transition: isExiting
                ? `all ${isMobile ? 250 : 400}ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`
                : `all 700ms cubic-bezier(0.16, 1, 0.3, 1) 500ms`,
            }}
            className="flex flex-wrap justify-center"
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex items-center gap-[0.8vh] rounded-full border border-purple-500/30 bg-purple-950/30 px-[2vh] py-[1vh] md:gap-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 ${
                  isMobile 
                    ? "" 
                    : "backdrop-blur-sm hover:border-purple-400/50 hover:bg-purple-900/40"
                }`}
                style={{
                  boxShadow: isMobile ? "none" : "0 0 20px rgba(168, 85, 247, 0.1)",
                  opacity: isExiting ? 0 : isVisible ? 1 : 0,
                  transform: isExiting ? "scale(0.9)" : isVisible ? "scale(1)" : "scale(0.95)",
                  transition: isExiting
                    ? `all ${isMobile ? 200 : 300}ms cubic-bezier(0.4, 0, 0.2, 1) ${index * (isMobile ? 30 : 50)}ms`
                    : `all 500ms cubic-bezier(0.16, 1, 0.3, 1) ${600 + index * 80}ms`,
                }}
              >
                <feature.icon className="h-[1.8vh] w-[1.8vh] min-h-[14px] min-w-[14px] text-purple-400 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                <span 
                  className="font-medium text-purple-200 md:text-base lg:text-lg"
                  style={{ fontSize: 'clamp(12px, 1.5vh, 18px)' }}
                >
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 📦 BOTÃO + HINT */}
        <div className="flex flex-col items-center gap-[2vh] md:gap-5 lg:gap-6">
          
          {/* Botão CTA */}
          <button
            onClick={handleNavigate}
            disabled={isExiting}
            className={`group relative overflow-hidden rounded-2xl font-semibold text-white active:scale-95 disabled:pointer-events-none md:rounded-3xl ${
              isMobile ? "" : "hover:scale-105 hover:shadow-2xl"
            }`}
            style={{
              padding: isMobile ? "clamp(12px, 1.8vh, 20px) clamp(24px, 3vh, 40px)" : undefined,
              fontSize: isMobile ? "clamp(14px, 2.2vh, 20px)" : undefined,
              border: "2px solid rgba(168, 85, 247, 0.5)",
              background: "linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.2))",
              boxShadow: isExiting
                ? isMobile
                  ? "0 0 50px rgba(168, 85, 247, 0.7), 0 0 100px rgba(168, 85, 247, 0.3)"
                  : "0 0 80px rgba(168, 85, 247, 0.8), 0 0 160px rgba(168, 85, 247, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                : isMobile
                  ? "0 0 20px rgba(168, 85, 247, 0.3)"
                  : "0 0 40px rgba(168, 85, 247, 0.4), 0 0 80px rgba(168, 85, 247, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              opacity: isExiting ? 0 : isVisible ? 1 : 0,
              transform: isExiting 
                ? `scale(${isMobile ? 1.05 : 1.15})` 
                : isVisible ? "scale(1) translateY(0)" : "scale(1) translateY(15px)",
              filter: isExiting && !isMobile ? "blur(8px)" : "blur(0px)",
              transition: isExiting
                ? `all ${isMobile ? 400 : 600}ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`
                : `all 600ms cubic-bezier(0.16, 1, 0.3, 1) 700ms`,
            }}
          >
            {/* Hover overlay - Só em desktop */}
            {!isMobile && (
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.3))" }}
              />
            )}
            
            <span className="relative z-10 flex items-center gap-[1vh] tracking-wide md:gap-3 md:px-10 md:py-4 md:text-xl lg:px-12 lg:py-5 lg:text-2xl">
              {isExiting ? "Entrando..." : "Começar agora"}
              <ArrowRight 
                className="h-[2.5vh] w-[2.5vh] min-h-[18px] min-w-[18px] md:h-7 md:w-7 lg:h-8 lg:w-8"
                style={{
                  transform: isExiting ? "translateX(8px)" : "translateX(0)",
                  transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </span>
            
            {/* Shine effect - Só em desktop */}
            {!isMobile && (
              <div
                className="absolute inset-0 -translate-x-full opacity-50 transition-transform duration-1000 group-hover:translate-x-full"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)" }}
              />
            )}
            
            {/* Ping effect - Só em desktop */}
            {!isMobile && !isExiting && (
              <div 
                className="absolute inset-0 rounded-2xl opacity-75 md:rounded-3xl"
                style={{
                  background: "linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.2))",
                  animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
                }}
              />
            )}
          </button>

          {/* Hint */}
          <p
            className="text-gray-500 md:text-sm lg:text-base"
            style={{ 
              fontSize: 'clamp(11px, 1.3vh, 14px)',
              opacity: isExiting ? 0 : isVisible ? 1 : 0,
              transform: isExiting ? "translateY(10px)" : isVisible ? "translateY(0)" : "translateY(5px)",
              transition: isExiting
                ? `all ${isMobile ? 200 : 350}ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`
                : `all 600ms cubic-bezier(0.16, 1, 0.3, 1) 1000ms`,
            }}
          >
            Seus dados ficam salvos localmente no seu dispositivo
          </p>
        </div>
      </div>

      {/* 🎬 ANIMAÇÕES GLOBAIS */}
      <style jsx global>{`
        .arcana-title {
          font-size: clamp(60px, 9vh, 100px);
          margin-top: clamp(-30px, -4vh, -15px);
        }
        
        @media (min-width: 768px) {
          .arcana-title {
            font-size: 6rem;
            margin-top: 0;
          }
        }
        
        @media (min-width: 1024px) {
          .arcana-title {
            font-size: 8rem;
          }
        }
        
        @media (min-width: 1280px) {
          .arcana-title {
            font-size: 9rem;
          }
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(1.1);
            opacity: 0;
          }
        }
      `}</style>
    </main>
  )
}