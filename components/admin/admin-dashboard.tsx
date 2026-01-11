"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { signOut } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { CandidateTable } from "./candidate-table"
import { DocumentApproval } from "./document-approval"
import { AdminStats } from "./admin-stats"
import { LogOut, Shield, Users, FileCheck, BarChart3, Search } from "lucide-react"

interface AdminDashboardProps {
  candidates: any[]
  pendingDocuments: any[]
  stats: any
  adminEmail: string
}

export function AdminDashboard({ candidates, pendingDocuments, stats, adminEmail }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </motion.div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">לוח ניהול מנהל</h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{adminEmail}</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <Button variant="outline" onClick={() => signOut()} className="h-9 sm:h-10 px-3 sm:px-4 text-sm sm:text-base flex-shrink-0 touch-manipulation hover:bg-primary hover:text-primary-foreground">
              <LogOut className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">התנתק</span>
            </Button>
          </motion.div>
        </div>
      </motion.header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <Card className="border-2">
              <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
                <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-1.5 sm:gap-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  <span className="truncate">סה"כ מועמדים</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                <div className="text-2xl sm:text-3xl font-bold">{stats.total_count}</div>
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
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 flex-shrink-0" />
                  <span className="truncate">ממתינים</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                <div className="text-2xl sm:text-3xl font-bold text-yellow-600">{stats.pending_count}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <Card className="border-2">
              <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
                <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-1.5 sm:gap-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                  <span className="truncate">בתהליך</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.in_progress_count}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          >
            <Card className="border-2">
              <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
                <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-1.5 sm:gap-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  <span className="truncate">אושרו</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                <div className="text-2xl sm:text-3xl font-bold text-green-600">{stats.approved_count}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-auto p-0.5 sm:p-1 bg-card border-2 gap-0.5 sm:gap-1">
              <TabsTrigger value="overview" className="text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3 px-1 sm:px-2 touch-manipulation">
                <BarChart3 className="ml-1 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="hidden sm:inline sm:ml-1">סקירה כללית</span>
                <span className="sm:hidden">סקירה</span>
              </TabsTrigger>
              <TabsTrigger value="candidates" className="text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3 px-1 sm:px-2 touch-manipulation relative">
                <Users className="ml-1 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="hidden sm:inline sm:ml-1">מועמדים</span>
                <span className="sm:hidden">מועמדים</span>
                {stats.pending_count > 0 && (
                  <Badge variant="destructive" className="mr-1 sm:mr-2 text-[10px] sm:text-xs h-4 sm:h-5 px-1 sm:px-1.5 absolute -top-1 -right-1 sm:relative sm:top-0 sm:right-0">
                    {stats.pending_count}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="documents" className="text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3 px-1 sm:px-2 touch-manipulation relative">
                <FileCheck className="ml-1 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="hidden sm:inline sm:ml-1">מסמכים</span>
                <span className="sm:hidden">מסמכים</span>
                {pendingDocuments.length > 0 && (
                  <Badge variant="destructive" className="mr-1 sm:mr-2 text-[10px] sm:text-xs h-4 sm:h-5 px-1 sm:px-1.5 absolute -top-1 -right-1 sm:relative sm:top-0 sm:right-0">
                    {pendingDocuments.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <AdminStats candidates={candidates} stats={stats} />
              </motion.div>
            </TabsContent>

            <TabsContent value="candidates" className="space-y-4 sm:space-y-6">
              <motion.div
                key="candidates"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Card className="border-2">
                  <CardHeader className="px-3 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                      <div>
                        <CardTitle className="text-xl sm:text-2xl">ניהול מועמדים</CardTitle>
                        <CardDescription className="text-sm sm:text-base">צפייה וניהול כל המועמדים במערכת</CardDescription>
                      </div>
                      <div className="w-full sm:w-64">
                        <div className="relative">
                          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="חפש מועמד..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pr-10 h-10 sm:h-11 text-sm sm:text-base"
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
                    <CandidateTable candidates={filteredCandidates} />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="documents">
              <motion.div
                key="documents"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <DocumentApproval documents={pendingDocuments} />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  )
}
