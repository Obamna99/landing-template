"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { reviewsConfig } from "@/lib/config"

interface Review {
  id: string
  name: string
  role: string | null
  company: string | null
  content: string
  rating: number
  imageUrl: string | null
  result: string | null
  resultLabel: string | null
  featured: boolean
}

// Featured case study from config
const featuredCaseStudy = reviewsConfig.caseStudy

// Default sample reviews to display when no database reviews exist
const sampleReviews: Review[] = [
  {
    id: "sample-1",
    name: "יעל כהן",
    role: "בעלים",
    company: "סטודיו לעיצוב פנים",
    content: "האתר החדש שינה לנו את העסק. תוך שבועיים קיבלנו יותר פניות מאשר בחודשיים הקודמים. מקצועיות ברמה הגבוהה ביותר.",
    rating: 5,
    imageUrl: null,
    result: "300%",
    resultLabel: "עלייה בפניות",
    featured: true,
  },
  {
    id: "sample-2",
    name: "אבי לוי",
    role: "מנכ״ל",
    company: "נדל״ן פלוס",
    content: "עבדתי עם הרבה חברות בניית אתרים, אבל הפעם הראשונה שקיבלתי בדיוק את מה שרציתי. מהירים, מקצועיים, ותוצאות מעולות.",
    rating: 5,
    imageUrl: null,
    result: "150%",
    resultLabel: "יותר לידים",
    featured: false,
  },
  {
    id: "sample-3",
    name: "מיכל ברק",
    role: "בעלים",
    company: "קליניקת יופי",
    content: "השירות היה מצוין מההתחלה ועד הסוף. האתר נראה מדהים והלקוחות שלי לא מפסיקים לשבח. ממליצה בחום!",
    rating: 5,
    imageUrl: null,
    result: "200%",
    resultLabel: "עלייה בהזמנות",
    featured: false,
  },
  {
    id: "sample-4",
    name: "דני שמעון",
    role: "בעלים",
    company: "מסעדת השף",
    content: "הם הבינו בדיוק מה אני צריך עוד לפני שהספקתי להסביר. האתר מושלם והחיסכון על המיילים משמעותי.",
    rating: 5,
    imageUrl: null,
    result: null,
    resultLabel: null,
    featured: false,
  },
  {
    id: "sample-5",
    name: "רונית גולן",
    role: "מנהלת שיווק",
    company: "חברת הייטק",
    content: "דף הנחיתה שקיבלנו עזר לנו להכפיל את ההמרות. התהליך היה חלק ומהיר, והתוצאה מדברת בעד עצמה.",
    rating: 5,
    imageUrl: null,
    result: "2X",
    resultLabel: "שיפור בהמרות",
    featured: false,
  },
]

// Review Card Component
function ReviewCard({ review }: { review: Review }) {
  return (
    <div 
      className="review-card flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[360px] bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-lg border border-slate-100 mx-2 sm:mx-3 hover:shadow-xl transition-shadow duration-300" 
      dir="rtl"
    >
      <div className="flex items-center gap-3 mb-3">
        {review.imageUrl ? (
          <img
            src={review.imageUrl}
            alt={review.name}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-teal-100"
            loading="lazy"
          />
        ) : (
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
            {review.name.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate">{review.name}</h4>
          <p className="text-xs sm:text-sm text-slate-500 truncate">
            {review.role}{review.company ? `, ${review.company}` : ""}
          </p>
        </div>
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="flex gap-0.5">
            {[...Array(review.rating)].map((_, i) => (
              <svg key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
      
      <p className="text-slate-600 leading-relaxed text-xs sm:text-sm line-clamp-4">
        &ldquo;{review.content}&rdquo;
      </p>
      
      {/* Result highlight */}
      {review.result && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-slate-700">
            <span className="text-teal-600 font-bold">{review.result}</span> {review.resultLabel}
          </span>
        </div>
      )}
    </div>
  )
}

// CSS-based Infinite Carousel with GPU acceleration
function InfiniteCarousel({ reviews }: { reviews: Review[] }) {
  const [isPaused, setIsPaused] = useState(false)
  
  // Double the reviews for seamless loop
  const doubledReviews = [...reviews, ...reviews]
  
  // Calculate animation duration based on number of reviews
  // Slower = smoother perceived animation
  const animationDuration = reviews.length * 5 // 5 seconds per review

  return (
    <div
      className="overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      
      <div
        className={`flex py-4 animate-scroll ${isPaused ? 'pause-animation' : ''}`}
        style={{
          animationDuration: `${animationDuration}s`,
        }}
      >
        {doubledReviews.map((review, index) => (
          <ReviewCard key={`${review.id}-${index}`} review={review} />
        ))}
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(50%);
          }
        }
        
        .animate-scroll {
          animation: scroll linear infinite;
          will-change: transform;
        }
        
        .pause-animation {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}

// Pagination dots for mobile manual navigation
function PaginationDots({ 
  total, 
  current, 
  onSelect 
}: { 
  total: number
  current: number
  onSelect: (index: number) => void 
}) {
  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          aria-label={`עבור לביקורת ${index + 1}`}
          className={`rounded-full transition-all duration-300 ${
            index === current
              ? 'w-6 h-2 bg-teal-500'
              : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
          }`}
        />
      ))}
    </div>
  )
}

// Mobile swipeable carousel
function MobileCarousel({ reviews }: { reviews: Review[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isSwipe = Math.abs(distance) > 50

    if (isSwipe) {
      if (distance > 0 && currentIndex > 0) {
        // Swiped left (previous in RTL)
        setCurrentIndex(prev => prev - 1)
      } else if (distance < 0 && currentIndex < reviews.length - 1) {
        // Swiped right (next in RTL)
        setCurrentIndex(prev => prev + 1)
      }
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-300 ease-out"
          style={{ 
            transform: `translateX(${currentIndex * 100}%)`,
          }}
        >
          {reviews.map((review) => (
            <div key={review.id} className="w-full flex-shrink-0 px-4">
              <div 
                className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100" 
                dir="rtl"
              >
                <div className="flex items-center gap-3 mb-4">
                  {review.imageUrl ? (
                    <img
                      src={review.imageUrl}
                      alt={review.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-teal-100"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-xl">
                      {review.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">{review.name}</h4>
                    <p className="text-sm text-slate-500">
                      {review.role}{review.company ? `, ${review.company}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                
                <p className="text-slate-600 leading-relaxed text-sm">
                  &ldquo;{review.content}&rdquo;
                </p>
                
                {review.result && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-slate-700">
                      <span className="text-teal-600 font-bold">{review.result}</span> {review.resultLabel}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <PaginationDots 
        total={reviews.length} 
        current={currentIndex} 
        onSelect={setCurrentIndex}
      />
    </div>
  )
}

export function Reviews() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Fetch reviews from API, fallback to sample reviews
  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch("/api/reviews")
        if (response.ok) {
          const data = await response.json()
          // Use sample reviews if no database reviews exist
          setReviews(data.length > 0 ? data : sampleReviews)
        } else {
          setReviews(sampleReviews)
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
        setReviews(sampleReviews)
      }
      setIsLoading(false)
    }
    
    fetchReviews()
  }, [])

  // Use display reviews (with fallback stats)
  const displayReviews = reviews.length > 0 ? reviews : sampleReviews
  
  // Fixed professional stats (not dependent on actual review count)
  const avgRating = "5.0"
  const clientCount = "150+"

  return (
    <section
      id="reviews"
      ref={ref}
      className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-white via-slate-50/50 to-white overflow-hidden"
    >
      {/* Section Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <span className="inline-block text-teal-600 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-3">
            {reviewsConfig.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
            {reviewsConfig.headline}
            <span className="gradient-text">{reviewsConfig.headlineHighlight}</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto">
            {reviewsConfig.subheadline}
          </p>
          
          {/* Trust Stats */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 lg:gap-10 mt-6 sm:mt-8">
            {[
              { value: clientCount, label: "לקוחות מרוצים" },
              { value: avgRating, label: "דירוג ממוצע" },
              { value: "98%", label: "ממליצים עלינו" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-[10px] sm:text-xs lg:text-sm text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Reviews Carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-10 sm:mb-14 lg:mb-16"
      >
        {isLoading ? (
          <div className="flex justify-center py-8 sm:py-12">
            <div className="animate-spin w-6 h-6 sm:w-8 sm:h-8 border-3 sm:border-4 border-teal-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            {/* Mobile: Swipeable with dots */}
            <div className="sm:hidden">
              <MobileCarousel reviews={displayReviews.slice(0, 6)} />
            </div>
            {/* Desktop: Infinite auto-scroll */}
            <div className="hidden sm:block">
              <InfiniteCarousel reviews={displayReviews} />
            </div>
          </>
        )}
      </motion.div>

      {/* Featured Case Study */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">
              {featuredCaseStudy.title}
            </h3>
          </div>
          
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl">
            {/* Background Image Overlay */}
            <div className="absolute inset-0 opacity-20">
              <img
                src={featuredCaseStudy.image}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Content */}
            <div className="relative p-5 sm:p-8 lg:p-12 text-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                {/* Left side - Story */}
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 sm:px-4 sm:py-1.5 mb-3 sm:mb-4">
                    <span className="text-[10px] sm:text-xs font-medium text-teal-300">תיק עבודות</span>
                    <span className="text-[10px] sm:text-xs text-white/60">|</span>
                    <span className="text-[10px] sm:text-xs text-white/80">{featuredCaseStudy.industry}</span>
                  </div>
                  
                  <h4 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
                    {featuredCaseStudy.company}
                  </h4>
                  
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-sm sm:text-base">
                        <span className="text-white/60">האתגר: </span>
                        <span className="text-white/90">{featuredCaseStudy.challenge}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-sm sm:text-base">
                        <span className="text-white/60">הפתרון: </span>
                        <span className="text-white/90">{featuredCaseStudy.solution}</span>
                      </div>
                    </div>
                  </div>
                  
                  <blockquote className="text-base sm:text-lg lg:text-xl italic text-white/90 border-r-4 border-amber-400 pr-3 sm:pr-4 mb-3 sm:mb-4">
                    &ldquo;{featuredCaseStudy.quote}&rdquo;
                  </blockquote>
                  <p className="text-xs sm:text-sm text-white/60">— {featuredCaseStudy.author}</p>
                </div>
                
                {/* Right side - Results */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {featuredCaseStudy.results.map((result, index) => (
                    <motion.div
                      key={result.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 text-center border border-white/10"
                    >
                      <div className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-amber-400 mb-0.5 sm:mb-1">
                        {result.metric}
                      </div>
                      <div className="text-[10px] sm:text-xs lg:text-sm text-white/70">{result.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* CTA */}
              <div className="mt-6 sm:mt-8 text-center">
                <motion.button
                  onClick={() => {
                    const element = document.getElementById("contact")
                    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" })
                  }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-900 px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-xl font-bold text-sm sm:text-base shadow-lg transition-all duration-300 active:scale-95"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>{featuredCaseStudy.ctaText}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
