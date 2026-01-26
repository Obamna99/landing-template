"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { chatbotConfig, faqConfig, siteConfig } from "@/lib/config"
import { getDefaultWhatsAppUrl } from "@/lib/utils/whatsapp"

interface Message {
  id: string
  type: "bot" | "user"
  content: string
  isQuestion?: boolean
  questionIndex?: number // Track which FAQ question this answered
  showFeedback?: boolean
  feedbackGiven?: "helpful" | "not-helpful" | null
}

// Get time-based greeting
function getTimeBasedGreeting(): string {
  const hour = new Date().getHours()
  const greetings = chatbotConfig.greetings
  
  if (hour >= 5 && hour < 12) return greetings?.morning || "בוקר טוב! איך אפשר לעזור?"
  if (hour >= 12 && hour < 17) return greetings?.afternoon || "צהריים טובים! איך אפשר לעזור?"
  if (hour >= 17 && hour < 21) return greetings?.evening || "ערב טוב! איך אפשר לעזור?"
  return greetings?.night || "לילה טוב! איך אפשר לעזור?"
}

// Check for default responses (greetings, common phrases)
function findDefaultResponse(query: string): string | null {
  const normalizedQuery = query.toLowerCase().trim()
  
  if (!chatbotConfig.defaultResponses) return null
  
  for (const item of chatbotConfig.defaultResponses) {
    for (const trigger of item.triggers) {
      if (normalizedQuery.includes(trigger.toLowerCase()) || 
          trigger.toLowerCase().includes(normalizedQuery) ||
          normalizedQuery === trigger.toLowerCase()) {
        return item.response
      }
    }
  }
  
  return null
}

// Find best FAQ match with index
type FAQMatch = { question: typeof faqConfig.questions[0]; score: number; index: number }

function findBestMatch(query: string, questions: typeof faqConfig.questions): FAQMatch | null {
  const normalizedQuery = query.toLowerCase().trim()
  
  if (normalizedQuery.length < 2) return null
  
  let bestMatch: FAQMatch | null = null
  
  for (let index = 0; index < questions.length; index++) {
    const q = questions[index]
    const normalizedQuestion = q.question.toLowerCase()
    
    if (normalizedQuestion.includes(normalizedQuery)) {
      const score = normalizedQuery.length / normalizedQuestion.length
      const adjustedScore = Math.min(score + 0.3, 1)
      if (!bestMatch || adjustedScore > bestMatch.score) {
        bestMatch = { question: q, score: adjustedScore, index }
      }
    }
    
    const queryWords = normalizedQuery.split(/\s+/)
    const questionWords = normalizedQuestion.split(/\s+/)
    
    let matchedWords = 0
    for (const qw of queryWords) {
      if (qw.length >= 2 && questionWords.some(w => w.includes(qw) || qw.includes(w))) {
        matchedWords++
      }
    }
    
    if (matchedWords > 0) {
      const score = matchedWords / queryWords.length * 0.7
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { question: q, score, index }
      }
    }
  }
  
  return bestMatch && bestMatch.score >= 0.3 ? bestMatch : null
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [showProactivePopup, setShowProactivePopup] = useState(false)
  const [lastAnsweredIndex, setLastAnsweredIndex] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const proactiveTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Check localStorage for previous state
  useEffect(() => {
    const wasOpen = localStorage.getItem("chatbot-open") === "true"
    const hadInteraction = localStorage.getItem("chatbot-interacted") === "true"
    const dismissedProactive = localStorage.getItem("chatbot-proactive-dismissed") === "true"
    
    if (wasOpen) setIsOpen(true)
    if (hadInteraction) setHasInteracted(true)
    
    // Proactive popup logic
    if (!hadInteraction && !dismissedProactive && chatbotConfig.proactivePopup?.enabled) {
      proactiveTimerRef.current = setTimeout(() => {
        setShowProactivePopup(true)
      }, chatbotConfig.proactivePopup.delay || 15000)
    }
    
    return () => {
      if (proactiveTimerRef.current) clearTimeout(proactiveTimerRef.current)
    }
  }, [])

  // Scroll-based proactive trigger
  useEffect(() => {
    if (hasInteracted || !chatbotConfig.proactivePopup?.enabled) return
    
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      if (scrollPercent >= (chatbotConfig.proactivePopup?.scrollTrigger || 50)) {
        setShowProactivePopup(true)
      }
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [hasInteracted])

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem("chatbot-open", String(isOpen))
  }, [isOpen])

  useEffect(() => {
    if (hasInteracted) {
      localStorage.setItem("chatbot-interacted", "true")
      setShowProactivePopup(false)
    }
  }, [hasInteracted])

  // Add welcome message when opening for first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          type: "bot",
          content: getTimeBasedGreeting(),
        },
      ])
    }
  }, [isOpen, messages.length])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const handleProactiveClick = () => {
    setShowProactivePopup(false)
    localStorage.setItem("chatbot-proactive-dismissed", "true")
    setIsOpen(true)
  }

  const dismissProactive = () => {
    setShowProactivePopup(false)
    localStorage.setItem("chatbot-proactive-dismissed", "true")
  }

  const addBotMessage = useCallback((content: string, questionIndex?: number) => {
    const newMessage: Message = {
      id: `bot-${Date.now()}`,
      type: "bot",
      content,
      questionIndex,
      showFeedback: chatbotConfig.feedback?.enabled && questionIndex !== undefined,
      feedbackGiven: null,
    }
    setMessages((prev) => [...prev, newMessage])
    if (questionIndex !== undefined) {
      setLastAnsweredIndex(questionIndex)
    }
  }, [])

  const handleQuickQuestion = (questionIndex: number) => {
    const faq = faqConfig.questions[questionIndex]
    if (!faq) return

    setHasInteracted(true)
    
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, type: "user", content: faq.question, isQuestion: true },
    ])

    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      addBotMessage(faq.answer, questionIndex)
    }, 500 + Math.random() * 500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    setHasInteracted(true)
    const query = inputValue.trim()
    setInputValue("")

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, type: "user", content: query, isQuestion: true },
    ])

    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      
      const defaultResponse = findDefaultResponse(query)
      if (defaultResponse) {
        addBotMessage(defaultResponse)
        return
      }
      
      const match = findBestMatch(query, faqConfig.questions)
      if (match) {
        addBotMessage(match.question.answer, match.index)
      } else {
        addBotMessage(chatbotConfig.fallbackMessage)
      }
    }, 600 + Math.random() * 400)
  }

  const handleFeedback = (messageId: string, feedback: "helpful" | "not-helpful") => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, feedbackGiven: feedback } : msg
      )
    )
  }

  const handleFallbackCTA = () => {
    if (chatbotConfig.fallbackCTA.type === "whatsapp") {
      window.open(getDefaultWhatsAppUrl(), "_blank")
    } else if (chatbotConfig.fallbackCTA.type === "contact") {
      setIsOpen(false)
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
    } else if (chatbotConfig.fallbackCTA.type === "phone") {
      window.location.href = `tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, "")}`
    }
  }

  // Get follow-up suggestions
  const getFollowUpSuggestions = (): number[] => {
    if (lastAnsweredIndex === null || !chatbotConfig.followUpQuestions) return []
    return chatbotConfig.followUpQuestions[lastAnsweredIndex] || []
  }

  if (!chatbotConfig.enabled) return null

  const positionClasses = chatbotConfig.position === "left" 
    ? "left-4 sm:left-6" 
    : "right-4 sm:right-6"

  const followUpSuggestions = getFollowUpSuggestions()

  return (
    <>
      {/* Proactive Popup */}
      <AnimatePresence>
        {showProactivePopup && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className={`fixed bottom-36 sm:bottom-24 ${positionClasses} z-40`}
          >
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 max-w-[250px] relative">
              <button
                onClick={dismissProactive}
                className="absolute -top-2 -right-2 w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 text-xs"
              >
                ✕
              </button>
              <p className="text-sm text-slate-700 mb-3">{chatbotConfig.proactivePopup?.message}</p>
              <button
                onClick={handleProactiveClick}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-teal-500 hover:to-teal-400 transition-all"
              >
                כן, יש לי שאלה
              </button>
            </div>
            {/* Arrow pointing to bubble */}
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-r border-b border-slate-200 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Bubble */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 sm:bottom-6 ${positionClasses} z-40 w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-200 flex items-center justify-center ${
          isOpen ? "scale-0 opacity-0 pointer-events-none" : ""
        }`}
        aria-label="פתח צ'אט"
      >
        {chatbotConfig.botAvatar ? (
          <img 
            src={chatbotConfig.botAvatar} 
            alt="Chat" 
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        
        {/* Notification dot */}
        {!hasInteracted && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white animate-pulse" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 sm:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`fixed ${positionClasses} bottom-0 sm:bottom-6 z-50 w-full sm:w-96 sm:max-w-[calc(100vw-3rem)]`}
            >
              <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[85vh] sm:h-[520px]">
                {/* Header with Avatar */}
                <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center overflow-hidden ring-2 ring-white/30">
                      {chatbotConfig.botAvatar ? (
                        <img 
                          src={chatbotConfig.botAvatar} 
                          alt={chatbotConfig.botName || "Bot"} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold">{chatbotConfig.title}</h3>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <p className="text-xs text-teal-100">{chatbotConfig.subtitle}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="סגור צ'אט"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === "user" ? "justify-start" : "justify-end"}`}
                    >
                      <div className="flex flex-col gap-1 max-w-[85%]">
                        {/* Bot avatar next to message */}
                        {message.type === "bot" && (
                          <div className="flex items-end gap-2 justify-end">
                            <div
                              className="rounded-2xl px-4 py-3 bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-md"
                            >
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                            </div>
                            {chatbotConfig.botAvatar && (
                              <img 
                                src={chatbotConfig.botAvatar} 
                                alt="" 
                                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                              />
                            )}
                          </div>
                        )}
                        
                        {/* User message */}
                        {message.type === "user" && (
                          <div className="rounded-2xl px-4 py-3 bg-teal-600 text-white rounded-br-md">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          </div>
                        )}

                        {/* Feedback buttons */}
                        {message.showFeedback && message.type === "bot" && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center gap-2 justify-end mt-1"
                          >
                            {message.feedbackGiven ? (
                              <span className="text-xs text-slate-400">
                                {chatbotConfig.feedback?.thankYouText || "תודה על המשוב!"}
                              </span>
                            ) : (
                              <>
                                <span className="text-xs text-slate-400">
                                  {chatbotConfig.feedback?.helpfulText || "התשובה עזרה?"}
                                </span>
                                <button
                                  onClick={() => handleFeedback(message.id, "helpful")}
                                  className="p-1 hover:bg-green-50 rounded text-slate-400 hover:text-green-600 transition-colors"
                                  title="כן, עזר"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleFeedback(message.id, "not-helpful")}
                                  className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 transition-colors"
                                  title="לא עזר"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                  </svg>
                                </button>
                              </>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-end items-end gap-2"
                    >
                      <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-slate-100">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                      {chatbotConfig.botAvatar && (
                        <img src={chatbotConfig.botAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                      )}
                    </motion.div>
                  )}

                  {/* Fallback CTA */}
                  {messages.length > 0 && messages[messages.length - 1]?.content === chatbotConfig.fallbackMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-end"
                    >
                      <button
                        onClick={handleFallbackCTA}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        {chatbotConfig.fallbackCTA.text}
                      </button>
                    </motion.div>
                  )}

                  {/* Follow-up suggestions */}
                  {followUpSuggestions.length > 0 && messages.length > 1 && !isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-wrap gap-2 justify-end"
                    >
                      {followUpSuggestions.map((index) => {
                        const faq = faqConfig.questions[index]
                        if (!faq) return null
                        return (
                          <button
                            key={index}
                            onClick={() => handleQuickQuestion(index)}
                            className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-full text-xs font-medium transition-colors border border-teal-200"
                          >
                            {faq.question.length > 25 ? faq.question.slice(0, 25) + "..." : faq.question}
                          </button>
                        )
                      })}
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Questions - only show initially */}
                {messages.length <= 1 && (
                  <div className="p-3 bg-white border-t border-slate-100">
                    <p className="text-xs text-slate-500 mb-2 text-center">שאלות נפוצות:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {chatbotConfig.quickQuestions.map((q, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickQuestion(q.questionIndex)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 rounded-full text-xs font-medium transition-colors"
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={chatbotConfig.placeholder}
                      className="flex-1 px-4 py-2.5 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                      dir="rtl"
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim()}
                      className="px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:from-teal-500 hover:to-teal-400 transition-all"
                    >
                      <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
