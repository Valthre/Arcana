// lib/device.ts
import { Capacitor } from "@capacitor/core"

/**
 * Detecta se está rodando no Capacitor (APK)
 * Usado para: Backup (Filesystem + Share vs Blob URL)
 */
export function isNativeApp(): boolean {
  return Capacitor.isNativePlatform()
}

/**
 * Detecta se é dispositivo mobile (user agent + largura)
 * Usado para: Settings padrão na inicialização
 * 
 * ⚠️ Função pura - pode ser chamada fora de componentes
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false
  
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768
  )
}