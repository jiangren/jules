'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { StyleSheet } from 'react-native'

export default function StyledJsxRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  useServerInsertedHTML(() => {
    // @ts-ignore
    const styles = StyleSheet.getSheet()
    return (
      <style
        dangerouslySetInnerHTML={{ __html: styles.textContent }}
        id={styles.id}
      />
    )
  })

  return <>{children}</>
}
