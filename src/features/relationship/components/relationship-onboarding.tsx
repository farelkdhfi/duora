'use client'

import { useState } from 'react'

import CreateRelationshipForm from './create-relationship-form'
import JoinRelationshipForm from './join-relationship-form'

export default function RelationshipOnboarding() {
  const [mode, setMode] = useState<
    'create' | 'join'
  >('create')

  return (
    <div>
      <div>
        <button
          type="button"
          onClick={() => setMode('create')}
        >
          Create
        </button>

        <button
          type="button"
          onClick={() => setMode('join')}
        >
          Join
        </button>
      </div>

      {mode === 'create' ? (
        <CreateRelationshipForm />
      ) : (
        <JoinRelationshipForm />
      )}
    </div>
  )
}