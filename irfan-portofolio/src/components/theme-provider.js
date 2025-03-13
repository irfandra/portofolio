"use client"

import React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children, ...props }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark" // Set dark as the default
      enableSystem={true} // Optional: still allow system preference to override
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}