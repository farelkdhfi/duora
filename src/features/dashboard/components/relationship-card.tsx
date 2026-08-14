import { Heart } from 'lucide-react'

interface RelationshipCardProps {
  userName: string
  partnerName: string
  userAvatarUrl?: string | null
  partnerAvatarUrl?: string | null
  connectedAt?: string | null
}

export default function RelationshipCard({
  userName,
  partnerName,
  userAvatarUrl,
  partnerAvatarUrl,
  connectedAt,
}: RelationshipCardProps) {
  const daysTogether = connectedAt
    ? Math.max(
        1,
        Math.floor(
          (Date.now() -
            new Date(connectedAt).getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : null

  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[2rem]
        border border-black/[0.05]
        bg-white
        px-5
        py-7
        shadow-[0_15px_40px_-25px_rgba(0,0,0,0.14)]
        sm:px-8
        sm:py-9
      "
    >
      {/* ================================================== */}
      {/* AMBIENT */}
      {/* ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-24
          -top-24
          size-64
          rounded-full
          bg-blue-100/25
          blur-[90px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-24
          -right-24
          size-64
          rounded-full
          bg-pink-100/25
          blur-[90px]
        "
      />

      {/* ================================================== */}
      {/* CONTENT */}
      {/* ================================================== */}

      <div className="relative">

        {/* Header */}

        <div className="text-center">

          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-neutral-300
            "
          >
            Your relationship
          </p>

          <h2
            className="
              mt-1.5
              text-[17px]
              font-semibold
              tracking-[-0.03em]
              text-neutral-800
              sm:text-lg
            "
          >
            Together, always.
          </h2>

        </div>


        {/* ================================================== */}
        {/* PEOPLE */}
        {/* ================================================== */}

        <div
          className="
            mt-8
            flex
            items-start
            justify-center
            gap-4
            sm:gap-8
          "
        >

          {/* ================================================= */}
          {/* USER */}
          {/* ================================================= */}

          <Person
            name={userName}
            role="You"
            avatarUrl={userAvatarUrl}
            fallbackClass="text-blue-500"
            ringClass="border-blue-100"
          />


          {/* ================================================= */}
          {/* CONNECTION */}
          {/* ================================================= */}

          <div
            className="
              flex
              shrink-0
              flex-col
              items-center
              pt-7
              sm:pt-10
            "
          >

            <div className="flex items-center gap-2">

              {/* Left line */}

              <div
                className="
                  hidden
                  h-px
                  w-8
                  bg-gradient-to-r
                  from-transparent
                  to-neutral-200
                  sm:block
                  sm:w-12
                  md:w-16
                "
              />


              {/* Heart */}

              <div
                className="
                  relative
                  flex
                  size-12
                  items-center
                  justify-center
                  rounded-full
                  bg-gradient-to-br
                  from-blue-400
                  to-pink-400
                  shadow-[0_10px_25px_-10px_rgba(236,72,153,0.45)]
                  sm:size-14
                "
              >

                <div
                  className="
                    flex
                    size-9
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    shadow-sm
                    sm:size-11
                  "
                >

                  <Heart
                    size={17}
                    strokeWidth={0}
                    fill="currentColor"
                    className="text-pink-400 sm:size-[19px]"
                  />

                </div>

              </div>


              {/* Right line */}

              <div
                className="
                  hidden
                  h-px
                  w-8
                  bg-gradient-to-l
                  from-transparent
                  to-neutral-200
                  sm:block
                  sm:w-12
                  md:w-16
                "
              />

            </div>

          </div>


          {/* ================================================= */}
          {/* PARTNER */}
          {/* ================================================= */}

          <Person
            name={partnerName}
            role="Partner"
            avatarUrl={partnerAvatarUrl}
            fallbackClass="text-pink-500"
            ringClass="border-pink-100"
          />

        </div>


        {/* ================================================== */}
        {/* DAYS TOGETHER */}
        {/* ================================================== */}

        {daysTogether && (
          <div className="mt-7 flex justify-center">

            <div
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-black/[0.05]
                bg-neutral-50/80
                px-4
                py-2
              "
            >

              <div
                className="
                  flex
                  size-5
                  items-center
                  justify-center
                  rounded-full
                  bg-pink-50
                "
              >
                <Heart
                  size={10}
                  strokeWidth={0}
                  fill="currentColor"
                  className="text-pink-400"
                />
              </div>

              <p className="text-[11px] text-neutral-400">

                Together for

                <span className="ml-1 font-semibold text-neutral-700">
                  {daysTogether} days
                </span>

              </p>

            </div>

          </div>
        )}

      </div>
    </section>
  )
}


/* ============================================================= */
/* PERSON */
/* ============================================================= */

function Person({
  name,
  role,
  avatarUrl,
  fallbackClass,
  ringClass,
}: {
  name: string
  role: string
  avatarUrl?: string | null
  fallbackClass: string
  ringClass: string
}) {
  return (
    <div className="min-w-0 text-center">

      {/* Avatar */}

      <div
        className={`
          relative
          mx-auto
          flex
          size-[76px]
          items-center
          justify-center
          rounded-full
          border-[3px]
          bg-white
          p-1
          shadow-[0_8px_25px_-15px_rgba(0,0,0,0.25)]
          sm:size-[100px]
          sm:border-4
          sm:p-1.5
          ${ringClass}
        `}
      >

        {avatarUrl ? (

          <img
            src={avatarUrl}
            alt={name}
            className="
              h-full
              w-full
              rounded-full
              object-cover
            "
          />

        ) : (

          <div
            className="
              flex
              h-full
              w-full
              items-center
              justify-center
              rounded-full
              bg-neutral-50
            "
          >

            <span
              className={`
                text-xl
                font-semibold
                tracking-[-0.04em]
                sm:text-2xl
                ${fallbackClass}
              `}
            >
              {name
                .slice(0, 1)
                .toUpperCase()}
            </span>

          </div>

        )}

      </div>


      {/* Name */}

      <p
        className="
          mt-3
          max-w-[90px]
          truncate
          text-[12px]
          font-semibold
          tracking-[-0.01em]
          text-neutral-800
          sm:max-w-[120px]
          sm:text-[13px]
        "
      >
        {name}
      </p>


      {/* Role */}

      <p
        className="
          mt-0.5
          text-[10px]
          font-medium
          uppercase
          tracking-[0.12em]
          text-neutral-300
        "
      >
        {role}
      </p>

    </div>
  )
}