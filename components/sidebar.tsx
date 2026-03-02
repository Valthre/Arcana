"use client"

import { useState, useEffect } from "react"
import { LayoutGrid, Sparkles, Settings, Info, Menu, X } from "lucide-react"
import { useArcana } from "@/contexts/arcana-context"

interface SidebarProps {
  activeView: "deck" | "boost" | "sobre"
  onViewChange: (view: "deck" | "boost" | "sobre") => void
  onSettingsClick: () => void
}

const navItems = [
  { id: "deck" as const, label: "Deck", icon: LayoutGrid },
  { id: "boost" as const, label: "Boost", icon: Sparkles },
  { id: "sobre" as const, label: "Sobre", icon: Info },
]

export function Sidebar({ activeView, onViewChange, onSettingsClick }: SidebarProps) {
  const { settings } = useArcana()
  const neonIntensity = settings.neonIntensity / 100
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Fecha o menu ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Bloqueia scroll quando menu está aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isMobileMenuOpen])

  const handleNavClick = (id: "deck" | "boost" | "sobre") => {
    onViewChange(id)
    setIsMobileMenuOpen(false)
  }

  const handleSettingsClick = () => {
    onSettingsClick()
    setIsMobileMenuOpen(false)
  }

  // Labels para o header mobile
  const activeLabel = navItems.find(item => item.id === activeView)?.label || "Deck"
  const ActiveIcon = navItems.find(item => item.id === activeView)?.icon || LayoutGrid

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════
          📱 MOBILE: HEADER FIXO NO TOPO
          Só aparece em telas < 768px (md)
      ══════════════════════════════════════════════════════════════ */}
      <div 
  className="flex h-14 w-full items-center justify-between border-b border-arcana-purple/20 bg-arcana-dark/60 px-4 backdrop-blur-md md:hidden"
  style={{
    // 📱 Safe area: respeita status bar
    paddingTop: "env(safe-area-inset-top, 0px)",
  }}
>        
        {/* Botão Hambúrguer */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition-all duration-300 hover:bg-arcana-purple/10 hover:text-arcana-purple active:scale-95"
        >
          <Menu className={`h-5 w-5 transition-all duration-300 ${isMobileMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`} />
          <X className={`absolute h-5 w-5 transition-all duration-300 ${isMobileMenuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`} />
        </button>

        {/* Título da View Ativa */}
        <div className="flex items-center gap-2">
          <ActiveIcon className="h-4 w-4 text-arcana-purple" />
          <span className="text-sm font-semibold text-white">{activeLabel}</span>
        </div>

        {/* Espaço vazio para centralizar o título */}
        <div className="w-10" />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          📱 MOBILE: OVERLAY ESCURO
          Fecha o menu ao clicar fora
      ══════════════════════════════════════════════════════════════ */}
      <div 
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

{/* ══════════════════════════════════════════════════════════════
    📱 MOBILE: MENU DESLIZANTE (da esquerda)
══════════════════════════════════════════════════════════════ */}
<div 
  className={`fixed left-0 top-0 z-50 flex h-full w-56 flex-col border-r border-arcana-purple/30 bg-arcana-dark/95 backdrop-blur-xl transition-transform duration-300 ease-out md:hidden ${
    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
  }`}
  style={{
    // 📱 Safe area: respeita status bar e barra de navegação
    paddingTop: "env(safe-area-inset-top, 0px)",
    paddingBottom: "env(safe-area-inset-bottom, 0px)",
    boxShadow: isMobileMenuOpen 
      ? `4px 0 ${30 * neonIntensity}px rgba(147, 51, 234, ${0.2 * neonIntensity})`
      : "none"
  }}
>
        {/* Header do Menu Mobile */}
        <div className="flex items-center justify-between border-b border-arcana-purple/20 p-4">
          <div className="flex items-center gap-3">
            <img 
              src="/images/icon.png" 
              alt="Arcana" 
              className="h-8 w-8 rounded-lg border border-arcana-purple/40 object-cover"
              style={{ boxShadow: `0 0 ${10 * neonIntensity}px rgba(147, 51, 234, ${0.3 * neonIntensity})` }}
            />
            <span className="text-sm font-bold text-white">Arcana</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-arcana-purple/10 hover:text-white active:scale-95"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navegação Mobile */}
        <nav className="flex-1 p-3">
          <div className="space-y-1">
            {navItems.map(({ id, label, icon: Icon }, index) => {
              const isActive = activeView === id
              
              return (
                <button
                  key={id}
                  onClick={() => handleNavClick(id)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 transition-all duration-300 ${
                    isActive 
                      ? "bg-arcana-purple/20 text-arcana-purple" 
                      : "text-gray-400 hover:bg-arcana-purple/10 hover:text-white"
                  }`}
                  style={{
                    transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : "0ms",
                    boxShadow: isActive 
                      ? `0 0 ${15 * neonIntensity}px rgba(147, 51, 234, ${0.2 * neonIntensity})`
                      : "none"
                  }}
                >
                  {/* Indicador ativo */}
                  <div 
                    className={`h-6 w-1 rounded-full transition-all duration-300 ${
                      isActive ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                    }`}
                    style={{
                      background: "linear-gradient(180deg, #a855f7, #ec4899)",
                    }}
                  />
                  
                  <div className={`rounded-lg p-2 transition-all duration-300 ${
                    isActive ? "bg-arcana-purple/20" : "group-hover:bg-arcana-purple/10"
                  }`}>
                    <Icon className={`h-5 w-5 transition-all duration-300 ${
                      isActive ? "scale-110" : "group-hover:scale-105"
                    }`} />
                  </div>
                  
                  <span className={`text-sm font-medium transition-all duration-300 ${
                    isActive ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-80 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}>
                    {label}
                  </span>

                  {/* Badge para Boost */}
                  {id === "boost" && (
                    <span className="ml-auto rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-medium text-orange-400">
                      Novo
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Configurações (bottom) */}
        <div className="border-t border-arcana-purple/20 p-3">
          <button
            onClick={handleSettingsClick}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-gray-400 transition-all duration-300 hover:bg-arcana-purple/10 hover:text-white"
          >
            <div className="rounded-lg p-2 transition-all duration-300 group-hover:bg-arcana-purple/10">
              <Settings className="h-5 w-5 transition-transform duration-500 group-hover:rotate-90" />
            </div>
            <span className="text-sm font-medium">Configurações</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          🖥️ DESKTOP: SIDEBAR FIXA
          Só aparece em telas >= 768px (md)
      ══════════════════════════════════════════════════════════════ */}
      <aside 
        className="relative hidden h-full w-14 flex-col items-center justify-between border-r border-arcana-purple/30 bg-arcana-dark/40 py-6 backdrop-blur-md transition-all duration-300 md:flex lg:w-20"
      >
        {/* Linha decorativa superior */}
        <div 
          className="absolute left-3 right-3 top-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(147, 51, 234, 0.3), transparent)"
          }}
        />

        {/* Navegação Desktop */}
        <nav className="flex flex-col items-center gap-3 lg:gap-5">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeView === id
            
            return (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={`group relative flex flex-col items-center gap-1.5 rounded-xl p-1.5 transition-all duration-300 lg:gap-2 lg:p-2 ${
                  isActive 
                    ? "text-arcana-purple" 
                    : "text-gray-500 hover:text-arcana-pink"
                }`}
              >
                {/* Indicador ativo lateral */}
                <div 
                  className={`absolute -left-[7px] top-1/2 h-6 w-1 -translate-y-1/2 rounded-full transition-all duration-300 lg:-left-[10px] ${
                    isActive ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                  }`}
                  style={{
                    background: "linear-gradient(180deg, #a855f7, #ec4899)",
                    boxShadow: isActive 
                      ? `0 0 ${8 * neonIntensity}px rgba(168, 85, 247, ${0.6 * neonIntensity})`
                      : "none"
                  }}
                />

                <div
                  className={`rounded-lg p-1.5 transition-all duration-300 lg:rounded-xl lg:p-2.5 ${
                    isActive 
                      ? "bg-arcana-purple/20 scale-110" 
                      : "group-hover:bg-arcana-purple/10 group-hover:scale-105"
                  }`}
                  style={
                    isActive
                      ? { boxShadow: `0 0 ${12 * neonIntensity}px rgba(147, 51, 234, ${0.5 * neonIntensity})` }
                      : undefined
                  }
                >
                  <Icon className={`h-4 w-4 transition-all duration-300 lg:h-5 lg:w-5 ${
                    isActive ? "drop-shadow-sm" : ""
                  }`} />
                </div>

                <span className={`text-[9px] font-medium transition-all duration-300 lg:text-xs ${
                  isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                }`}>
                  {label}
                </span>
              </button>
            )
          })}
        </nav>

        {/* Config Desktop */}
        <button
          onClick={onSettingsClick}
          className="group flex flex-col items-center gap-1.5 rounded-xl p-1.5 text-gray-500 transition-all duration-300 hover:text-arcana-pink lg:gap-2 lg:p-2"
        >
          <div className="rounded-lg p-1.5 transition-all duration-300 group-hover:bg-arcana-purple/10 group-hover:scale-105 group-hover:rotate-45 lg:rounded-xl lg:p-2.5">
            <Settings className="h-4 w-4 transition-all duration-300 lg:h-5 lg:w-5" />
          </div>
          <span className="text-[9px] font-medium opacity-70 transition-all duration-300 group-hover:opacity-100 lg:text-xs">
            Config
          </span>
        </button>

        {/* Linha decorativa inferior */}
        <div 
          className="absolute bottom-0 left-3 right-3 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.2), transparent)"
          }}
        />
      </aside>
    </>
  )
}