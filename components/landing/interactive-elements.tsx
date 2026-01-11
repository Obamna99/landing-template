"use client"

import { motion, useInView } from "framer-motion"
import { useState, useRef } from "react"

// Toggle Switch Component
function ToggleSwitch({ 
  label, 
  description, 
  checked, 
  onChange 
}: { 
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void 
}) {
  return (
    <div className="flex items-start gap-3 sm:gap-4 p-4 bg-white rounded-xl border border-neutral-200/50 shadow-sm">
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
          checked ? "bg-orange-500" : "bg-neutral-300"
        }`}
      >
        <motion.span
          className="inline-block h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-white shadow-md"
          animate={{ x: checked ? 24 : 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
      <div className="flex-1 min-w-0">
        <span className="block text-base sm:text-lg font-medium text-neutral-900">{label}</span>
        {description && (
          <span className="block text-sm text-neutral-500 mt-0.5">{description}</span>
        )}
      </div>
    </div>
  )
}

// Range Slider Component
function RangeSlider({
  label,
  min,
  max,
  value,
  onChange,
  unit = "",
  showValue = true,
}: {
  label: string
  min: number
  max: number
  value: number
  onChange: (value: number) => void
  unit?: string
  showValue?: boolean
}) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="p-4 sm:p-5 bg-white rounded-xl border border-neutral-200/50 shadow-sm">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <span className="text-base sm:text-lg font-medium text-neutral-900">{label}</span>
        {showValue && (
          <span className="text-lg sm:text-xl font-bold text-orange-500">
            {value.toLocaleString()}{unit}
          </span>
        )}
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-3 appearance-none bg-transparent cursor-pointer focus:outline-none [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:h-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:mt-[-6px] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-orange-500 [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer"
          style={{
            background: `linear-gradient(to right, #f97316 0%, #f97316 ${percentage}%, #e5e5e5 ${percentage}%, #e5e5e5 100%)`,
          }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs sm:text-sm text-neutral-400">
        <span>{min.toLocaleString()}{unit}</span>
        <span>{max.toLocaleString()}{unit}</span>
      </div>
    </div>
  )
}

// Quiz Question Component
function QuizQuestion({
  question,
  options,
  selectedOption,
  onSelect,
  questionNumber,
}: {
  question: string
  options: string[]
  selectedOption: number | null
  onSelect: (index: number) => void
  questionNumber: number
}) {
  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl border border-neutral-200/50 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm sm:text-base">
          {questionNumber}
        </span>
        <h4 className="text-base sm:text-lg font-semibold text-neutral-900 pt-1">{question}</h4>
      </div>
      <div className="space-y-2 sm:space-y-3 mr-0 sm:mr-11">
        {options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => onSelect(index)}
            className={`w-full text-right p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-200 ${
              selectedOption === index
                ? "border-orange-500 bg-orange-50 text-orange-700"
                : "border-neutral-200 hover:border-orange-300 hover:bg-orange-50/50 text-neutral-700"
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-sm sm:text-base">{option}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// Main Interactive Elements Section
export function InteractiveElements() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  // Toggle states
  const [notifications, setNotifications] = useState(true)
  const [newsletter, setNewsletter] = useState(false)
  const [updates, setUpdates] = useState(true)
  
  // Slider states
  const [budget, setBudget] = useState(5000)
  const [urgency, setUrgency] = useState(2)
  
  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([null, null, null])
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  const quizQuestions = [
    {
      question: "מה גודל העסק שלכם?",
      options: ["עסק קטן (1-5 עובדים)", "עסק בינוני (6-20 עובדים)", "עסק גדול (21-100 עובדים)", "חברה גדולה (100+)"],
    },
    {
      question: "מה התחום העיקרי של העסק?",
      options: ["שירותים", "מסחר קמעונאי", "טכנולוגיה", "תעשייה ויצור"],
    },
    {
      question: "מה הצורך המיידי שלכם?",
      options: ["ייעוץ עסקי", "שיווק ופרסום", "פיתוח מוצר", "שיפור תהליכים"],
    },
  ]

  const handleQuizAnswer = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...quizAnswers]
    newAnswers[questionIndex] = optionIndex
    setQuizAnswers(newAnswers)
  }

  const handleQuizSubmit = () => {
    if (quizAnswers.every((a) => a !== null)) {
      setQuizSubmitted(true)
    }
  }

  const isQuizComplete = quizAnswers.every((a) => a !== null)

  return (
    <section
      id="interactive"
      ref={ref}
      className="py-16 sm:py-24 bg-gradient-to-b from-white to-neutral-50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 text-center mb-4">
            התאימו לעצמכם
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 text-center mb-10 sm:mb-16 max-w-2xl mx-auto px-4">
            ספרו לנו קצת על העסק שלכם כדי שנוכל להתאים את השירות המושלם עבורכם
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Preferences Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 sm:space-y-6"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-4 sm:mb-6">
                העדפות תקשורת
              </h3>
              
              <ToggleSwitch
                label="עדכונים בוואטסאפ"
                description="קבלו עדכונים ישירות לטלפון"
                checked={notifications}
                onChange={setNotifications}
              />
              
              <ToggleSwitch
                label="ניוזלטר חודשי"
                description="טיפים ותוכן מקצועי לעסקים"
                checked={newsletter}
                onChange={setNewsletter}
              />
              
              <ToggleSwitch
                label="הצעות מיוחדות"
                description="קבלו מבצעים והנחות בלעדיות"
                checked={updates}
                onChange={setUpdates}
              />

              <div className="pt-4 sm:pt-6 space-y-4 sm:space-y-6">
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900">
                  פרטי הפרויקט
                </h3>
                
                <RangeSlider
                  label="תקציב משוער"
                  min={1000}
                  max={50000}
                  value={budget}
                  onChange={setBudget}
                  unit="₪"
                />
                
                <RangeSlider
                  label="דחיפות (חודשים)"
                  min={1}
                  max={12}
                  value={urgency}
                  onChange={setUrgency}
                  unit=""
                />
              </div>
            </motion.div>

            {/* Quiz Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4 sm:space-y-6"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-4 sm:mb-6">
                שאלון התאמה מהיר
              </h3>

              {!quizSubmitted ? (
                <>
                  {quizQuestions.map((q, index) => (
                    <QuizQuestion
                      key={index}
                      question={q.question}
                      options={q.options}
                      selectedOption={quizAnswers[index]}
                      onSelect={(optionIndex) => handleQuizAnswer(index, optionIndex)}
                      questionNumber={index + 1}
                    />
                  ))}
                  
                  <motion.button
                    onClick={handleQuizSubmit}
                    disabled={!isQuizComplete}
                    className={`w-full py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                      isQuizComplete
                        ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl"
                        : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                    }`}
                    whileHover={isQuizComplete ? { scale: 1.02 } : {}}
                    whileTap={isQuizComplete ? { scale: 0.98 } : {}}
                  >
                    שלחו תשובות
                  </motion.button>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="p-6 sm:p-8 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200 text-center"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2 sm:mb-3">
                    תודה על התשובות!
                  </h4>
                  <p className="text-sm sm:text-base text-neutral-600 mb-4 sm:mb-6">
                    על סמך המידע שמסרתם, נוכל להציע לכם את הפתרון המתאים ביותר לעסק שלכם.
                  </p>
                  <button
                    onClick={() => {
                      setQuizSubmitted(false)
                      setQuizAnswers([null, null, null])
                    }}
                    className="text-orange-600 hover:text-orange-700 font-medium underline text-sm sm:text-base"
                  >
                    מלאו שוב את השאלון
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
