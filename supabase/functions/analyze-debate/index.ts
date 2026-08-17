import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY')!
const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get(
  'SUPABASE_SERVICE_ROLE_KEY',
)!

type AiProvider = 'openrouter' | 'groq'

interface ProviderConfig {
  url: string
  apiKey: string
  model: string
}

const PROVIDER_CONFIG: Record<AiProvider, ProviderConfig> = {
  openrouter: {
    url: 'https://openrouter.ai/api/v1/chat/completions',
    apiKey: OPENROUTER_API_KEY,
    model: 'openai/gpt-oss-20b:free',
  },
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    apiKey: GROQ_API_KEY,
    model: 'openai/gpt-oss-20b',
  },
}
// Urutan fallback default kalau user tidak memilih provider spesifik
const DEFAULT_PROVIDER_ORDER: AiProvider[] = [
  'openrouter',
  'groq',
]

function buildCommentPrompt(
  participantNames: string[],
) {
  return `Kamu adalah partisipan diskusi netral yang membantu pasangan (${participantNames.join(' dan ')}) menganalisis perdebatan mereka.

Kamu SUDAH ikut dalam percakapan ini sebelumnya (kalau ada histori komentarmu, lanjutkan dengan konsisten, jangan mengulang dari awal).

Tugasmu di setiap giliran:
1. Baca argumen terbaru dari kedua pihak.
2. Pisahkan mana OPINI (perasaan/preferensi) dan mana FAKTA (bisa diverifikasi).
3. Beri tanggapan singkat dan membangun — boleh menantang logika salah satu pihak dengan sopan kalau ada kelemahan argumen, tapi JANGAN menyerang personal.
4. Saat menyebut salah satu pihak, gunakan NAMA ASLI mereka (${participantNames.join(', ')}), jangan pakai sebutan generik seperti "pihak A" atau "pasangan pertama".
5. Jangan menyimpulkan pemenang dulu di tahap ini — itu hanya untuk kesimpulan akhir nanti.

WAJIB balas HANYA dalam format JSON valid:

{
  "facts": ["fakta relevan yang baru muncul"],
  "opinions": ["opini pihak yang relevan, sebut nama aslinya"],
  "common_ground": "titik temu yang mulai terlihat (kalau ada)",
  "summary": "tanggapanmu ke percakapan ini, natural seperti partisipan diskusi, sapa mereka dengan nama"
}`
}

function buildFinalVerdictPrompt(
  participantNames: string[],
) {
  return `Kamu adalah mediator netral yang akan memberi KESIMPULAN AKHIR dari sebuah diskusi/perdebatan pasangan bernama ${participantNames.join(' dan ')}.

Baca seluruh percakapan, termasuk semua komentarmu sebelumnya di diskusi ini.

Tugasmu sekarang:
1. Rangkum fakta-fakta kunci yang relevan.
2. Rangkum opini masing-masing pihak — SEBUT NAMA ASLI mereka (${participantNames.join(', ')}), jangan pakai "pihak A/B" atau sebutan generik.
3. Tentukan secara ANALITIS argumen mana yang lebih kuat/logis, dengan alasan yang jelas dan berbasis fakta/logika — bukan berdasarkan siapa yang "lebih baik" sebagai orang. Sebut nama orangnya secara eksplisit di penjelasan ini.
4. Tetap hormati kedua pihak: sampaikan dengan nada membangun, bukan menghakimi karakter siapa pun.
5. Di bagian summary, sapa MASING-MASING orang secara personal dengan nama mereka — buat terasa seperti kesimpulan yang ditujukan khusus untuk mereka berdua, bukan template generik.
6. Beri titik temu atau langkah konkret yang bisa mereka ambil bersama ke depannya.

WAJIB balas HANYA dalam format JSON valid:

{
  "facts": ["fakta kunci 1", "fakta kunci 2"],
  "opinions": ["opini ${participantNames[0] ?? 'pihak pertama'}: ...", "opini ${participantNames[1] ?? 'pihak kedua'}: ..."],
  "common_ground": "titik temu yang bisa mereka sepakati",
  "stronger_argument": "penjelasan argumen mana yang lebih logis dan kenapa, sebut nama orangnya, disampaikan secara netral dan berbasis fakta",
  "summary": "kesimpulan akhir yang menyapa kedua nama secara personal, dan saran langkah ke depan"
}`
}

function normalizeStringArray(
  value: unknown,
): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => {
      if (typeof item === 'string') {
        return item
      }

      if (item && typeof item === 'object') {
        const obj = item as Record<string, unknown>

        const values = Object.values(obj)
          .filter(
            (v) => typeof v === 'string',
          )
          .join(': ')

        return values || JSON.stringify(item)
      }

      return String(item)
    })
    .filter(Boolean)
}

function normalizeAnalysis(
  raw: any,
): {
  facts: string[]
  opinions: string[]
  common_ground: string
  summary: string
  stronger_argument?: string
} {
  return {
    facts: normalizeStringArray(raw?.facts),
    opinions: normalizeStringArray(
      raw?.opinions,
    ),
    common_ground:
      typeof raw?.common_ground === 'string'
        ? raw.common_ground
        : '',
    summary:
      typeof raw?.summary === 'string'
        ? raw.summary
        : '',
    stronger_argument:
      typeof raw?.stronger_argument === 'string'
        ? raw.stronger_argument
        : undefined,
  }
}

interface CallAiProviderParams {
  provider: AiProvider
  systemPrompt: string
  userPrompt: string
  temperature: number
}

async function callAiProvider({
  provider,
  systemPrompt,
  userPrompt,
  temperature,
}: CallAiProviderParams): Promise<string> {
  const config = PROVIDER_CONFIG[provider]

  if (!config.apiKey) {
    throw new Error(
      `API key untuk provider "${provider}" belum diset`,
    )
  }

  const response = await fetch(config.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `${provider} error (${response.status}): ${errorText}`,
    )
  }

  const result = await response.json()
  const content = result.choices?.[0]?.message?.content

  if (!content) {
    throw new Error(
      `${provider} mengembalikan respons kosong`,
    )
  }

  return content
}

interface CallAiWithFallbackParams {
  preferredProvider: AiProvider | null
  systemPrompt: string
  userPrompt: string
  temperature: number
}

interface CallAiWithFallbackResult {
  content: string
  providerUsed: AiProvider
}

async function callAiWithFallback({
  preferredProvider,
  systemPrompt,
  userPrompt,
  temperature,
}: CallAiWithFallbackParams): Promise<CallAiWithFallbackResult> {
  const providersToTry = preferredProvider
    ? [preferredProvider]
    : DEFAULT_PROVIDER_ORDER

  const errors: string[] = []

  for (const provider of providersToTry) {
    try {
      const content = await callAiProvider({
        provider,
        systemPrompt,
        userPrompt,
        temperature,
      })

      return { content, providerUsed: provider }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : String(error)

      errors.push(`[${provider}] ${message}`)
      continue
    }
  }

  throw new Error(
    `Semua provider AI gagal:\n${errors.join('\n')}`,
  )
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders,
    })
  }

  try {
    const {
      debateId,
      mode,
      provider,
    } = await req.json()

    if (!debateId) {
      return new Response(
        JSON.stringify({
          error: 'debateId is required',
        }),
        { status: 400, headers: corsHeaders },
      )
    }

    // Validasi provider kalau user pilih manual
    const preferredProvider: AiProvider | null =
      provider === 'openrouter' ||
      provider === 'groq'
        ? provider
        : null

    const isFinalVerdict = mode === 'final_verdict'

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
    )

    const {
      data: messages,
      error: messagesError,
    } = await supabase
      .from('debate_messages')
      .select(
        `
        role,
        content,
        sender_id,
        profiles:sender_id (
          display_name,
          username
        )
      `,
      )
      .eq('debate_id', debateId)
      .order('created_at', { ascending: true })

    if (messagesError) {
      throw new Error(messagesError.message)
    }

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'No messages to analyze',
        }),
        { status: 400, headers: corsHeaders },
      )
    }

    const participantNames: string[] = []
    const seenSenderIds = new Set<string>()

    for (const m of messages) {
      if (m.role !== 'user' || !m.sender_id) continue
      if (seenSenderIds.has(m.sender_id)) continue

      const name =
        (m.profiles as any)?.display_name ??
        (m.profiles as any)?.username ??
        'Seseorang'

      participantNames.push(name)
      seenSenderIds.add(m.sender_id)
    }

    const transcript = messages
      .map((m) => {
        if (m.role === 'ai') {
          return `[AI Mediator]: ${m.content}`
        }

        const name =
          (m.profiles as any)?.display_name ??
          (m.profiles as any)?.username ??
          'Seseorang'

        return `${name}: ${m.content}`
      })
      .join('\n')

    const systemPrompt = isFinalVerdict
      ? buildFinalVerdictPrompt(participantNames)
      : buildCommentPrompt(participantNames)

    const userPrompt = isFinalVerdict
      ? `Berikut seluruh transkrip diskusi:\n\n${transcript}\n\nBerikan kesimpulan akhir dan tentukan argumen mana yang lebih logis. Sapa ${participantNames.join(' dan ')} secara personal.`
      : `Berikut transkrip diskusi sejauh ini:\n\n${transcript}\n\nBerikan tanggapanmu sebagai partisipan diskusi.`

    const {
      content: rawContent,
      providerUsed,
    } = await callAiWithFallback({
      preferredProvider,
      systemPrompt,
      userPrompt,
      temperature: isFinalVerdict ? 0.3 : 0.5,
    })

    let analysis
    try {
      const jsonMatch = rawContent.match(
        /\{[\s\S]*\}/,
      )
      const parsed = JSON.parse(
        jsonMatch ? jsonMatch[0] : rawContent,
      )
      analysis = normalizeAnalysis(parsed)
    } catch {
      analysis = {
        facts: [],
        opinions: [],
        common_ground: '',
        summary: rawContent,
      }
    }

    const {
      data: savedMessage,
      error: insertError,
    } = await supabase
      .from('debate_messages')
      .insert({
        debate_id: debateId,
        sender_id: null,
        role: 'ai',
        content: analysis.summary ?? rawContent,
        ai_analysis: analysis,
        is_final_verdict: isFinalVerdict,
        ai_provider: providerUsed,
      })
      .select()
      .single()

    if (insertError) {
      if (insertError.code === '23505') {
        return new Response(
          JSON.stringify({
            message: null,
            note: 'Final verdict already exists for this debate',
          }),
          {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          },
        )
      }

      throw new Error(insertError.message)
    }

    if (isFinalVerdict) {
      await supabase
        .from('debates')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
        })
        .eq('id', debateId)
    }

    return new Response(
      JSON.stringify({
        message: savedMessage,
        providerUsed,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error',
      }),
      { status: 500, headers: corsHeaders },
    )
  }
})