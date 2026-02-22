// lib/file-handler.ts
import { Capacitor } from "@capacitor/core"
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem"
import { Share } from "@capacitor/share"

export function isNativeApp(): boolean {
  return Capacitor.isNativePlatform()
}

export async function exportJsonFile(
  data: object,
  filename: string
): Promise<{ success: boolean; message: string }> {
  const jsonString = JSON.stringify(data, null, 2)

  try {
    if (isNativeApp()) {
      const result = await Filesystem.writeFile({
        path: filename,
        data: jsonString,
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
      })

      await Share.share({
        title: "Backup Arcana",
        text: "Backup das suas cartas e configurações",
        url: result.uri,
        dialogTitle: "Salvar backup",
      })

      return { success: true, message: "Backup exportado com sucesso!" }
    } else {
      const blob = new Blob([jsonString], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      return { success: true, message: "Backup baixado com sucesso!" }
    }
  } catch (error: any) {
    if (error?.message?.includes("cancel") || error?.message?.includes("abort") || error?.message?.includes("dismissed")) {
      return { success: true, message: "Operação cancelada" }
    }
    return { success: false, message: "Erro ao exportar backup" }
  }
}

export async function shareJsonFile(
  data: object,
  filename: string
): Promise<{ success: boolean; message: string }> {
  const jsonString = JSON.stringify(data, null, 2)

  try {
    if (isNativeApp()) {
      const result = await Filesystem.writeFile({
        path: filename,
        data: jsonString,
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
      })

      await Share.share({
        title: "Backup Arcana",
        text: "Backup das suas cartas e configurações",
        url: result.uri,
        dialogTitle: "Compartilhar backup",
      })

      return { success: true, message: "Backup compartilhado!" }
    } else {
      if (navigator.share) {
        const blob = new Blob([jsonString], { type: "application/json" })
        const file = new File([blob], filename, { type: "application/json" })
        await navigator.share({ title: "Backup Arcana", files: [file] })
        return { success: true, message: "Backup compartilhado!" }
      }
      return { success: false, message: "Compartilhamento não disponível" }
    }
  } catch (error: any) {
    if (error?.message?.includes("cancel") || error?.message?.includes("abort") || error?.message?.includes("dismissed")) {
      return { success: true, message: "Compartilhamento cancelado" }
    }
    return { success: false, message: "Erro ao compartilhar" }
  }
}

export async function copyJsonToClipboard(
  data: object
): Promise<{ success: boolean; message: string }> {
  try {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    return { success: true, message: "Copiado para a área de transferência!" }
  } catch {
    return { success: false, message: "Erro ao copiar" }
  }
}