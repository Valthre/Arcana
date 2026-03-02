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
    
    // Marca como visitado ANTES de navegar
    markAsVisited()
    
    setTimeout(() => {
      router.push("/deck")
    }, isMobile ? 500 : 800)
  }

  const features = [
    { icon: Code2, text: "Snippets organizados" },
    { icon: Lock, text: "100% local e privado" },
    { icon: Zap, text: "Acesso instantâneo" },
  ]

  /* ════════════════════════════════════════════════════════════════
     ⏳ LOADING: Tela preta enquanto verifica se é primeira visita
     Evita "flash" da welcome antes de redirecionar
  ════════════════════════════════════════════════════════════════ */
  if (isLoading || !isFirstVisit) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black">
        {/* Pode adicionar um loader sutil aqui se quiser */}
        <div className="flex min-h-screen items-center justify-center">
          <div 
            className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent"
          />
        </div>
      </main>
    )
  }

  /* ════════════════════════════════════════════════════════════════
     🎨 WELCOME PAGE - Só renderiza na primeira visita
  ════════════════════════════════════════════════════════════════ */
  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <Starfield />

      {/* Flash de saída */}
      {isMobile ? (
        <div 
          className={`pointer-events-none fixed inset-0 z-50 transition-opacity duration-300 ${
            isExiting ? "opacity-100" : "opacity-0"
          }`}
          style={{ background: "rgba(147, 51, 234, 0.8)" }}
        />
      ) : (
        <div 
          className={`pointer-events-none fixed inset-0 z-50 bg-linear-to-br from-purple-600 via-pink-500 to-cyan-500 transition-opacity duration-500 ${
            isExiting ? "opacity-100" : "opacity-0"
          }`}
          style={{ mixBlendMode: "screen" }}
        />
      )}

      {/* Cortina de saída */}
      {isMobile ? (
        <div 
          className={`pointer-events-none fixed inset-0 z-40 bg-black transition-opacity duration-400 ${
            isExiting ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : (
        <div 
          className={`pointer-events-none fixed inset-0 z-40 bg-black transition-all duration-700 ease-in-out ${
            isExiting ? "opacity-100" : "opacity-0"
          }`}
          style={{
            clipPath: isExiting ? "circle(150% at 50% 50%)" : "circle(0% at 50% 50%)",
            transition: "clip-path 0.8s ease-in-out, opacity 0.3s ease-out",
          }}
        />
      )}

      {/* Orbs */}
      <div 
        className={`absolute left-1/4 top-1/4 rounded-full transition-all duration-700 ${
          isMobile 
            ? `h-48 w-48 bg-purple-600/10 blur-[50px] ${isExiting ? "scale-150 opacity-0" : ""}`
            : `h-96 w-96 bg-purple-600/20 blur-[120px] ${isExiting ? "scale-150 opacity-0" : "animate-pulse"}`
        }`} 
      />
      <div 
        className={`absolute bottom-1/4 right-1/4 rounded-full transition-all duration-700 ${
          isMobile 
            ? `h-48 w-48 bg-cyan-600/10 blur-[50px] ${isExiting ? "scale-150 opacity-0" : ""}`
            : `h-96 w-96 bg-cyan-600/20 blur-[120px] ${isExiting ? "scale-150 opacity-0" : "animate-pulse"}`
        }`} 
        style={{ animationDelay: isMobile ? undefined : "1s" }} 
      />

      {/* Container Central */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-between px-4 py-[7vh] md:h-auto md:justify-center md:gap-12 md:py-12 lg:gap-16 lg:py-16">
        
        {/* Logo */}
        <div 
          className={`transition-all duration-700 ${
            isExiting 
              ? isMobile
                ? "scale-110 opacity-0"
                : "scale-150 opacity-0 blur-lg" 
              : isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 -translate-y-10"
          }`}
        >
          <div className="relative h-[16vh] w-[16vh] min-h-[80px] min-w-[80px] md:h-28 md:w-28 lg:h-32 lg:w-32">
            <div 
              className={`absolute inset-0 rounded-2xl bg-linear-to-br from-purple-600 to-pink-600 opacity-50 md:rounded-3xl ${
                isMobile ? "blur-xl" : "blur-2xl animate-pulse"
              }`} 
            />
            <img 
              src="/images/icon.png"
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

        {/* Conteúdo Central */}
        <div className="flex flex-col items-center gap-[2.5vh] text-center md:gap-5 lg:gap-6">
          
          {/* "Bem-vindo ao" */}
          <h2
            className={`text-[3.5vh] font-medium tracking-wide transition-all duration-700 md:text-3xl lg:text-4xl xl:text-5xl ${
              isExiting 
                ? isMobile
                  ? "-translate-y-5 opacity-0"
                  : "-translate-y-10 opacity-0 blur-sm" 
                : isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-10"
            }`}
            style={{
              marginTop: 'clamp(-30px, -4vh, -15px)',
              background: "linear-gradient(90deg, #d946ef 0%, #a855f7 30%, #6366f1 50%, #3b82f6 70%, #22d3ee 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              transitionDelay: isExiting ? "0ms" : "100ms",
            }}
          >
            Bem-vindo ao
          </h2>

          {/* "ARCANA" */}
          <h1
            className={`arcana-title font-black tracking-wider transition-all duration-700 md:text-8xl lg:text-9xl ${
              isExiting 
                ? isMobile
                  ? "scale-105 opacity-0"
                  : "scale-110 opacity-0 blur-md" 
                : isVisible 
                  ? "opacity-100 scale-100" 
                  : "opacity-0 scale-90"
            }`}
            style={{
              background: "linear-gradient(90deg, #d946ef 0%, #a855f7 20%, #6366f1 40%, #3b82f6 60%, #22d3ee 80%, #06b6d4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: isExiting 
                ? isMobile
                  ? "drop-shadow(0 0 30px rgba(147, 51, 234, 0.6))"
                  : "drop-shadow(0 0 60px rgba(147, 51, 234, 0.8)) drop-shadow(0 0 120px rgba(34, 211, 238, 0.5))"
                : isMobile
                  ? "drop-shadow(0 0 20px rgba(147, 51, 234, 0.4))"
                  : "drop-shadow(0 0 40px rgba(147, 51, 234, 0.6)) drop-shadow(0 0 80px rgba(34, 211, 238, 0.3))",
              transitionDelay: isExiting ? "50ms" : "200ms",
            }}
          >
            ARCANA
          </h1>

          {/* Tagline */}
          <p
            className={`-mt-[4vh] text-[2.2vh] font-medium italic tracking-wide transition-all duration-700 md:mt-0 md:text-xl lg:text-2xl xl:text-3xl ${
              isExiting 
                ? isMobile
                  ? "translate-y-5 opacity-0"
                  : "translate-y-10 opacity-0 blur-sm" 
                : isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-10"
            }`}
            style={{
              marginTop: 'clamp(-30px, -4vh, -20px)',
              background: "linear-gradient(90deg, #8b5cf6, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 30px rgba(139, 92, 246, 0.8)",
              transitionDelay: isExiting ? "100ms" : "300ms",
            }}
          >
            Sua Biblioteca Local
          </p>

          {/* Features */}
          <div 
            className={`flex flex-wrap justify-center transition-all duration-700 md:mt-8 md:gap-4 lg:mt-10 lg:gap-5 ${
              isExiting 
                ? isMobile
                  ? "translate-y-5 opacity-0"
                  : "translate-y-10 opacity-0 blur-sm" 
                : isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-10"
            }`}
            style={{
              marginTop: 'clamp(35px, 6vh, 70px)',
              gap: 'clamp(10px, 3vh, 30px)'
            }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex items-center gap-[0.8vh] rounded-full border border-purple-500/30 bg-purple-950/30 px-[2vh] py-[1vh] transition-all md:gap-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 ${
                  isMobile 
                    ? "" 
                    : "backdrop-blur-sm hover:border-purple-400/50 hover:bg-purple-900/40"
                } ${
                  isExiting ? "scale-90" : ""
                }`}
                style={{
                  boxShadow: isMobile ? "none" : "0 0 20px rgba(168, 85, 247, 0.1)",
                  transitionDelay: isExiting 
                    ? `${(isMobile ? 75 : 150) + index * (isMobile ? 25 : 50)}ms` 
                    : `${600 + index * 100}ms`,
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

        {/* Botão + Hint */}
        <div className="flex flex-col items-center gap-[2vh] md:gap-5 lg:gap-6">
          
          {/* Botão CTA */}
          <button
            onClick={handleNavigate}
            disabled={isExiting}
            className={`group relative overflow-hidden rounded-2xl px-[3vh] py-[1.8vh] text-[2.2vh] font-semibold text-white transition-all duration-500 active:scale-95 disabled:pointer-events-none md:rounded-3xl md:px-10 md:py-4 md:text-xl lg:px-12 lg:py-5 lg:text-2xl ${
              isMobile ? "" : "hover:scale-105 hover:shadow-2xl"
            } ${
              isExiting 
                ? isMobile
                  ? "scale-105 opacity-0"
                  : "scale-125 opacity-0 blur-lg" 
                : isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-10"
            }`}
            style={{
              border: "2px solid rgba(168, 85, 247, 0.5)",
              background: "linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.2))",
              boxShadow: isExiting
                ? isMobile
                  ? "0 0 40px rgba(168, 85, 247, 0.6)"
                  : "0 0 80px rgba(168, 85, 247, 0.8), 0 0 160px rgba(168, 85, 247, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                : isMobile
                  ? "0 0 20px rgba(168, 85, 247, 0.3)"
                  : "0 0 40px rgba(168, 85, 247, 0.4), 0 0 80px rgba(168, 85, 247, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              transitionDelay: isExiting ? "0ms" : "700ms",
            }}
          >
            {/* Hover overlay - Só em desktop */}
            {!isMobile && (
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.3))" }}
              />
            )}
            
            <span className="relative z-10 flex items-center gap-[1vh] tracking-wide md:gap-3">
              {isExiting ? "Entrando..." : "Começar agora"}
              <ArrowRight 
                className={`h-[2.5vh] w-[2.5vh] min-h-[18px] min-w-[18px] transition-transform md:h-7 md:w-7 lg:h-8 lg:w-8 ${
                  isExiting ? "translate-x-2" : "group-hover:translate-x-1"
                }`} 
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
            className={`text-gray-500 transition-all duration-700 md:text-sm lg:text-base ${
              isExiting 
                ? "translate-y-5 opacity-0" 
                : isVisible 
                  ? "opacity-100" 
                  : "opacity-0"
            }`}
            style={{ 
              transitionDelay: isExiting ? "200ms" : "1000ms",
              fontSize: 'clamp(11px, 1.3vh, 14px)'
            }}
          >
            Seus dados ficam salvos localmente no seu dispositivo
          </p>
        </div>
      </div>

      {/* Animações Globais */}
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

        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(5px); }
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