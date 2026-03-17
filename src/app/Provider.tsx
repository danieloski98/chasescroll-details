"use client"
import React from 'react'
import {HeroUIProvider} from "@heroui/react";
import {ToastProvider} from "@heroui/toast";



function Provider({children}: {children: React.ReactNode}) {
  return (
    <HeroUIProvider>
        <ToastProvider />
        {children}
    </HeroUIProvider>
  )
}

export default Provider