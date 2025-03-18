"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface MultiSelectItem {
  value: string
  label: string
}

interface MultiSelectProps {
  items: MultiSelectItem[]
  selected: string[]
  onChange: (selectedValues: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  items,
  selected,
  onChange,
  placeholder = "Select items",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  
  const selectedItems = items.filter(item => selected.includes(item.value))
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("min-h-10 h-auto w-full justify-between", className)}
        >
          <div className="flex flex-wrap gap-1">
            {selectedItems.length > 0 ? (
              selectedItems.map(item => (
                <Badge
                  key={item.value}
                  variant="secondary"
                  className="mr-1 mb-1"
                >
                  {item.label}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onMouseDown={e => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={() => {
                      onChange(selected.filter(value => value !== item.value))
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--width,100%)] p-0">
        <Command className="w-full">
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {items.map(item => {
                const isSelected = selected.includes(item.value)
                return (
                  <CommandItem
                    key={item.value}
                    onSelect={() => {
                      onChange(
                        isSelected
                          ? selected.filter(value => value !== item.value)
                          : [...selected, item.value]
                      )
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    {item.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 