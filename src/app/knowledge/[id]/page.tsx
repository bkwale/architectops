'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getKnowledgeArticle, getUser } from '@/lib/mock-data'
import { RIBA_STAGES } from '@/lib/types'
import { Breadcrumb } from '@/components/Breadcrumb'
import { cn, formatDate, knowledgeCategoryLabel, knowledgeCategoryColor } from '@/lib/utils'

// Simple markdown parser for our specific needs
function parseMarkdown(md: string): React.ReactNode[] {
  const lines = md.split('\n')
  const result: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // H1
    if (line.startsWith('# ')) {
      result.push(
        <h1 key={`h1-${i}`} className="font-display text-[1.75rem] text-ink-900 mt-8 mb-4">
          {line.substring(2)}
        </h1>
      )
      i++
    }
    // H2
    else if (line.startsWith('## ')) {
      result.push(
        <h2 key={`h2-${i}`} className="font-display text-[1.25rem] text-ink-900 mt-6 mb-3">
          {line.substring(3)}
        </h2>
      )
      i++
    }
    // H3
    else if (line.startsWith('### ')) {
      result.push(
        <h3 key={`h3-${i}`} className="font-semibold text-[1rem] text-ink-900 mt-4 mb-2">
          {line.substring(4)}
        </h3>
      )
      i++
    }
    // Checkbox list item
    else if (line.match(/^- \[ \]/)) {
      const items: string[] = []
      while (i < lines.length && lines[i].match(/^- \[ \]/)) {
        items.push(lines[i].substring(6))
        i++
      }
      result.push(
        <ul key={`checklist-${i}`} className="space-y-2 mb-4 list-none">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-[15px] text-ink-700 leading-relaxed">
              <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-surface-300 text-ink-900 focus:ring-2 focus:ring-accent-500" disabled />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    }
    // Bullet list
    else if (line.startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith('- ') && !lines[i].match(/^- \[ \]/)) {
        items.push(lines[i].substring(2))
        i++
      }
      result.push(
        <ul key={`list-${i}`} className="space-y-1 mb-4 list-disc list-inside text-[15px] text-ink-700 leading-relaxed">
          {items.map((item, idx) => (
            <li key={idx} className="ml-2">{formatInlineMarkdown(item)}</li>
          ))}
        </ul>
      )
    }
    // Numbered list
    else if (line.match(/^\d+\. /)) {
      const items: string[] = []
      let num = 1
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(lines[i].replace(/^\d+\. /, ''))
        i++
      }
      result.push(
        <ol key={`ordered-${i}`} className="space-y-1 mb-4 list-decimal list-inside text-[15px] text-ink-700 leading-relaxed">
          {items.map((item, idx) => (
            <li key={idx} className="ml-2">{formatInlineMarkdown(item)}</li>
          ))}
        </ol>
      )
    }
    // Empty line
    else if (line.trim() === '') {
      i++
    }
    // Paragraph
    else {
      const paragraphs: string[] = []
      while (i < lines.length && lines[i].trim() && !lines[i].match(/^#+/) && !lines[i].startsWith('-') && !lines[i].match(/^\d+\./)) {
        paragraphs.push(lines[i])
        i++
      }
      if (paragraphs.length > 0) {
        result.push(
          <p key={`p-${i}`} className="text-[15px] text-ink-700 leading-relaxed mb-4">
            {formatInlineMarkdown(paragraphs.join(' '))}
          </p>
        )
      }
    }
  }

  return result
}

// Format inline markdown: **bold**, _italic_
function formatInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let current = text
  let key = 0

  while (current) {
    const boldMatch = current.match(/\*\*([^*]+)\*\*/)
    if (boldMatch) {
      const before = current.substring(0, boldMatch.index)
      if (before) parts.push(before)
      parts.push(
        <strong key={`b-${key++}`} className="font-semibold text-ink-900">{boldMatch[1]}</strong>
      )
      current = current.substring(boldMatch.index! + boldMatch[0].length)
    } else {
      parts.push(current)
      break
    }
  }

  return parts.length === 1 ? parts[0] : parts
}

export default function ArticleDetailPage() {
  const params = useParams()
  const articleId = params.id as string
  const article = getKnowledgeArticle(articleId)

  if (!article) {
    return (
      <div className="space-y-8 max-w-4xl">
        <Breadcrumb items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Knowledge Base', href: '/knowledge' },
          { label: 'Not Found' }
        ]} />
        <div className="bg-white rounded-2xl border border-surface-200 p-10 text-center">
          <p className="text-[13px] text-ink-300">Article not found.</p>
          <Link href="/knowledge" className="text-[12px] text-accent-600 hover:text-accent-700 transition-colors mt-4 inline-block">
            Back to Knowledge Base →
          </Link>
        </div>
      </div>
    )
  }

  const author = getUser(article.owner_user_id)

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Dashboard', href: '/' },
        { label: 'Knowledge Base', href: '/knowledge' },
        { label: article.title }
      ]} />

      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          {/* Category badge */}
          <div className="mb-4">
            <span className={cn(
              'inline-block px-2.5 py-1 rounded text-[11px] font-medium',
              knowledgeCategoryColor(article.category)
            )}>
              {knowledgeCategoryLabel(article.category)}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-[1.75rem] text-ink-900 mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-[12px] text-ink-400 border-b border-surface-100 pb-6">
            <div className="flex items-center gap-3">
              {author && (
                <>
                  <span className="text-ink-600 font-medium">{author.name}</span>
                  <span className="text-ink-300">·</span>
                </>
              )}
              <span className="font-mono">{formatDate(article.created_at)}</span>
            </div>
            {article.updated_at !== article.created_at && (
              <div className="flex items-center gap-3 text-ink-300">
                <span>·</span>
                <span>Updated {formatDate(article.updated_at)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main content + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Article body */}
          <div className="lg:col-span-2 prose-sm max-w-none">
            <div className="space-y-0">
              {parseMarkdown(article.body_markdown)}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Tags */}
            {article.tags.length > 0 && (
              <div>
                <h3 className="text-[10px] font-semibold text-ink-400 uppercase tracking-[0.1em] mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, i) => (
                    <span key={i} className="bg-surface-100 text-ink-500 text-[11px] rounded-full px-2.5 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Stage */}
            {article.related_stage !== undefined && (
              <div>
                <h3 className="text-[10px] font-semibold text-ink-400 uppercase tracking-[0.1em] mb-3">Related RIBA Stage</h3>
                <p className="text-[13px] text-ink-700 bg-surface-50 rounded-lg p-3 border border-surface-100">
                  <span className="font-medium">Stage {article.related_stage}</span>
                  <br />
                  <span className="text-ink-500 text-[12px]">{RIBA_STAGES[article.related_stage]}</span>
                </p>
              </div>
            )}

            {/* Related Sector */}
            {article.related_sector && (
              <div>
                <h3 className="text-[10px] font-semibold text-ink-400 uppercase tracking-[0.1em] mb-3">Sector</h3>
                <p className="text-[13px] text-ink-700 bg-surface-50 rounded-lg p-3 border border-surface-100">
                  {article.related_sector}
                </p>
              </div>
            )}

            {/* Related Contract Type */}
            {article.related_contract_type && (
              <div>
                <h3 className="text-[10px] font-semibold text-ink-400 uppercase tracking-[0.1em] mb-3">Contract Type</h3>
                <p className="text-[13px] text-ink-700 bg-surface-50 rounded-lg p-3 border border-surface-100">
                  {article.related_contract_type}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-surface-100">
          <Link href="/knowledge" className="text-[12px] text-accent-600 hover:text-accent-700 transition-colors font-medium uppercase tracking-[0.1em]">
            ← Back to Knowledge Base
          </Link>
        </div>
      </div>
    </div>
  )
}
