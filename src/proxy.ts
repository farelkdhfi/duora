import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Routes yang TIDAK memerlukan login
const PUBLIC_PATHS = ['/', '/login', '/register']

const PUBLIC_PREFIXES = ['/auth']

const ONBOARDING_PATH = '/onboarding'
const DASHBOARD_PATH = '/dashboard'

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.includes(pathname)) return true
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function isOnboardingPath(pathname: string) {
  return (
    pathname === ONBOARDING_PATH ||
    pathname.startsWith(`${ONBOARDING_PATH}/`)
  )
}

type SupabaseServerClient = ReturnType<typeof createServerClient>

/**
 * true  -> user sudah punya relationship
 * false -> user belum punya relationship
 * null  -> gagal mengecek (error DB), jangan redirect apa-apa
 *
 * SESUAIKAN nama tabel & kolom dengan schema kamu.
 */
async function hasRelationship(
  supabase: SupabaseServerClient,
  userId: string,
): Promise<boolean | null> {
  const { data, error } = await supabase
    .from('relationship_members')
    .select('relationship_id')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Failed to check relationship:', error)
    return null
  }

  return !!data
}

// Redirect sambil membawa cookie session yang baru di-refresh
function redirectTo(
  request: NextRequest,
  response: NextResponse,
  pathname: string,
) {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  url.search = ''

  const redirect = NextResponse.redirect(url)

  response.cookies.getAll().forEach((cookie) => {
    redirect.cookies.set(cookie)
  })

  return redirect
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )

          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Refresh session kalau expired — wajib dipanggil sebelum ambil user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Belum login & mengakses route yang dilindungi -> redirect ke /login
  if (!user && !isPublicPath(pathname)) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Sudah login tapi mengakses /login atau /register -> redirect ke /dashboard
  if (user && (pathname === '/login' || pathname === '/register')) {
    return redirectTo(request, response, DASHBOARD_PATH)
  }

  // Sudah login & mengakses route yang dilindungi -> cek relationship
  if (user && !isPublicPath(pathname)) {
    const hasRel = await hasRelationship(supabase, user.id)
    const onOnboarding = isOnboardingPath(pathname)

    // Belum punya relationship -> paksa ke /onboarding
    if (hasRel === false && !onOnboarding) {
      return redirectTo(request, response, ONBOARDING_PATH)
    }

    // Sudah punya relationship -> tidak perlu onboarding lagi
    if (hasRel === true && onOnboarding) {
      return redirectTo(request, response, DASHBOARD_PATH)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Jalankan middleware di semua path KECUALI:
     * - _next/static (file statis)
     * - _next/image (optimasi gambar)
     * - favicon.ico
     * - file dengan ekstensi (gambar, svg, dll)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}