"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { useChat } from "@/providers/chat-provider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  X,
  Send,
  Trash2,
  Minimize2,
  Maximize2,
  Loader2,
  GraduationCap,
  MessageSquare,
  Briefcase,
  Settings,
  ArrowUpIcon as ArrowsOut,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ModelSelector } from "./model-selector"
import { ChatMessage } from "./chat-message"
import { PlacementResources } from "./placement-resources"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const STUDY_SUGGESTIONS = [
  {
    category: "Academic",
    icon: <GraduationCap className="h-4 w-4" />,
    questions: [
      "Explain the concept of derivatives in calculus",
      "What are the key principles of object-oriented programming?",
      "How does machine learning work?",
      "What is the difference between RAM and ROM?",
    ],
  },
  {
    category: "Placement",
    icon: <Briefcase className="h-4 w-4" />,
    questions: [
      "How do I prepare for a technical interview?",
      "What should I include in my resume as a computer science student?",
      "What are common behavioral interview questions?",
      "How can I improve my problem-solving skills for coding interviews?",
    ],
  },
  {
    category: "Coding",
    icon: <MessageSquare className="h-4 w-4" />,
    questions: [
      "Write a Python function to check if a string is a palindrome",
      "Explain how to implement a binary search algorithm",
      "What's the difference between SQL and NoSQL databases?",
      "How do I create a responsive website using CSS Grid?",
    ],
  },
]

export function ChatInterface() {
  const {
    messages,
    addMessage,
    isLoading,
    closeChat,
    clearMessages,
    isMinimized,
    isFullScreen,
    toggleMinimized,
    toggleFullScreen,
    error,
    selectedModel,
    setSelectedModel,
    activeTab,
    setActiveTab,
  } = useChat()

  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // State for resizing
  const [isResizing, setIsResizing] = useState(false)
  const [chatSize, setChatSize] = useState({ width: 400, height: 500 })
  const resizeStartPosition = useRef({ x: 0, y: 0 })
  const initialSize = useRef({ width: 0, height: 0 })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!isMinimized) {
      inputRef.current?.focus()
    }
  }, [isMinimized])

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsResizing(true)

    // Get starting position
    if ("touches" in e) {
      resizeStartPosition.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }
    } else {
      resizeStartPosition.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }

    // Store initial size
    initialSize.current = { ...chatSize }

    // Add document event listeners
    document.addEventListener("mousemove", handleResizeMove)
    document.addEventListener("touchmove", handleResizeTouchMove)
    document.addEventListener("mouseup", handleResizeEnd)
    document.addEventListener("touchend", handleResizeEnd)
  }

  // Handle resize move (mouse)
  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return

    const deltaX = e.clientX - resizeStartPosition.current.x
    const deltaY = e.clientY - resizeStartPosition.current.y

    const newWidth = Math.max(300, initialSize.current.width + deltaX)
    const newHeight = Math.max(400, initialSize.current.height + deltaY)

    setChatSize({
      width: newWidth,
      height: newHeight,
    })
  }

  // Handle resize move (touch)
  const handleResizeTouchMove = (e: TouchEvent) => {
    if (!isResizing) return

    const deltaX = e.touches[0].clientX - resizeStartPosition.current.x
    const deltaY = e.touches[0].clientY - resizeStartPosition.current.y

    const newWidth = Math.max(300, initialSize.current.width + deltaX)
    const newHeight = Math.max(400, initialSize.current.height + deltaY)

    setChatSize({
      width: newWidth,
      height: newHeight,
    })
  }

  // Handle resize end
  const handleResizeEnd = () => {
    setIsResizing(false)

    // Remove document event listeners
    document.removeEventListener("mousemove", handleResizeMove)
    document.removeEventListener("touchmove", handleResizeTouchMove)
    document.removeEventListener("mouseup", handleResizeEnd)
    document.removeEventListener("touchend", handleResizeEnd)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      addMessage({ role: "user", content: input.trim() })
      setInput("")
    }
  }

  const handleSuggestionClick = (question: string) => {
    if (!isLoading) {
      addMessage({ role: "user", content: question })
      setActiveTab("chat")
    }
  }

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed bottom-20 right-4 z-50 bg-background rounded-lg shadow-lg border p-3 w-72 max-w-[90vw]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <GraduationCap size={16} className="text-primary-foreground" />
            </div>
            <h3 className="font-medium">College Assistant</h3>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={toggleMinimized} className="h-7 w-7">
              <Maximize2 size={14} />
              <span className="sr-only">Expand</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={closeChat} className="h-7 w-7">
              <X size={14} />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Loader2 size={12} className="animate-spin" />
            <span>AI is thinking...</span>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        ref={chatContainerRef}
        className={cn(
          "fixed z-50 bg-background/95 backdrop-blur-sm flex flex-col shadow-lg border",
          isFullScreen
            ? "inset-0 pt-16" // Add padding top to avoid header overlap
            : "bottom-20 right-4 rounded-lg overflow-hidden",
        )}
        style={
          !isFullScreen
            ? {
                width: chatSize.width,
                height: chatSize.height,
                resize: "both",
                overflow: "hidden",
              }
            : undefined
        }
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <GraduationCap size={16} className="text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold">College Assistant</h2>
              <p className="text-xs text-muted-foreground">Powered by AI</p>
            </div>
          </div>
          <div className="flex gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Settings size={14} />
                  <span className="sr-only">Settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px] max-w-[90vw]">
                <div className="p-2">
                  <h4 className="text-sm font-medium mb-2">Select AI Model</h4>
                  <ModelSelector selectedModel={selectedModel} onSelectModel={setSelectedModel} />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={clearMessages} className="h-7 w-7">
                    <Trash2 size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear chat</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleMinimized} className="h-7 w-7">
                    <Minimize2 size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Minimize</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleFullScreen} className="h-7 w-7">
                    {isFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFullScreen ? "Exit full screen" : "Full screen"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={closeChat} className="h-7 w-7">
                    <X size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Close chat</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "chat" | "resources")}
          className="flex-1 flex flex-col min-h-0"
        >
          <TabsList className="grid grid-cols-2 px-4 pt-2 flex-shrink-0">
            <TabsTrigger value="chat" className="flex items-center gap-1">
              <MessageSquare size={16} />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-1">
              <Briefcase size={16} />
              <span>Placement</span>
            </TabsTrigger>
          </TabsList>

          {/* Chat Tab Content */}
          <TabsContent value="chat" className="flex-1 flex flex-col min-h-0 data-[state=inactive]:hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 min-h-0">
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.length === 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center my-8 px-4"
                    >
                      <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <GraduationCap size={32} className="text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">College Assistant</h3>
                      <p className="text-muted-foreground max-w-md mb-6">
                        Ask me anything about your studies, career preparation, or placement assistance.
                      </p>

                      <Tabs defaultValue="academic" className="w-full">
                        <TabsList className="grid grid-cols-3">
                          {STUDY_SUGGESTIONS.map((category) => (
                            <TabsTrigger key={category.category} value={category.category.toLowerCase()}>
                              <span className="flex items-center gap-1.5">
                                {category.icon}
                                <span>{category.category}</span>
                              </span>
                            </TabsTrigger>
                          ))}
                        </TabsList>

                        {STUDY_SUGGESTIONS.map((category) => (
                          <TabsContent key={category.category} value={category.category.toLowerCase()} className="mt-2">
                            <div className="grid grid-cols-1 gap-2">
                              {category.questions.map((question, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  className="text-sm justify-start h-auto py-2 px-3 text-left"
                                  onClick={() => handleSuggestionClick(question)}
                                >
                                  {question}
                                </Button>
                              ))}
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </motion.div>
                  )}
                </AnimatePresence>

                {messages
                  .filter((m) => m.role !== "system")
                  .map((message, index) => (
                    <ChatMessage
                      key={index}
                      role={message.role}
                      content={message.content}
                      timestamp={message.timestamp}
                      model={message.model}
                    />
                  ))}

                {isLoading && (
                  <div className="flex w-full mb-4 justify-start">
                    <div className="flex gap-3 max-w-[80%]">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Loader2 size={16} className="text-primary animate-spin" />
                      </div>
                      <div className="rounded-lg p-3 text-sm bg-muted">
                        <div className="flex items-center gap-2">
                          <span>Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
                    <strong>Error:</strong> {error}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-3 border-t flex-shrink-0">
              <div className="relative">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about academics, career, or coding..."
                  className="pr-10 resize-none min-h-[60px] max-h-32"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 bottom-2 h-8 w-8"
                >
                  <Send size={16} />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-muted-foreground">Press Shift+Enter for a new line</p>
                <p className="text-xs text-muted-foreground">Using: {selectedModel.name}</p>
              </div>
            </form>
          </TabsContent>

          {/* Resources Tab Content */}
          <TabsContent value="resources" className="flex-1 overflow-y-auto p-4 data-[state=inactive]:hidden">
            <PlacementResources />
          </TabsContent>
        </Tabs>

        {/* Resize handle (only in non-fullscreen mode) */}
        {!isFullScreen && (
          <div
            className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize z-50 flex items-center justify-center"
            onMouseDown={handleResizeStart}
            onTouchStart={handleResizeStart}
          >
            <ArrowsOut size={12} className="opacity-50 hover:opacity-100 transition-opacity" />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

