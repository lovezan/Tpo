"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type AIModel = {
  id: string
  name: string
  provider: string
  description: string
  category: "general" | "coding" | "academic" | "creative"
}

export const AI_MODELS: AIModel[] = [
  {
    id: "google/gemini-pro-1.5:beta",
    name: "Gemini Pro 2.0",
    provider: "Google",
    description: "Advanced model with strong reasoning capabilities",
    category: "general",
  },
  {
    id: "anthropic/claude-3-haiku:beta",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    description: "Fast, compact model with excellent instruction following",
    category: "general",
  },
  {
    id: "meta-llama/llama-3.1-70b-instruct:beta",
    name: "Llama 3.1 70B",
    provider: "Meta",
    description: "Meta's largest instruction-tuned model",
    category: "general",
  },
  {
    id: "mistralai/mistral-small-3.1-24b:beta",
    name: "Mistral Small 3.1 24B",
    provider: "Mistral AI",
    description: "Powerful 24B parameter model with strong reasoning",
    category: "general",
  },
  {
    id: "google/gemma-3-27b-instruct:beta",
    name: "Gemma 3 27B",
    provider: "Google",
    description: "Google's 27B parameter instruction-tuned model",
    category: "general",
  },
  {
    id: "google/gemma-3-4b-instruct:beta",
    name: "Gemma 3 4B",
    provider: "Google",
    description: "Lightweight 4B parameter model from Google",
    category: "general",
  },
  {
    id: "cognitivecomputations/dolphin-3.0-r1-mistral-24b:free",
    name: "Dolphin 3.0 Mistral 24B",
    provider: "Cognitive Computations",
    description: "Uncensored model based on Mistral 24B",
    category: "general",
  },
  {
    id: "deepseek/deepseek-zero:free",
    name: "DeepSeek Zero",
    provider: "DeepSeek",
    description: "Powerful model with strong reasoning capabilities",
    category: "general",
  },
  {
    id: "deepseek/deepseek-r1:free",
    name: "DeepSeek R1",
    provider: "DeepSeek",
    description: "Research-focused model with strong analytical abilities",
    category: "academic",
  },
  {
    id: "deepseek/deepseek-v3-base:free",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    description: "Latest DeepSeek model with improved capabilities",
    category: "general",
  },
  {
    id: "qwen/qwen-72b:free",
    name: "Qwen 72B",
    provider: "Alibaba",
    description: "Large model with strong multilingual capabilities",
    category: "general",
  },
  {
    id: "openchat/openchat-olympiccoder-32b:free",
    name: "OlympicCoder 32B",
    provider: "OpenChat",
    description: "Specialized for coding tasks with 32B parameters",
    category: "coding",
  },
  {
    id: "openchat/openchat-olympiccoder-7b:free",
    name: "OlympicCoder 7B",
    provider: "OpenChat",
    description: "Lightweight coding specialist with 7B parameters",
    category: "coding",
  },
]

interface ModelSelectorProps {
  selectedModel: AIModel
  onSelectModel: (model: AIModel) => void
}

export function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          <div className="flex items-center gap-1 truncate max-w-[calc(100%-20px)]">
            <span className="truncate font-medium">{selectedModel.name}</span>
            <span className="text-xs text-muted-foreground truncate hidden sm:inline">{selectedModel.provider}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] max-w-[90vw] p-0">
        <Command>
          <CommandInput placeholder="Search models..." />
          <CommandList className="max-h-[300px] overflow-auto">
            <CommandEmpty>No model found.</CommandEmpty>
            <CommandGroup heading="General Purpose">
              {AI_MODELS.filter((m) => m.category === "general").map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={() => {
                    onSelectModel(model)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", selectedModel.id === model.id ? "opacity-100" : "opacity-0")} />
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate">{model.name}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {model.provider} - {model.description}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Coding Specialists">
              {AI_MODELS.filter((m) => m.category === "coding").map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={() => {
                    onSelectModel(model)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", selectedModel.id === model.id ? "opacity-100" : "opacity-0")} />
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate">{model.name}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {model.provider} - {model.description}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Academic Research">
              {AI_MODELS.filter((m) => m.category === "academic").map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={() => {
                    onSelectModel(model)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", selectedModel.id === model.id ? "opacity-100" : "opacity-0")} />
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate">{model.name}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {model.provider} - {model.description}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

