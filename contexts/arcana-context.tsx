"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { exportJsonFile, shareJsonFile, copyJsonToClipboard } from "@/lib/file-handler"

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS E INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export interface Card {
  id: string
  title: string
  content: string
  language: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ArcanaSettings {
  darkMode: boolean
  fogIntensity: number
  neonIntensity: number
  starCount: number
  autoStars: boolean
  performanceMode: boolean
  customFPS: number
  glowQuality: "none" | "low" | "medium" | "high"
  enableAnimations: boolean
}

interface BackupResult {
  success: boolean
  message: string
  method?: "download" | "share" | "clipboard"
}

interface ArcanaContextType {
  cards: Card[]
  settings: ArcanaSettings
  addCard: (card: Omit<Card, "id" | "createdAt" | "updatedAt">) => void
  updateCard: (id: string, card: Partial<Card>) => void
  deleteCard: (id: string) => void
  updateSettings: (settings: Partial<ArcanaSettings>) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedTags: string[]
  setSelectedTags: (tags: string[]) => void
  exportData: () => Promise<BackupResult>
  importData: (data: string) => Promise<BackupResult>
  getBackupData: () => string
  shareBackup: () => Promise<BackupResult>
  copyBackupToClipboard: () => Promise<BackupResult>
}

const ArcanaContext = createContext<ArcanaContextType | null>(null)

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURAÇÕES DO BANCO DE DADOS
// ═══════════════════════════════════════════════════════════════════════════

const DB_NAME = "arcana-db"
const DB_VERSION = 1
const CARDS_STORE = "cards"
const SETTINGS_STORE = "settings"

// ═══════════════════════════════════════════════════════════════════════════
// UTILITÁRIOS DE DETECÇÃO
// ═══════════════════════════════════════════════════════════════════════════

function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURAÇÕES PADRÃO
// ═══════════════════════════════════════════════════════════════════════════

const defaultSettings: ArcanaSettings = {
  darkMode: false,
  fogIntensity: 50,
  neonIntensity: 70,
  starCount: isMobileDevice() ? 150 : 250,
  autoStars: true,
  performanceMode: isMobileDevice(),
  customFPS: 60,
  glowQuality: "high",
  enableAnimations: true,
}

const sampleCards: Card[] = []

// ═══════════════════════════════════════════════════════════════════════════
// FUNÇÕES DO INDEXEDDB
// ═══════════════════════════════════════════════════════════════════════════

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      if (!db.objectStoreNames.contains(CARDS_STORE)) {
        db.createObjectStore(CARDS_STORE, { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE, { keyPath: "id" })
      }
    }
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNÇÕES AUXILIARES PARA BACKUP
// ═══════════════════════════════════════════════════════════════════════════

function getBackupFileName(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `arcana-backup-${year}-${month}-${day}_${hours}-${minutes}.json`
}

// ═══════════════════════════════════════════════════════════════════════════
// PROVIDER PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

export function ArcanaProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<Card[]>([])
  const [settings, setSettings] = useState<ArcanaSettings>(defaultSettings)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // ═════════════════════════════════════════════════════════════════════════
  // INICIALIZAÇÃO DO BANCO
  // ═════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    const initDB = async () => {
      try {
        const db = await openDB()

        const cardsTransaction = db.transaction(CARDS_STORE, "readonly")
        const cardsStore = cardsTransaction.objectStore(CARDS_STORE)
        const cardsRequest = cardsStore.getAll()

        cardsRequest.onsuccess = () => {
          const loadedCards = cardsRequest.result
          if (loadedCards.length === 0) {
            setCards(sampleCards)
            const writeTransaction = db.transaction(CARDS_STORE, "readwrite")
            const writeStore = writeTransaction.objectStore(CARDS_STORE)
            sampleCards.forEach((card) => writeStore.add(card))
          } else {
            setCards(
              loadedCards.map((card: Card) => ({
                ...card,
                createdAt: new Date(card.createdAt),
                updatedAt: new Date(card.updatedAt),
              })),
            )
          }
        }

        const settingsTransaction = db.transaction(SETTINGS_STORE, "readonly")
        const settingsStore = settingsTransaction.objectStore(SETTINGS_STORE)
        const settingsRequest = settingsStore.get("main")

        settingsRequest.onsuccess = () => {
          if (settingsRequest.result) {
            setSettings(settingsRequest.result.data)
          }
        }

        setIsInitialized(true)
      } catch (error) {
        console.error("Failed to initialize IndexedDB:", error)
        setCards(sampleCards)
        setIsInitialized(true)
      }
    }

    initDB()
  }, [])

  // ═════════════════════════════════════════════════════════════════════════
  // FUNÇÕES DE PERSISTÊNCIA
  // ═════════════════════════════════════════════════════════════════════════

  const saveCards = async (newCards: Card[]) => {
    try {
      const db = await openDB()
      const transaction = db.transaction(CARDS_STORE, "readwrite")
      const store = transaction.objectStore(CARDS_STORE)

      store.clear()
      newCards.forEach((card) => store.add(card))
    } catch (error) {
      console.error("Failed to save cards:", error)
    }
  }

  const saveSettings = async (newSettings: ArcanaSettings) => {
    try {
      const db = await openDB()
      const transaction = db.transaction(SETTINGS_STORE, "readwrite")
      const store = transaction.objectStore(SETTINGS_STORE)

      store.put({ id: "main", data: newSettings })
    } catch (error) {
      console.error("Failed to save settings:", error)
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // CRUD DE CARDS
  // ═════════════════════════════════════════════════════════════════════════

  const addCard = (cardData: Omit<Card, "id" | "createdAt" | "updatedAt">) => {
    const newCard: Card = {
      ...cardData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const newCards = [...cards, newCard]
    setCards(newCards)
    saveCards(newCards)
  }

  const updateCard = (id: string, cardData: Partial<Card>) => {
    const newCards = cards.map((card) => 
      card.id === id ? { ...card, ...cardData, updatedAt: new Date() } : card
    )
    setCards(newCards)
    saveCards(newCards)
  }

  const deleteCard = (id: string) => {
    const newCards = cards.filter((card) => card.id !== id)
    setCards(newCards)
    saveCards(newCards)
  }

  const updateSettings = (newSettings: Partial<ArcanaSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    saveSettings(updated)
  }

  // ═════════════════════════════════════════════════════════════════════════
  // FUNÇÕES DE BACKUP — CAPACITOR + NAVEGADOR
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Monta o objeto de backup com metadados
   */
  const buildBackupData = () => ({
    _meta: {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      cardCount: cards.length,
    },
    cards,
    settings,
  })

  const getBackupData = (): string => {
    return JSON.stringify(buildBackupData(), null, 2)
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * 📦 EXPORTAR BACKUP
   * 
   * 📱 Capacitor (APK): Filesystem.writeFile → Share nativo
   * 🖥️ Navegador: Download via anchor tag (blob URL)
   * 
   * Usa o file-handler.ts que detecta automaticamente o ambiente
   * ════════════════════════════════════════════════════════════════
   */
  const exportData = async (): Promise<BackupResult> => {
    try {
      const data = buildBackupData()
      const filename = getBackupFileName()
      const result = await exportJsonFile(data, filename)
      
      return {
        ...result,
        method: "download",
      }
    } catch (error) {
      console.error("Export failed:", error)
      return {
        success: false,
        message: "Erro ao exportar dados. Tente novamente.",
      }
    }
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * 📤 COMPARTILHAR BACKUP
   * 
   * 📱 Capacitor: Filesystem → Share nativo do Android
   * 🖥️ Navegador: Web Share API (se disponível)
   * ════════════════════════════════════════════════════════════════
   */
  const shareBackup = async (): Promise<BackupResult> => {
    try {
      const data = buildBackupData()
      const filename = getBackupFileName()
      const result = await shareJsonFile(data, filename)

      // Se compartilhamento falhou, tenta download como fallback
      if (!result.success) {
        const downloadResult = await exportJsonFile(data, filename)
        return {
          ...downloadResult,
          method: "download",
        }
      }

      return {
        ...result,
        method: "share",
      }
    } catch (error) {
      console.error("Share failed:", error)
      return {
        success: false,
        message: "Erro ao compartilhar. Tente novamente.",
      }
    }
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * 📋 COPIAR PARA CLIPBOARD
   * Funciona igual em Capacitor e navegador
   * ════════════════════════════════════════════════════════════════
   */
  const copyBackupToClipboard = async (): Promise<BackupResult> => {
    try {
      const data = buildBackupData()
      const result = await copyJsonToClipboard(data)

      return {
        ...result,
        method: "clipboard",
      }
    } catch (error) {
      console.error("Copy to clipboard failed:", error)
      return {
        success: false,
        message: "Erro ao copiar. Verifique as permissões.",
      }
    }
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * 📥 IMPORTAR BACKUP
   * Funciona igual em ambos (o FileReader do input lê o arquivo)
   * ════════════════════════════════════════════════════════════════
   */
  const importData = async (data: string): Promise<BackupResult> => {
    try {
      const parsed = JSON.parse(data)
      
      if (!parsed.cards && !parsed.settings) {
        return {
          success: false,
          message: "Arquivo inválido. Não contém dados do Arcana.",
        }
      }

      let importedCount = 0

      if (parsed.cards && Array.isArray(parsed.cards)) {
        const importedCards = parsed.cards.map((card: Card) => ({
          ...card,
          createdAt: new Date(card.createdAt),
          updatedAt: new Date(card.updatedAt),
        }))
        setCards(importedCards)
        await saveCards(importedCards)
        importedCount = importedCards.length
      }

      if (parsed.settings) {
        const importedSettings = {
          ...defaultSettings,
          ...parsed.settings,
        }
        setSettings(importedSettings)
        await saveSettings(importedSettings)
      }

      return {
        success: true,
        message: `Backup restaurado! ${importedCount} carta${importedCount !== 1 ? 's' : ''} importada${importedCount !== 1 ? 's' : ''}.`,
      }
    } catch (error) {
      console.error("Import failed:", error)
      
      if (error instanceof SyntaxError) {
        return {
          success: false,
          message: "Arquivo corrompido ou formato inválido.",
        }
      }

      return {
        success: false,
        message: "Erro ao importar dados. Verifique o arquivo.",
      }
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // LOADING STATE
  // ═════════════════════════════════════════════════════════════════════════

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-arcana-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-arcana-purple border-t-transparent" />
          <span className="text-sm text-gray-500">Carregando...</span>
        </div>
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════════════════
  // PROVIDER
  // ═════════════════════════════════════════════════════════════════════════

  return (
    <ArcanaContext.Provider
      value={{
        cards,
        settings,
        addCard,
        updateCard,
        deleteCard,
        updateSettings,
        searchQuery,
        setSearchQuery,
        selectedTags,
        setSelectedTags,
        exportData,
        importData,
        getBackupData,
        shareBackup,
        copyBackupToClipboard,
      }}
    >
      {children}
    </ArcanaContext.Provider>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useArcana() {
  const context = useContext(ArcanaContext)
  if (!context) {
    throw new Error("useArcana must be used within an ArcanaProvider")
  }
  return context
}