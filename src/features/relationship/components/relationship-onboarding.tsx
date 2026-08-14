'use client'

import { useState } from 'react'

import CreateRelationshipForm from './create-relationship-form'
import JoinRelationshipForm from './join-relationship-form'

export default function RelationshipOnboarding() {
  const [mode, setMode] = useState<'create' | 'join'>('create')

  return (
    <div>
      <div className="inline-flex rounded-full border border-black/[0.05] bg-neutral-50 p-1">
        <button
          type="button"
          onClick={() => setMode('create')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
            mode === 'create'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          Create
        </button>

        <button
          type="button"
          onClick={() => setMode('join')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
            mode === 'join'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-600'
          }`}
        >
          Join
        </button>
      </div>

      <div className="mt-6">
        {mode === 'create' ? (
          <CreateRelationshipForm />
        ) : (
          <JoinRelationshipForm />
        )}
      </div>
    </div>
  )
}