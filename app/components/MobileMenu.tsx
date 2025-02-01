"use client"

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { ThemeToggle } from './theme-toggle'
import { LanguageToggle } from './LanguageToggle'
import { useLanguage } from '../contexts/LanguageContext'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { translate } = useLanguage()

  useEffect(() => {
    const closeOnResize = () => setIsOpen(false)
    window.addEventListener('resize', closeOnResize)
    return () => window.removeEventListener('resize', closeOnResize)
  }, [])

  const menuItems = [
    { href: "#projects", label: translate("sections.projects"), icon: "💼" },
    { href: "#education", label: translate("sections.education"), icon: "🎓" },
    { href: "#about", label: translate("sections.about"), icon: "📄" },
    { href: "#contact", label: translate("sections.contact"), icon: "📞" },
  ]

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <VisuallyHidden>Toggle navigation menu</VisuallyHidden>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[280px] sm:w-[340px] bg-background/95 backdrop-blur-lg border-l border-primary/20"
      >
        {/* Add accessible title */}
        <VisuallyHidden>
          <SheetTitle>Navigation Menu</SheetTitle>
        </VisuallyHidden>

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-bold text-primary"
            >
              Menu
            </motion.span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-primary"
            >
              <X className="h-5 w-5" />
              <VisuallyHidden>Close menu</VisuallyHidden>
            </Button>
          </div>

          {/* Rest of the content remains the same */}
          <nav className="flex-1 flex flex-col gap-2">
            {menuItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors group"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-lg font-medium text-foreground/90 group-hover:text-primary transition-colors">
                  {item.label}
                </span>
              </motion.a>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-6 border-t border-primary/10"
          >
            <div className="flex items-center justify-between">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  )
}