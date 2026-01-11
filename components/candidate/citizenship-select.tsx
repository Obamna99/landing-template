"use client"

import * as React from "react"
import { X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type Country = { code: string; name: string; nameEn: string }

// Common countries (נפוצות)
const COMMON_COUNTRIES: Country[] = [
  { code: "IL", name: "ישראלית", nameEn: "Israel" },
  { code: "US", name: "ארצות הברית", nameEn: "USA" },
  { code: "GB", name: "בריטניה", nameEn: "UK" },
  { code: "FR", name: "צרפת", nameEn: "France" },
  { code: "RU", name: "רוסיה", nameEn: "Russia" },
  { code: "UA", name: "אוקראינה", nameEn: "Ukraine" },
  { code: "CA", name: "קנדה", nameEn: "Canada" },
  { code: "AU", name: "אוסטרליה", nameEn: "Australia" },
  { code: "DE", name: "גרמניה", nameEn: "Germany" },
]

// Extended country list
const EXTRA_COUNTRIES: Country[] = [
  { code: "AF", name: "אפגניסטן", nameEn: "Afghanistan" },
  { code: "AL", name: "אלבניה", nameEn: "Albania" },
  { code: "DZ", name: "אלג'יריה", nameEn: "Algeria" },
  { code: "AR", name: "ארגנטינה", nameEn: "Argentina" },
  { code: "AT", name: "אוסטריה", nameEn: "Austria" },
  { code: "BE", name: "בלגיה", nameEn: "Belgium" },
  { code: "BR", name: "ברזיל", nameEn: "Brazil" },
  { code: "BG", name: "בולגריה", nameEn: "Bulgaria" },
  { code: "CN", name: "סין", nameEn: "China" },
  { code: "CO", name: "קולומביה", nameEn: "Colombia" },
  { code: "HR", name: "קרואטיה", nameEn: "Croatia" },
  { code: "CZ", name: "צ'כיה", nameEn: "Czech Republic" },
  { code: "DK", name: "דנמרק", nameEn: "Denmark" },
  { code: "EG", name: "מצרים", nameEn: "Egypt" },
  { code: "FI", name: "פינלנד", nameEn: "Finland" },
  { code: "GR", name: "יוון", nameEn: "Greece" },
  { code: "HU", name: "הונגריה", nameEn: "Hungary" },
  { code: "IN", name: "הודו", nameEn: "India" },
  { code: "ID", name: "אינדונזיה", nameEn: "Indonesia" },
  { code: "IE", name: "אירלנד", nameEn: "Ireland" },
  { code: "IT", name: "איטליה", nameEn: "Italy" },
  { code: "JP", name: "יפן", nameEn: "Japan" },
  { code: "JO", name: "ירדן", nameEn: "Jordan" },
  { code: "KE", name: "קניה", nameEn: "Kenya" },
  { code: "KW", name: "כווית", nameEn: "Kuwait" },
  { code: "LB", name: "לבנון", nameEn: "Lebanon" },
  { code: "MY", name: "מלזיה", nameEn: "Malaysia" },
  { code: "MX", name: "מקסיקו", nameEn: "Mexico" },
  { code: "MA", name: "מרוקו", nameEn: "Morocco" },
  { code: "NL", name: "הולנד", nameEn: "Netherlands" },
  { code: "NZ", name: "ניו זילנד", nameEn: "New Zealand" },
  { code: "NO", name: "נורווגיה", nameEn: "Norway" },
  { code: "PK", name: "פקיסטן", nameEn: "Pakistan" },
  { code: "PH", name: "הפיליפינים", nameEn: "Philippines" },
  { code: "PL", name: "פולין", nameEn: "Poland" },
  { code: "PT", name: "פורטוגל", nameEn: "Portugal" },
  { code: "QA", name: "קטר", nameEn: "Qatar" },
  { code: "RO", name: "רומניה", nameEn: "Romania" },
  { code: "SA", name: "ערב הסעודית", nameEn: "Saudi Arabia" },
  { code: "SG", name: "סינגפור", nameEn: "Singapore" },
  { code: "ZA", name: "דרום אפריקה", nameEn: "South Africa" },
  { code: "KR", name: "דרום קוריאה", nameEn: "South Korea" },
  { code: "ES", name: "ספרד", nameEn: "Spain" },
  { code: "SE", name: "שוודיה", nameEn: "Sweden" },
  { code: "CH", name: "שוויץ", nameEn: "Switzerland" },
  { code: "TH", name: "תאילנד", nameEn: "Thailand" },
  { code: "TR", name: "טורקיה", nameEn: "Turkey" },
  { code: "AE", name: "איחוד האמירויות", nameEn: "UAE" },
  { code: "VN", name: "וייטנאם", nameEn: "Vietnam" },
]
const CLICK_DEDUPE_MS = 180

// De-dupe by code
const ALL_COUNTRIES: Country[] = (() => {
  const m = new Map<string, Country>()
  for (const c of [...COMMON_COUNTRIES, ...EXTRA_COUNTRIES]) m.set(c.code, c)
  return Array.from(m.values())
})()

type Citizenship =
  | { type: "standard"; label: string; code: string }
  | { type: "custom"; label: string }

interface CitizenshipSelectProps {
  value: Citizenship[]
  onChange: (value: Citizenship[]) => void
  error?: string
  disabled?: boolean
}

const normalize = (s: string) => s.trim().toLowerCase()

const getFlagEmoji = (code?: string) => {
  if (!code) return null
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

const keyOf = (c: Citizenship) =>
  c.type === "standard" ? `std:${c.code}` : `custom:${normalize(c.label)}`

export function CitizenshipSelect({
  value,
  onChange,
  error,
  disabled,
}: CitizenshipSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const selectedKeys = React.useMemo(() => new Set(value.map(keyOf)), [value])

  const lastActionRef = React.useRef<{ key: string; t: number } | null>(null)
  const runOnce = React.useCallback((key: string, fn: () => void) => {
    const now = Date.now()
    const last = lastActionRef.current
    if (last && last.key === key && now - last.t < CLICK_DEDUPE_MS) return
    lastActionRef.current = { key, t: now }
    fn()
  }, [])

  const toggle = React.useCallback(
    (c: Citizenship) => {
      const k = keyOf(c)
      const next = selectedKeys.has(k)
        ? value.filter((v) => keyOf(v) !== k)
        : [...value, c]

      onChange(next)
      setSearchQuery("")
    },
    [onChange, selectedKeys, value]
  )

  const remove = React.useCallback(
    (c: Citizenship) => {
      const k = keyOf(c)
      onChange(value.filter((v) => keyOf(v) !== k))
    },
    [onChange, value]
  )

  const query = normalize(searchQuery)

  const matches = React.useCallback(
    (country: Country) => {
      if (!query) return true
      return (
        normalize(country.code).includes(query) ||
        normalize(country.name).includes(query) ||
        normalize(country.nameEn).includes(query)
      )
    },
    [query]
  )

  const matchingCommon = React.useMemo(
    () => COMMON_COUNTRIES.filter(matches),
    [matches]
  )

  const matchingOther = React.useMemo(() => {
    const commonCodes = new Set(COMMON_COUNTRIES.map((c) => c.code))
    return ALL_COUNTRIES.filter((c) => !commonCodes.has(c.code)).filter(matches)
  }, [matches])

  const exactMatchExists = React.useMemo(() => {
    if (!query) return true
    return ALL_COUNTRIES.some(
      (c) =>
        normalize(c.code) === query ||
        normalize(c.name) === query ||
        normalize(c.nameEn) === query
    )
  }, [query])

  const canAddCustom = !!query && !exactMatchExists

  const addCustom = React.useCallback(() => {
    const label = searchQuery.trim()
    if (!label) return

    const c: Citizenship = { type: "custom", label }
    const k = keyOf(c)
    if (selectedKeys.has(k)) return

    onChange([...value, c])
    setSearchQuery("")
    setOpen(false)
  }, [onChange, searchQuery, selectedKeys, value])

  return (
    <div className="space-y-2" dir="rtl">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-start h-auto min-h-11 sm:min-h-12 text-right hover:bg-[#FFD4A3]/10 hover:text-foreground hover:border-[#FFD4A3]/30",
              error && "border-destructive",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <div className="flex flex-wrap gap-2 w-full">
              {value.length === 0 ? (
                <span className="text-muted-foreground text-sm sm:text-base">
                  בחר אזרחות...
                </span>
              ) : (
                value.map((c) => {
                  const flag = c.type === "standard" ? getFlagEmoji(c.code) : null
                  return (
                    <Badge
                      key={keyOf(c)}
                      variant="secondary"
                      className="gap-1 pr-1 pl-2 text-xs sm:text-sm"
                    >
                      {flag && <span className="text-base">{flag}</span>}
                      <span>{c.label}</span>

                      {!disabled && (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            remove(c)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault()
                              e.stopPropagation()
                              remove(c)
                            }
                          }}
                          className="ml-1 rounded-full hover:bg-secondary-foreground/20 p-0.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                        >
                          <X className="h-3 w-3" />
                        </span>
                      )}
                    </Badge>
                  )
                })
              )}
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
          dir="rtl"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="חפש אזרחות..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-9 text-right"
            />

            <CommandList>
              <CommandEmpty>
                {canAddCustom ? (
                  <CommandItem
                    value={`custom:${query}`}
                    onSelect={() =>
                      runOnce(`custom:${query}`, () => addCustom())
                    }
                  >
                    <Plus className="ml-2 h-4 w-4" />
                    הוסף/י "{searchQuery.trim()}"
                  </CommandItem>
                ) : (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    לא נמצאו תוצאות
                  </div>
                )}
              </CommandEmpty>

              {matchingCommon.length > 0 && (
                <CommandGroup heading="נפוצות">
                  {matchingCommon.map((country) => {
                    const c: Citizenship = {
                      type: "standard",
                      label: country.name,
                      code: country.code,
                    }
                    const selected = selectedKeys.has(keyOf(c))
                    const flag = getFlagEmoji(country.code)
                    const actionKey = keyOf(c)

                    return (
                      <CommandItem
                        key={country.code}
                        value={country.code}
                        onSelect={() => runOnce(actionKey, () => toggle(c))}
                      >
                        <div className="flex items-center gap-2 w-full">
                          {flag && <span className="text-base">{flag}</span>}
                          <span className="flex-1">{country.name}</span>
                          {selected && (
                            <span className="text-orange-600 dark:text-orange-400 font-bold">
                              ✓
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )}

              {matchingOther.length > 0 && (
                <CommandGroup heading={query ? "כל המדינות" : "מדינות נוספות"}>
                  {matchingOther.map((country) => {
                    const c: Citizenship = {
                      type: "standard",
                      label: country.name,
                      code: country.code,
                    }
                    const selected = selectedKeys.has(keyOf(c))
                    const flag = getFlagEmoji(country.code)
                    const actionKey = keyOf(c)

                    return (
                      <CommandItem
                        key={country.code}
                        value={country.code}
                        onSelect={() => runOnce(actionKey, () => toggle(c))}
                      >
                        <div className="flex items-center gap-2 w-full">
                          {flag && <span className="text-base">{flag}</span>}
                          <span className="flex-1">{country.name}</span>
                          {selected && (
                            <span className="text-orange-600 dark:text-orange-400 font-bold">
                              ✓
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )}

              {canAddCustom && (
                <CommandGroup>
                  <CommandItem
                    value={`custom:${query}`}
                    onSelect={() =>
                      runOnce(`custom:${query}`, () => addCustom())
                    }
                    className="text-primary font-medium"
                  >
                    <Plus className="ml-2 h-4 w-4" />
                    הוסף/י "{searchQuery.trim()}"
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {error && <p className="text-sm text-destructive text-right">{error}</p>}
    </div>
  )
}
