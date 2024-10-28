import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sitemap/xml')({
  component: () => <div>Hello /sitemap/xml!</div>,
})
