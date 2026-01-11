"use client"

import { useState } from "react"
import { toggleTask } from "@/app/actions/candidate"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, Circle, ArrowLeft, Calendar, Upload, FileText } from "lucide-react"

interface TaskListProps {
  tasks: any[]
  candidateId: number
  documents?: any[]
  onNavigateToTab?: (tab: string) => void
}

export function TaskList({ tasks, candidateId, documents = [], onNavigateToTab }: TaskListProps) {
  const [taskStates, setTaskStates] = useState(tasks)
  const { toast } = useToast()

  async function handleToggleTask(taskId: number, currentState: boolean) {
    const result = await toggleTask(taskId, !currentState)

    if (result?.error) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: result.error,
      })
    } else {
      setTaskStates((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: !currentState } : task)))
      toast({
        title: "הצלחה",
        description: !currentState ? "המשימה סומנה כהושלמה" : "המשימה סומנה כלא הושלמה",
      })
    }
  }

  function getTaskAction(task: any) {
    const title = task.title.toLowerCase()
    
    if (title.includes("מילוי פרטים אישיים") || title.includes("פרטים אישיים")) {
      return {
        label: "מעבר למילוי פרטים",
        icon: ArrowLeft,
        action: () => onNavigateToTab?.("personal"),
      }
    }
    
    if (title.includes("זום") || title.includes("פגישה")) {
      return {
        label: "תזמן פגישה",
        icon: Calendar,
        action: () => {
          // Open calendar link or show scheduling UI
          window.open("https://calendly.com", "_blank")
        },
      }
    }
    
    if (title.includes("רישיון נהיגה") || title.includes("רישיון")) {
      const hasDrivingLicense = documents.some((doc: any) => doc.document_type === "drivers_license")
      return {
        label: hasDrivingLicense ? "צפה במסמך" : "העלה מסמך",
        icon: Upload,
        action: () => onNavigateToTab?.("documents"),
      }
    }
    
    if (title.includes("מסמכים משפטיים") || title.includes("חתימה")) {
      return {
        label: "העלה מסמכים",
        icon: FileText,
        action: () => onNavigateToTab?.("documents"),
      }
    }
    
    return null
  }

  const completedCount = taskStates.filter((t) => t.completed).length
  const totalCount = taskStates.length

  return (
    <Card className="border-2">
      <CardHeader className="px-3 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Badge variant="secondary" className="text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 w-fit">
            {completedCount} / {totalCount}
          </Badge>
          <div>
            <CardTitle className="text-xl sm:text-2xl text-right">רשימת משימות</CardTitle>
            <CardDescription className="text-sm sm:text-base text-right">השלם את כל המשימות כדי להתקדם בתהליך הקליטה</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
        <div className="space-y-3 sm:space-y-4">
          {taskStates.map((task, index) => {
            const taskAction = getTaskAction(task)
            // Find the first uncompleted task
            const firstUncompletedIndex = taskStates.findIndex((t) => !t.completed)
            const isActiveTask = !task.completed && index === firstUncompletedIndex
            
            return (
              <div
                key={task.id}
                className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border-2 transition-colors touch-manipulation flex-row-reverse relative ${
                  isActiveTask 
                    ? 'border-primary' 
                    : 'hover:border-primary/50'
                }`}
                style={isActiveTask ? { backgroundColor: '#FFD4A3' } : undefined}
              >
                <button
                  onClick={() => handleToggleTask(task.id, task.completed)}
                  className="flex-shrink-0 touch-manipulation"
                  aria-label={task.completed ? "סמן כלא הושלם" : "סמן כהושלם"}
                >
                  {task.completed ? (
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-base sm:text-lg text-right ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 text-right">{task.description}</p>
                  {task.completed && task.completed_at && (
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 text-right">
                      הושלם ב-{new Date(task.completed_at).toLocaleDateString("he-IL")}
                    </p>
                  )}
                  {!task.completed && taskAction && (
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={taskAction.action}
                        className="text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4 touch-manipulation hover:bg-primary hover:text-primary-foreground"
                      >
                        <taskAction.icon className="ml-1 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        {taskAction.label}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
