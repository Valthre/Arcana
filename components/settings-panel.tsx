// components/settings-panel.tsx
"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { X, Download, Upload, Share2, Copy, Check, AlertCircle, Zap, Settings, Gauge, Sparkles as SparklesIcon, Smartphone } from "lucide-react"
import { useArcana } from "@/contexts/arcana-context"
import { useDeviceOptimization } from "@/hooks/use-device-optimization"
import { useFirstVisit } from "@/hooks/use-first-visit"

interface SettingsPanelProps {
  onClose: () => void
}

// Componente de Toast com animação melhorada
function Toast({ 
  message, 
  type, 
  onClose 
}: { 
  message: string
  type: "success" | "error" | "info"
  onClose: () => void 
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true))
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const bgColor = {
    success: "bg-green-500/20 border-green-500/40",
    error: "bg-red-500/20 border-red-500/40",
    info: "bg-arcana-purple/20 border-arcana-purple/40"
  }[type]

  const iconColor = {
    success: "text-green-400",
    error: "text-red-400",
    info: "text-arcana-purple"
  }[type]

  return (
    <div 
      className={`fixed bottom-4 left-1/2 z-100 -translate-x-1/2 transform rounded-lg border ${bgColor} px-4 py-3 shadow-lg backdrop-blur-md transition-all duration-300 ease-out ${
        isVisible 
          ? "translate-y-0 opacity-100" 
          : "translate-y-4 opacity-0"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`transition-transform duration-300 ${isVisible ? "scale-100" : "scale-0"}`}>
          {type === "success" ? (
            <Check className={`h-4 w-4 ${iconColor}`} />
          ) : (
            <AlertCircle className={`h-4 w-4 ${iconColor}`} />
          )}
        </div>
        <span className="text-sm text-foreground">{message}</span>
        <button 
          onClick={handleClose} 
          className="ml-2 text-muted-foreground transition-all duration-200 hover:rotate-90 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { 
    settings, 
    updateSettings, 
    exportData, 
    importData,
    shareBackup,
    copyBackupToClipboard 
  } = useArcana()
  const { resetFirstVisit } = useFirstVisit()
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const { isMobile, shouldReduceEffects } = useDeviceOptimization()

  useEffect(() => {
    requestAnimationFrame(() => setIsOpen(true))
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setIsOpen(false)
    setTimeout(onClose, 300)
  }

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const result = await exportData()
      showToast(result.message, result.success ? "success" : "error")
    } catch (error) {
      showToast("Erro inesperado ao exportar", "error")
    } finally {
      setIsExporting(false)
    }
  }

  const handleShare = async () => {
    setIsExporting(true)
    try {
      const result = await shareBackup()
      if (!result.success) {
        const downloadResult = await exportData()
        showToast(downloadResult.message, downloadResult.success ? "success" : "error")
      } else {
        showToast(result.message, "success")
      }
    } catch (error) {
      showToast("Erro ao compartilhar", "error")
    } finally {
      setIsExporting(false)
    }
  }

  const handleCopyToClipboard = async () => {
    try {
      const result = await copyBackupToClipboard()
      showToast(result.message, result.success ? "success" : "error")
    } catch (error) {
      showToast("Erro ao copiar", "error")
    }
  }

  const handleResetFirstVisit = () => {
    try {
      resetFirstVisit()
      showToast("Primeira visita resetada", "success")
    } catch (e) {
      showToast("Erro ao resetar visita", "error")
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    
    const reader = new FileReader()
    reader.onload = async (event) => {
      const content = event.target?.result as string
      try {
        const result = await importData(content)
        showToast(result.message, result.success ? "success" : "error")
        if (result.success) {
          setTimeout(() => handleClose(), 1500)
        }
      } catch (error) {
        showToast("Erro ao processar arquivo", "error")
      } finally {
        setIsImporting(false)
      }
    }
    reader.onerror = () => {
      showToast("Erro ao ler arquivo", "error")
      setIsImporting(false)
    }
    reader.readAsText(file)
    
    e.target.value = ""
  }

  const maxStars = isMobile ? 300 : 500

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-2 backdrop-blur-sm transition-all duration-300 ease-out md:p-4 ${
          isOpen ? "bg-black/60" : "bg-black/0"
        }`}
        onClick={handleClose}
      >
        <div
          className={`relative max-h-[95vh] w-full max-w-xl overflow-hidden rounded-xl border border-arcana-purple/40 bg-arcana-dark/95 backdrop-blur-md transition-all duration-300 ease-out md:max-h-[90vh] md:rounded-2xl ${
            isOpen 
              ? "translate-y-0 scale-100 opacity-100" 
              : "translate-y-8 scale-95 opacity-0"
          }`}
          style={{
            boxShadow: isOpen 
              ? `0 0 ${40 * (settings.neonIntensity / 100)}px rgba(147, 51, 234, ${0.4 * (settings.neonIntensity / 100)}), 0 25px 50px -12px rgba(0, 0, 0, 0.5)` 
              : "none",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between border-b border-arcana-purple/20 p-3 md:items-center md:p-4">
            <div className={`transition-all duration-500 delay-100 ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}`}>
              <h2 className="text-lg font-bold text-foreground md:text-xl">Preferências Arcanas</h2>
              <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                Modifique sua interface e segurança. O Arcana armazena os seus dados no seu próprio dispositivo. Nada de
                nuvem!
              </p>
            </div>
            <button
              onClick={handleClose}
              className="rounded-lg p-1.5 text-muted-foreground transition-all duration-200 hover:rotate-90 hover:bg-arcana-purple/20 hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[calc(95vh-5rem)] overflow-y-auto p-3 md:max-h-[calc(90vh-6rem)] md:p-4">
            
            {/* ════════════════════════════════════════════════════════════════
                📱 BADGE: MODO MOBILE ATIVO
                Aparece apenas em dispositivos móveis
            ════════════════════════════════════════════════════════════════ */}
            {isMobile && (
              <div className={`mb-4 transition-all duration-500 delay-100 ${isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                <div 
                  className="flex items-center gap-3 rounded-lg p-3"
                  style={{
                    background: "linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(147, 51, 234, 0.1))",
                    border: "1px solid rgba(34, 211, 238, 0.25)"
                  }}
                >
                  <div 
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{ background: "rgba(34, 211, 238, 0.2)" }}
                  >
                    <Smartphone className="h-4 w-4 text-arcana-cyan" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-arcana-cyan">Modo Mobile Ativo</p>
                    <p className="text-[10px] text-muted-foreground">
                      Performance otimizada automaticamente ⚡
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Seção Visual */}
            <section className={`mb-6 transition-all duration-500 delay-150 ${isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:text-sm">
                Visual
              </h3>

              <div className="space-y-3 md:space-y-4">
                {/* Modo Escuro */}
                <div className="group flex items-center justify-between rounded-lg bg-arcana-dark/60 p-2.5 transition-all duration-200 hover:bg-arcana-dark/80 md:p-3">
                  <span className="text-xs text-foreground md:text-sm">
                  Modo escuro <span className="text-arcana-cyan opacity-70">(Em breve)</span>
                  </span>
                  <button
                    onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                    className={`relative h-6 w-11 rounded-full transition-all duration-300 ${
                      settings.darkMode ? "bg-arcana-purple" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                        settings.darkMode ? "left-[22px] rotate-180" : "left-0.5 rotate-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Intensidade da Névoa */}
                <div className="group rounded-lg bg-arcana-dark/60 p-2.5 transition-all duration-200 hover:bg-arcana-dark/80 md:p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-foreground md:text-sm">Intensidade da Névoa</span>
                    <span className="min-w-12 text-right text-xs font-medium text-arcana-purple transition-all duration-200 md:text-sm">
                      {settings.fogIntensity}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.fogIntensity}
                    onChange={(e) => updateSettings({ fogIntensity: Number(e.target.value) })}
                    className="w-full cursor-pointer accent-arcana-purple transition-all duration-200 hover:accent-arcana-pink"
                  />
                </div>

                {/* Intensidade do Neon */}
                <div className="group rounded-lg bg-arcana-dark/60 p-2.5 transition-all duration-200 hover:bg-arcana-dark/80 md:p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-foreground md:text-sm">Intensidade do Neon</span>
                    <span className="min-w-12 text-right text-xs font-medium text-arcana-purple transition-all duration-200 md:text-sm">
                      {settings.neonIntensity}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.neonIntensity}
                    onChange={(e) => updateSettings({ neonIntensity: Number(e.target.value) })}
                    className="w-full cursor-pointer accent-arcana-purple transition-all duration-200 hover:accent-arcana-pink"
                  />
                  
                  {/* 📱 Aviso de otimização automática em mobile */}
                  {isMobile && (
                    <p className="mt-2 text-[10px] text-arcana-cyan/70">
                      ⚡ Efeitos reduzidos automaticamente para melhor performance
                    </p>
                  )}
                </div>

                {/* ════════════════════════════════════════════════════════════════
                    🖥️ QUANTIDADE DE ESTRELAS - Só aparece em DESKTOP
                    Em mobile, o fundo é um vídeo pré-renderizado
                ════════════════════════════════════════════════════════════════ */}
                {!isMobile && (
                  <div className="group rounded-lg bg-arcana-dark/60 p-2.5 transition-all duration-200 hover:bg-arcana-dark/80 md:p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-foreground md:text-sm">Quantidade de Estrelas</span>
                        <span 
                          className={`rounded bg-arcana-purple/30 px-1.5 py-0.5 text-[10px] font-medium text-arcana-purple transition-all duration-300 ${
                            settings.autoStars ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                          }`}
                        >
                          AUTO
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="min-w-12 text-right text-xs font-medium text-arcana-purple transition-all duration-200 md:text-sm">
                          {settings.autoStars ? "Auto" : settings.starCount}
                        </span>
                        <button
                          onClick={() => updateSettings({ autoStars: !settings.autoStars })}
                          className={`rounded px-2 py-1 text-[10px] font-medium transition-all duration-300 ${
                            settings.autoStars
                              ? "bg-arcana-purple/30 text-arcana-purple hover:bg-arcana-purple/40 hover:scale-105"
                              : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 hover:scale-105"
                          }`}
                        >
                          {settings.autoStars ? "Manual" : "Auto"}
                        </button>
                      </div>
                    </div>
                    
                    <input
                      type="range"
                      min="0"
                      max={maxStars}
                      step="10"
                      value={settings.starCount}
                      onChange={(e) => updateSettings({ starCount: Number(e.target.value), autoStars: false })}
                      disabled={settings.autoStars}
                      className={`w-full cursor-pointer accent-arcana-purple transition-all duration-300 hover:accent-arcana-pink ${
                        settings.autoStars ? "opacity-50" : ""
                      }`}
                    />
                    
                    <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                      <span>Nenhuma (0)</span>
                      {settings.autoStars ? (
                        <span className="text-arcana-purple transition-all duration-300">
                          Ajustado automaticamente
                        </span>
                      ) : settings.starCount === 0 ? (
                        <span className="text-gray-400">Fundo preto</span>
                      ) : settings.starCount > 300 ? (
                        <span className="text-orange-400">⚠️ Pode afetar desempenho</span>
                      ) : null}
                      <span>Muitas ({maxStars})</span>
                    </div>
                  </div>
                )}

                {/* ════════════════════════════════════════════════════════════════
                    🖥️ MODO PERFORMANCE - Só aparece em DESKTOP
                    Em mobile, a otimização é automática
                ════════════════════════════════════════════════════════════════ */}
                {!isMobile && (
                  <div className="group rounded-lg bg-arcana-dark/60 p-2.5 transition-all duration-200 hover:bg-arcana-dark/80 md:p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className={`h-4 w-4 transition-colors ${settings.performanceMode ? "text-green-400" : "text-gray-500"}`} />
                        <div>
                          <span className="text-xs text-foreground md:text-sm">Modo Performance</span>
                          <p className="text-[10px] text-muted-foreground">
                            {settings.performanceMode 
                              ? "30 FPS • Glow reduzido • Bateria economizada" 
                              : "Controle manual de performance"
                            }
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => updateSettings({ performanceMode: !settings.performanceMode })}
                        className={`relative h-6 w-11 rounded-full transition-all duration-300 ${
                          settings.performanceMode ? "bg-green-500" : "bg-muted"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                            settings.performanceMode ? "left-[22px]" : "left-0.5"
                          }`}
                        />
                      </button>
                    </div>
                    
                    {settings.performanceMode && (
                      <div className="mt-2 rounded bg-green-500/10 p-2 text-[10px] text-green-400">
                        ✓ Configurações otimizadas automaticamente
                      </div>
                    )}
                  </div>
                )}

                {/* ════════════════════════════════════════════════════════════════
                    🖥️ CONFIGURAÇÕES AVANÇADAS - Só aparece em DESKTOP
                    Em mobile, não é necessário controle granular
                ════════════════════════════════════════════════════════════════ */}
                {!isMobile && (
                  <>
                    {/* Botão Configurações Avançadas */}
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="group flex w-full items-center justify-between rounded-lg bg-arcana-dark/60 p-2.5 transition-all duration-200 hover:bg-arcana-dark/80 md:p-3"
                    >
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-arcana-cyan" />
                        <span className="text-xs text-foreground md:text-sm">Configurações Avançadas</span>
                      </div>
                      <X className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${showAdvanced ? "rotate-0" : "rotate-45"}`} />
                    </button>

                    {/* Configurações Avançadas (Collapsible) */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 ${
                        showAdvanced ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="space-y-3 rounded-lg border border-arcana-cyan/20 bg-arcana-cyan/5 p-3">
                        {/* FPS Customizado */}
                        <div className="rounded-lg bg-arcana-dark/40 p-2.5">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Gauge className="h-3.5 w-3.5 text-arcana-cyan" />
                              <span className="text-xs text-foreground">
                               FPS (Quadros por Segundo) <span className="text-arcana-cyan opacity-70">Em breve</span>
                              </span>
                            </div>
                            <span className="text-xs font-medium text-arcana-cyan">
                              {settings.performanceMode ? "30 (Fixo)" : `${settings.customFPS} FPS`}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="15"
                            max="60"
                            step="5"
                            value={settings.customFPS}
                            onChange={(e) => updateSettings({ customFPS: Number(e.target.value) })}
                            disabled={settings.performanceMode}
                            className={`w-full cursor-pointer accent-arcana-cyan ${
                              settings.performanceMode ? "opacity-50" : ""
                            }`}
                          />
                          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                            <span>Economia (15)</span>
                            <span>Fluido (60)</span>
                          </div>
                        </div>

                        {/* Qualidade de Glow */}
                        <div className="rounded-lg bg-arcana-dark/40 p-2.5">
                          <div className="mb-2 flex items-center gap-2">
                            <SparklesIcon className="h-3.5 w-3.5 text-arcana-cyan" />
                            <span className="text-xs text-foreground">Qualidade do Glow</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {(["none", "low", "medium", "high"] as const).map((quality) => (
                              <button
                                key={quality}
                                onClick={() => updateSettings({ glowQuality: quality })}
                                disabled={settings.performanceMode && quality !== "low"}
                                className={`rounded px-2 py-1.5 text-[11px] font-medium transition-all duration-200 ${
                                  settings.glowQuality === quality
                                    ? "bg-arcana-cyan/30 text-arcana-cyan scale-105"
                                    : "bg-arcana-dark/60 text-gray-400 hover:bg-arcana-dark/80"
                                } ${settings.performanceMode && quality !== "low" ? "opacity-30 cursor-not-allowed" : ""}`}
                              >
                                {quality === "none" && "🚫 Nenhum"}
                                {quality === "low" && "⚡ Baixo"}
                                {quality === "medium" && "✨ Médio"}
                                {quality === "high" && "💫 Alto"}
                        
                        {/* After quality radio grid we will add reset button below in advanced options */}
                              </button>
                            ))}
                          </div>
                          <p className="mt-2 text-[10px] text-muted-foreground">
                            {settings.glowQuality === "none" && "Apenas pontos sólidos (mais rápido)"}
                            {settings.glowQuality === "low" && "Glow mínimo (rápido)"}
                            {settings.glowQuality === "medium" && "Glow simplificado (balanceado)"}
                            {settings.glowQuality === "high" && "Glow completo (melhor visual)"}
                          </p>
                        </div>

                        {/* Animações */}
                        <div className="flex items-center justify-between rounded-lg bg-arcana-dark/40 p-2.5">
                          <div className="flex items-center gap-2">
                            <SparklesIcon className="h-3.5 w-3.5 text-arcana-cyan" />
                            <div>
                              <span className="text-xs text-foreground">Animação das Estrelas</span>
                              <p className="text-[10px] text-muted-foreground">
                                {settings.enableAnimations ? "Pulsação ativada" : "Estrelas estáticas"}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => updateSettings({ enableAnimations: !settings.enableAnimations })}
                            disabled={settings.performanceMode}
                            className={`relative h-6 w-11 rounded-full transition-all duration-300 ${
                              settings.enableAnimations ? "bg-arcana-cyan" : "bg-muted"
                            } ${settings.performanceMode ? "opacity-50" : ""}`}
                          >
                            <span
                              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                                settings.enableAnimations ? "left-[22px]" : "left-0.5"
                              }`}
                            />
                          </button>
                        </div>

                        {/* Info */}
                        <div className="rounded bg-arcana-cyan/10 p-2 text-[10px] text-arcana-cyan">
                          💡 <strong>Dica:</strong> Desative "Modo Performance" para controlar manualmente
                        </div>

                        {/* Botão Para resetar primeira visita */}
                        <div className="mt-3">
                          <button
                            onClick={handleResetFirstVisit}
                            className="w-full rounded-lg bg-red-500/20 px-3 py-2 text-xs font-medium text-red-400 transition-all duration-200 hover:bg-red-500/30 hover:text-red-300"
                          >
                            Resetar primeira visita
                          </button>
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            <em>Reinicia o estado de primeiro acesso (apenas para testes).</em>
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Mudar Tema */}
                <div className="group flex items-center justify-between rounded-lg bg-arcana-dark/60 p-2.5 transition-all duration-200 hover:bg-arcana-dark/80 md:p-3">
                <span className="text-xs text-foreground md:text-sm">
                 Tema personalizada <span className="text-arcana-cyan opacity-70">Em breve</span>
                </span>
                  <button className="rounded-lg border border-arcana-purple/40 bg-arcana-purple/20 px-3 py-1.5 text-xs font-medium text-arcana-pink transition-all duration-200 hover:scale-105 hover:bg-arcana-purple/30 hover:shadow-lg hover:shadow-arcana-purple/20 md:px-4">
                    Importar Tema
                  </button>
                </div>
              </div>
            </section>

            {/* Seção Dados */}
            <section className={`mb-6 transition-all duration-500 delay-200 ${isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:text-sm">
                Dados
              </h3>

              <div className="space-y-3 md:space-y-4">
                <div className="group rounded-lg bg-arcana-dark/60 p-2.5 transition-all duration-200 hover:bg-arcana-dark/80 md:p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-foreground md:text-sm">Fazer Backup</span>
                      <p className="mt-0.5 text-[10px] text-muted-foreground md:text-xs">
                        Salve suas cartas e configurações
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleExport}
                      disabled={isExporting}
                      className="flex items-center gap-2 rounded-lg border border-arcana-purple/40 bg-arcana-purple/20 px-3 py-1.5 text-xs font-medium text-arcana-pink transition-all duration-200 hover:scale-105 hover:bg-arcana-purple/30 hover:shadow-lg hover:shadow-arcana-purple/20 disabled:opacity-50 disabled:hover:scale-100 md:px-4"
                    >
                      {isExporting ? (
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-arcana-pink border-t-transparent md:h-3.5 md:w-3.5" />
                      ) : (
                        <Download className="h-3 w-3 transition-transform duration-200 group-hover:-translate-y-0.5 md:h-3.5 md:w-3.5" />
                      )}
                      Baixar
                    </button>

                    {isMobile && (
                      <button
                        onClick={handleShare}
                        disabled={isExporting}
                        className="flex items-center gap-2 rounded-lg border border-arcana-cyan/40 bg-arcana-cyan/20 px-3 py-1.5 text-xs font-medium text-arcana-cyan transition-all duration-200 hover:scale-105 hover:bg-arcana-cyan/30 hover:shadow-lg hover:shadow-arcana-cyan/20 disabled:opacity-50 disabled:hover:scale-100 md:px-4"
                      >
                        <Share2 className="h-3 w-3 md:h-3.5 md:w-3.5" />
                        Compartilhar
                      </button>
                    )}

                    <button
                      onClick={handleCopyToClipboard}
                      className="flex items-center gap-2 rounded-lg border border-gray-500/40 bg-gray-500/10 px-3 py-1.5 text-xs font-medium text-gray-400 transition-all duration-200 hover:scale-105 hover:bg-gray-500/20 md:px-4"
                      title="Copiar dados para área de transferência"
                    >
                      <Copy className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      Copiar
                    </button>
                  </div>
                </div>

                <div className="group flex items-center justify-between rounded-lg bg-arcana-dark/60 p-2.5 transition-all duration-200 hover:bg-arcana-dark/80 md:p-3">
                  <div>
                    <span className="text-xs text-foreground md:text-sm">Importar Backup</span>
                    <p className="mt-0.5 text-[10px] text-muted-foreground md:text-xs">
                      Restaure de um arquivo .json
                    </p>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImport} 
                    accept=".json,application/json" 
                    className="hidden" 
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                    className="flex items-center gap-2 rounded-lg border border-arcana-purple/40 bg-arcana-purple/20 px-3 py-1.5 text-xs font-medium text-arcana-pink transition-all duration-200 hover:scale-105 hover:bg-arcana-purple/30 hover:shadow-lg hover:shadow-arcana-purple/20 disabled:opacity-50 disabled:hover:scale-100 md:px-4"
                  >
                    {isImporting ? (
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-arcana-pink border-t-transparent md:h-3.5 md:w-3.5" />
                    ) : (
                      <Upload className="h-3 w-3 transition-transform duration-200 group-hover:-translate-y-0.5 md:h-3.5 md:w-3.5" />
                    )}
                    Importar
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </>
  )
}