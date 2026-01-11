"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { signOut } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonalInfoForm } from "./personal-info-form"
import { TaskList } from "./task-list"
import { DocumentUpload } from "./document-upload"
import { LogOut, User, CheckCircle2, Clock, Upload } from "lucide-react"

interface CandidateDashboardProps {
  candidate: any
  tasks: any[]
  documents: any[]
}

export function CandidateDashboard({ candidate, tasks, documents }: CandidateDashboardProps) {
  const [activeTab, setActiveTab] = useState("tasks")

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "ממתין", variant: "secondary" as const },
      in_progress: { label: "בתהליך", variant: "default" as const },
      completed: { label: "הושלם", variant: "default" as const },
      approved: { label: "אושר", variant: "default" as const },
    }
    return statusMap[status as keyof typeof statusMap] || statusMap.pending
  }

  const statusBadge = getStatusBadge(candidate.status)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0"
            >
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </motion.div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate text-right">
                שלום, {candidate.first_name} {candidate.last_name}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground text-right">פורטל קליטת עובדים</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <Button variant="outline" onClick={() => signOut()} className="h-9 sm:h-10 px-3 sm:px-4 text-sm sm:text-base flex-shrink-0 touch-manipulation hover:bg-primary hover:text-primary-foreground">
              <LogOut className="ml-1 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">התנתק</span>
            </Button>
          </motion.div>
        </div>
      </motion.header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <Card className="border-2">
              <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
                <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  <span className="truncate text-right">סטטוס כללי</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                <Badge variant={statusBadge.variant} className="text-sm sm:text-base px-3 sm:px-4 py-1">
                  {statusBadge.label}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <Card className="border-2">
              <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
                <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-1.5 sm:gap-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  <span className="truncate text-right">התקדמות</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-3 sm:px-6 pb-3 sm:pb-6">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground text-right">משימות שהושלמו</span>
                  <span className="font-bold text-right">
                    {completedTasks} מתוך {totalTasks}
                  </span>
                </div>
                <Progress value={progress} className="h-2 sm:h-3" />
                <p className="text-[10px] sm:text-xs text-muted-foreground text-center">{progress}% הושלם</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-auto p-0.5 sm:p-1 bg-card border-2 gap-0.5 sm:gap-1">
              <TabsTrigger value="tasks" className="text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3 px-1 sm:px-2 touch-manipulation">
                <CheckCircle2 className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="hidden sm:inline sm:mr-1">משימות</span>
                <span className="sm:hidden">משימות</span>
              </TabsTrigger>
              <TabsTrigger value="personal" className="text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3 px-1 sm:px-2 touch-manipulation">
                <User className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="hidden sm:inline sm:mr-1">פרטים</span>
                <span className="sm:hidden">פרטים</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3 px-1 sm:px-2 touch-manipulation">
                <Upload className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="hidden sm:inline sm:mr-1">מסמכים</span>
                <span className="sm:hidden">מסמכים</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tasks">
              <motion.div
                key="tasks"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <TaskList 
                  tasks={tasks} 
                  candidateId={candidate.id} 
                  documents={documents}
                  onNavigateToTab={setActiveTab}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="personal">
              <motion.div
                key="personal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <PersonalInfoForm candidate={candidate} />
              </motion.div>
            </TabsContent>

            <TabsContent value="documents">
              <motion.div
                key="documents"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <DocumentUpload candidateId={candidate.id} documents={documents} />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  )
}
