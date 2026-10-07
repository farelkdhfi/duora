const ORB_SHAPE_1 =
  "M100,37 C136,37 163,66 163,102 C163,137 134,163 98,163 C63,163 37,133 37,98 C37,62 66,37 100,37 Z";
const ORB_SHAPE_2 =
  "M106,40 C141,42 162,64 160,96 C158,132 136,162 102,160 C66,158 38,138 40,104 C42,68 73,38 106,40 Z";
const ORB_SHAPE_3 =
  "M94,40 C132,38 164,67 165,100 C167,138 142,163 106,164 C72,165 37,130 36,96 C34,59 61,41 94,40 Z";
const ORB_SHAPE_4 =
  "M98,35 C132,36 161,66 160,100 C159,133 135,160 100,161 C66,162 37,133 38,100 C39,65 61,34 98,35 Z";

const ORB_EASE = "0.45 0 0.55 1";

const ORB_MORPH_ANIMATION = {
  attributeName: "d",
  values: [ORB_SHAPE_1, ORB_SHAPE_2, ORB_SHAPE_3, ORB_SHAPE_4, ORB_SHAPE_1].join(
    ";",
  ),
  keyTimes: "0;0.25;0.5;0.75;1",
  keySplines: [ORB_EASE, ORB_EASE, ORB_EASE, ORB_EASE].join(";"),
  calcMode: "spline",
  dur: "5s",
  repeatCount: "indefinite",
} as const;

const ORB_EASE_HALF = [ORB_EASE, ORB_EASE].join(";");

interface LoveWaveProps {
  size?: number
  /** Bayangan lembut di bawah orb. Default: false supaya nyatu dengan background parent. */
  shadow?: boolean
}

export default function LoveWave({ size = 190, shadow = false }: LoveWaveProps) {
  return (
    <div
      className="duora-love-wrap"
      style={{
        width: size,
        height: size,
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .duora-love-wrap {
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            }

            /* Glow berbentuk cincin: tengahnya kosong supaya
               warna background parent tetap terlihat di dalam orb */
            .duora-love-glow {
              position: absolute;
              border-radius: 9999px;
              background:
                radial-gradient(
                  circle closest-side,
                  transparent 0%,
                  transparent 50%,
                  rgba(147, 160, 255, 0.22) 66%,
                  rgba(200, 165, 255, 0.15) 80%,
                  rgba(255, 170, 215, 0.08) 90%,
                  transparent 100%
                );
              animation: duoraLoveGlow 7s ease-in-out infinite;
              pointer-events: none;
            }

            .duora-love-svg {
              position: relative;
              width: 175px;
              height: 175px;
              overflow: visible;
            }

            .duora-orb-layer {
              transform-box: view-box;
              transform-origin: 100px 100px;
            }

            .duora-orb-flow-a {
              animation: duoraOrbFlowA 5s ease-in-out infinite;
            }

            .duora-orb-flow-b {
              animation: duoraOrbFlowB 7s ease-in-out infinite;
              animation-delay: -11s;
            }

            .duora-orb-flow-c {
              animation: duoraOrbFlowC 5s ease-in-out infinite;
              animation-delay: -17s;
            }

            .duora-orb-ribbon-a {
              animation: duoraOrbRibbonA 6s ease-in-out infinite;
              animation-delay: -6s;
            }

            .duora-orb-ribbon-b {
              animation: duoraOrbRibbonB 8s ease-in-out infinite;
              animation-delay: -21s;
            }

            .duora-orb-caustic {
              animation: duoraOrbCaustic 1s ease-in-out infinite;
            }

            .duora-orb-spec-a {
              animation: duoraOrbSpecA 2s ease-in-out infinite;
            }

            .duora-orb-spec-b {
              animation: duoraOrbSpecB 3s ease-in-out infinite;
              animation-delay: -8s;
            }

            @keyframes duoraLoveGlow {
              0%,
              100% {
                transform: scale(0.86);
                opacity: 0.6;
              }

              50% {
                transform: scale(1.1);
                opacity: 1;
              }
            }

            @keyframes duoraOrbFlowA {
              0%,
              100% {
                transform: translate(0px, 0px) rotate(0deg) scale(1);
              }

              35% {
                transform: translate(6px, -5px) rotate(16deg) scale(1.07);
              }

              70% {
                transform: translate(-5px, 5px) rotate(-12deg) scale(0.95);
              }
            }

            @keyframes duoraOrbFlowB {
              0%,
              100% {
                transform: translate(0px, 0px) rotate(0deg) scale(1);
              }

              40% {
                transform: translate(-6px, 4px) rotate(-18deg) scale(1.05);
              }

              75% {
                transform: translate(5px, -4px) rotate(10deg) scale(0.96);
              }
            }

            @keyframes duoraOrbFlowC {
              0%,
              100% {
                transform: translate(0px, 0px) rotate(0deg) scale(1);
              }

              30% {
                transform: translate(5px, 6px) rotate(14deg) scale(1.05);
              }

              65% {
                transform: translate(-6px, -3px) rotate(-16deg) scale(1.08);
              }
            }

            @keyframes duoraOrbRibbonA {
              0%,
              100% {
                transform: translate(0px, 0px) rotate(0deg);
              }

              50% {
                transform: translate(3px, -4px) rotate(10deg);
              }

              80% {
                transform: translate(-2px, 2px) rotate(-6deg);
              }
            }

            @keyframes duoraOrbRibbonB {
              0%,
              100% {
                transform: translate(0px, 0px) rotate(0deg);
              }

              45% {
                transform: translate(-2px, 3px) rotate(-11deg);
              }

              78% {
                transform: translate(2px, -2px) rotate(7deg);
              }
            }

            @keyframes duoraOrbCaustic {
              0%,
              100% {
                transform: translate(0px, 0px) scale(1);
                opacity: 0.55;
              }

              50% {
                transform: translate(-7px, 5px) scale(1.15);
                opacity: 0.9;
              }
            }

            @keyframes duoraOrbSpecA {
              0%,
              100% {
                transform: rotate(0deg);
              }

              40% {
                transform: rotate(8deg);
              }

              75% {
                transform: rotate(-5deg);
              }
            }

            @keyframes duoraOrbSpecB {
              0%,
              100% {
                transform: rotate(0deg);
              }

              50% {
                transform: rotate(-10deg);
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .duora-love-glow,
              .duora-orb-flow-a,
              .duora-orb-flow-b,
              .duora-orb-flow-c,
              .duora-orb-ribbon-a,
              .duora-orb-ribbon-b,
              .duora-orb-caustic,
              .duora-orb-spec-a,
              .duora-orb-spec-b {
                animation: none !important;
              }
            }
          `,
        }}
      />

      <div
        className="duora-love-glow"
        style={{
          width: size,
          height: size,
          filter: `blur(${size * 0.05}px)`,
        }}
      />

      <svg
        className="duora-love-svg"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{
          width: size * 0.92,
          height: size * 0.92,
        }}
      >
        <defs>
          {/* ---------- Gradients ---------- */}

          {/* Atmospheric glow (pastel) */}
          <radialGradient id="duoraOrbAtmosA" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8fa2ff" stopOpacity="0.38" />
            <stop offset="62%" stopColor="#9a8cff" stopOpacity="0.3" />
            <stop offset="74%" stopColor="#b08cf8" stopOpacity="0.2" />
            <stop offset="88%" stopColor="#c9a4ff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#c9a4ff" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="duoraOrbAtmosB" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff9fdc" stopOpacity="0.3" />
            <stop offset="62%" stopColor="#ffa8d2" stopOpacity="0.24" />
            <stop offset="74%" stopColor="#f5a4ec" stopOpacity="0.17" />
            <stop offset="88%" stopColor="#f6c3f7" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#f6c3f7" stopOpacity="0" />
          </radialGradient>

          {/* Soft ground shadow (opsional lewat prop `shadow`) */}
          <radialGradient id="duoraOrbShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5b63c9" stopOpacity="0.32" />
            <stop offset="60%" stopColor="#7b7fd8" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#7b7fd8" stopOpacity="0" />
          </radialGradient>

          {/* Clear glass body: tengah transparan, hanya tepi yang
              punya tint tipis supaya bentuk orb tetap terbaca */}
          <radialGradient
            id="duoraOrbBase"
            cx="100"
            cy="100"
            r="68"
            fx="90"
            fy="84"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="55%" stopColor="#f3f4ff" stopOpacity="0" />
            <stop offset="80%" stopColor="#d5dbff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#b4bffa" stopOpacity="0.3" />
          </radialGradient>

          {/* Gradient untuk mask pelubang tengah.
              Putih = tampil, transparan = hilang.
              - Ubah "48%" jadi lebih besar  -> lubang tengah lebih lebar
              - Ubah "86%" jadi lebih kecil  -> warna di tepi lebih tipis */}
          <radialGradient
            id="duoraOrbCenterFade"
            cx="100"
            cy="100"
            r="66"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="48%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="66%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="86%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </radialGradient>

          {/* Internal light blobs (pastel) */}
          <radialGradient id="duoraOrbBlue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7fa3ff" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#8aa4ff" stopOpacity="0.68" />
            <stop offset="100%" stopColor="#9aa8ff" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="duoraOrbCyan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#96e8f8" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#7adcf2" stopOpacity="0.62" />
            <stop offset="100%" stopColor="#6fd0ee" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="duoraOrbViolet" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c0a4ff" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#b293ff" stopOpacity="0.66" />
            <stop offset="100%" stopColor="#a98bff" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="duoraOrbMagenta" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff98e8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#f08ad9" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#e07ad0" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="duoraOrbPink" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffc0dc" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#ffa3cb" stopOpacity="0.66" />
            <stop offset="100%" stopColor="#ff8fb8" stopOpacity="0" />
          </radialGradient>

          {/* Light ribbons */}
          <linearGradient
            id="duoraOrbRibbonBlue"
            x1="52"
            y1="112"
            x2="146"
            y2="132"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
            <stop offset="25%" stopColor="#4cc2f5" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#6e8bff" stopOpacity="0.9" />
            <stop offset="85%" stopColor="#9a74f6" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#9a74f6" stopOpacity="0" />
          </linearGradient>

          <linearGradient
            id="duoraOrbRibbonPink"
            x1="118"
            y1="48"
            x2="150"
            y2="120"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#b56cf7" stopOpacity="0" />
            <stop offset="30%" stopColor="#df62f0" stopOpacity="0.9" />
            <stop offset="65%" stopColor="#f77fbd" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#fb7e92" stopOpacity="0" />
          </linearGradient>

          <linearGradient
            id="duoraOrbRibbonViolet"
            x1="50"
            y1="92"
            x2="84"
            y2="46"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#7a7df5" stopOpacity="0" />
            <stop offset="50%" stopColor="#a58bfa" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#6fe0f2" stopOpacity="0" />
          </linearGradient>

          <linearGradient
            id="duoraOrbRibbonMix"
            x1="132"
            y1="118"
            x2="96"
            y2="146"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ee9ffc" stopOpacity="0" />
            <stop offset="50%" stopColor="#6aa8fb" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#35d4ee" stopOpacity="0" />
          </linearGradient>

          {/* Faint inner caustic untuk kedalaman */}
          <radialGradient id="duoraOrbCaustic" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#98a6ff" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#98a6ff" stopOpacity="0" />
          </radialGradient>

          {/* Iridescent rim — gradient itself slowly drifts around the edge */}
          <linearGradient
            id="duoraOrbRimGrad"
            x1="38"
            y1="38"
            x2="162"
            y2="162"
            gradientUnits="userSpaceOnUse"
          >
            <animateTransform
              attributeName="gradientTransform"
              type="rotate"
              from="0 100 100"
              to="360 100 100"
              dur="48s"
              repeatCount="indefinite"
            />
            <stop offset="0%" stopColor="#5fd2ee" stopOpacity="0.9" />
            <stop offset="25%" stopColor="#7e9bff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#b88cf7" stopOpacity="0.85" />
            <stop offset="72%" stopColor="#ee82da" stopOpacity="0.9" />
            <stop offset="88%" stopColor="#f8a0c8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#5fd2ee" stopOpacity="0.9" />
          </linearGradient>

          {/* Glass surface sheen: tipis, hampir transparan */}
          <linearGradient
            id="duoraOrbGloss"
            x1="60"
            y1="36"
            x2="140"
            y2="164"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.24" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="60%" stopColor="#dfe6ff" stopOpacity="0" />
            <stop offset="100%" stopColor="#8f9cf5" stopOpacity="0.16" />
          </linearGradient>

          {/* Specular crescents */}
          <linearGradient
            id="duoraOrbSpec"
            x1="47.8"
            y1="86"
            x2="104.7"
            y2="46.2"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <linearGradient
            id="duoraOrbSpecB"
            x1="47.8"
            y1="86"
            x2="104.7"
            y2="46.2"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#fdf7ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* ---------- Organic silhouette clip (morphing) ---------- */}
          <clipPath id="duoraOrbClip" clipPathUnits="userSpaceOnUse">
            <path d={ORB_SHAPE_1}>
              <animate {...ORB_MORPH_ANIMATION} />
            </path>
          </clipPath>

          {/* Mask pelubang tengah: semua isi orb dipotong di bagian tengah,
              jadi yang terlihat di tengah adalah background parent */}
          <mask
            id="duoraOrbCenterMask"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="200"
            height="200"
          >
            <rect
              x="0"
              y="0"
              width="200"
              height="200"
              fill="url(#duoraOrbCenterFade)"
            />
          </mask>

          {/* Mask "lubang" berbentuk orb: dipakai untuk memotong glow
              atmosfer di dalam orb */}
          <mask
            id="duoraOrbHole"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="200"
            height="200"
          >
            <rect x="0" y="0" width="200" height="200" fill="#ffffff" />
            <path
              d={ORB_SHAPE_1}
              fill="#000000"
              filter="url(#duoraOrbBlurMask)"
            >
              <animate {...ORB_MORPH_ANIMATION} />
            </path>
          </mask>

          {/* ---------- Filters ---------- */}
          <filter
            id="duoraOrbBlurGlow"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="200"
            height="200"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="9" />
          </filter>

          <filter
            id="duoraOrbBlurMask"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="200"
            height="200"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="2" />
          </filter>

          <filter
            id="duoraOrbBlurShadow"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="200"
            height="200"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="5" />
          </filter>

          <filter
            id="duoraOrbBlurHalo"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="200"
            height="200"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="7" />
          </filter>

          <filter
            id="duoraOrbBlurLg"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="200"
            height="200"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="6" />
          </filter>

          <filter
            id="duoraOrbBlurSm"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="200"
            height="200"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="1.8" />
          </filter>

          <filter
            id="duoraOrbBlurRim"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="200"
            height="200"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="3.4" />
          </filter>

          <filter
            id="duoraOrbBlurEdge"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="200"
            height="200"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="0.9" />
          </filter>

          <filter
            id="duoraOrbBlurSheen"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="200"
            height="200"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="1.3" />
          </filter>

          <filter
            id="duoraOrbBlurHi"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="200"
            height="200"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="0.7" />
          </filter>

          {/* Glass refraction: animated turbulence drives a displacement map,
              with slightly different strength per colour channel (dispersion) */}
          <filter
            id="duoraOrbRefract"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="200"
            height="200"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.011 0.015"
              numOctaves="2"
              seed="11"
              result="duoraNoise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.011 0.015;0.017 0.010;0.012 0.018;0.011 0.015"
                keyTimes="0;0.33;0.66;1"
                keySplines={[ORB_EASE, ORB_EASE, ORB_EASE].join(";")}
                calcMode="spline"
                dur="34s"
                repeatCount="indefinite"
              />
            </feTurbulence>

            <feDisplacementMap
              in="SourceGraphic"
              in2="duoraNoise"
              scale="12"
              xChannelSelector="R"
              yChannelSelector="G"
              result="duoraDispR"
            />
            <feColorMatrix
              in="duoraDispR"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="duoraChanR"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="duoraNoise"
              scale="15"
              xChannelSelector="R"
              yChannelSelector="G"
              result="duoraDispG"
            />
            <feColorMatrix
              in="duoraDispG"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="duoraChanG"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="duoraNoise"
              scale="18"
              xChannelSelector="R"
              yChannelSelector="G"
              result="duoraDispB"
            />
            <feColorMatrix
              in="duoraDispB"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="duoraChanB"
            />

            <feBlend
              in="duoraChanR"
              in2="duoraChanG"
              mode="screen"
              result="duoraChanRG"
            />
            <feBlend
              in="duoraChanRG"
              in2="duoraChanB"
              mode="screen"
              result="duoraChanRGB"
            />
            <feColorMatrix
              in="duoraChanRGB"
              type="saturate"
              values="1.25"
            />
          </filter>
        </defs>

        {/* 0. Soft contact shadow (opsional) */}
        {shadow && (
          <g filter="url(#duoraOrbBlurShadow)">
            <ellipse
              cx="100"
              cy="176"
              rx="46"
              ry="7"
              fill="url(#duoraOrbShadow)"
            >
              <animate
                attributeName="rx"
                values="42;52;42"
                keyTimes="0;0.5;1"
                keySplines={ORB_EASE_HALF}
                calcMode="spline"
                dur="9s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.7;1;0.7"
                keyTimes="0;0.5;1"
                keySplines={ORB_EASE_HALF}
                calcMode="spline"
                dur="9s"
                repeatCount="indefinite"
              />
            </ellipse>
          </g>
        )}

        {/* 1. Atmospheric glow (breathing) — hanya di luar orb berkat mask */}
        <g mask="url(#duoraOrbHole)">
          <g filter="url(#duoraOrbBlurGlow)">
            <circle cx="96" cy="106" r="80" fill="url(#duoraOrbAtmosA)">
              <animate
                attributeName="r"
                values="78;88;78"
                keyTimes="0;0.5;1"
                keySplines={ORB_EASE_HALF}
                calcMode="spline"
                dur="9s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.55;0.95;0.55"
                keyTimes="0;0.5;1"
                keySplines={ORB_EASE_HALF}
                calcMode="spline"
                dur="9s"
                repeatCount="indefinite"
              />
            </circle>

            <circle cx="106" cy="92" r="76" fill="url(#duoraOrbAtmosB)">
              <animate
                attributeName="r"
                values="74;84;74"
                keyTimes="0;0.5;1"
                keySplines={ORB_EASE_HALF}
                calcMode="spline"
                dur="11s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.8;0.4;0.8"
                keyTimes="0;0.5;1"
                keySplines={ORB_EASE_HALF}
                calcMode="spline"
                dur="11s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </g>

        {/* 2. Soft edge halo following the morphing silhouette */}
        <path
          d={ORB_SHAPE_1}
          fill="none"
          stroke="url(#duoraOrbRimGrad)"
          strokeWidth="10"
          opacity="0.32"
          filter="url(#duoraOrbBlurHalo)"
        >
          <animate {...ORB_MORPH_ANIMATION} />
          <animate
            attributeName="opacity"
            values="0.22;0.42;0.22"
            keyTimes="0;0.5;1"
            keySplines={ORB_EASE_HALF}
            calcMode="spline"
            dur="8s"
            repeatCount="indefinite"
          />
        </path>

        {/* 3. The orb itself — dipotong ke bentuk blob, lalu tengahnya
               dilubangi lewat mask supaya benar-benar transparan */}
        <g clipPath="url(#duoraOrbClip)">
          <g mask="url(#duoraOrbCenterMask)">
            {/* Clear glass body (tengah transparan, tepi tint tipis) */}
            <rect
              x="20"
              y="20"
              width="160"
              height="160"
              fill="url(#duoraOrbBase)"
            />

            {/* Internal flowing light, warped by the refraction filter */}
            <g filter="url(#duoraOrbRefract)">
              {/* Soft colour masses */}
              <g filter="url(#duoraOrbBlurLg)">
                <g className="duora-orb-layer duora-orb-flow-a">
                  <ellipse
                    cx="66"
                    cy="126"
                    rx="40"
                    ry="24"
                    transform="rotate(-32 66 126)"
                    fill="url(#duoraOrbBlue)"
                  />
                  <ellipse
                    cx="112"
                    cy="150"
                    rx="34"
                    ry="15"
                    transform="rotate(-8 112 150)"
                    fill="url(#duoraOrbCyan)"
                  />
                </g>

                <g className="duora-orb-layer duora-orb-flow-b">
                  <ellipse
                    cx="54"
                    cy="82"
                    rx="30"
                    ry="20"
                    transform="rotate(-50 54 82)"
                    fill="url(#duoraOrbViolet)"
                  />
                  <ellipse
                    cx="88"
                    cy="44"
                    rx="26"
                    ry="12"
                    transform="rotate(-12 88 44)"
                    fill="url(#duoraOrbBlue)"
                  />
                </g>

                <g className="duora-orb-layer duora-orb-flow-c">
                  <ellipse
                    cx="148"
                    cy="76"
                    rx="32"
                    ry="22"
                    transform="rotate(35 148 76)"
                    fill="url(#duoraOrbMagenta)"
                  />
                  <ellipse
                    cx="150"
                    cy="122"
                    rx="22"
                    ry="30"
                    transform="rotate(-15 150 122)"
                    fill="url(#duoraOrbPink)"
                  />
                </g>
              </g>

              {/* Thin flowing light ribbons */}
              <g filter="url(#duoraOrbBlurSm)">
                <g className="duora-orb-layer duora-orb-ribbon-a">
                  <path
                    d="M52,112 C54,134 74,152 100,154 C120,155 136,146 146,132"
                    fill="none"
                    stroke="url(#duoraOrbRibbonBlue)"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M132,118 C128,136 112,146 96,146"
                    fill="none"
                    stroke="url(#duoraOrbRibbonMix)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </g>

                <g className="duora-orb-layer duora-orb-ribbon-b">
                  <path
                    d="M118,48 C140,52 154,68 156,90 C157,102 154,112 150,120"
                    fill="none"
                    stroke="url(#duoraOrbRibbonPink)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M50,92 C48,70 62,52 84,46"
                    fill="none"
                    stroke="url(#duoraOrbRibbonViolet)"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </g>
              </g>
            </g>

            {/* Faint inner caustic for depth */}
            <g className="duora-orb-layer duora-orb-caustic">
              <ellipse
                cx="108"
                cy="106"
                rx="24"
                ry="14"
                transform="rotate(-25 108 106)"
                fill="url(#duoraOrbCaustic)"
              />
            </g>

            {/* Iridescent inner rim glow */}
            <path
              d={ORB_SHAPE_1}
              fill="none"
              stroke="url(#duoraOrbRimGrad)"
              strokeWidth="9"
              opacity="0.75"
              filter="url(#duoraOrbBlurRim)"
            >
              <animate {...ORB_MORPH_ANIMATION} />
            </path>

            {/* Very subtle edge definition (no hard border) */}
            <path
              d={ORB_SHAPE_1}
              fill="none"
              stroke="url(#duoraOrbRimGrad)"
              strokeWidth="2"
              opacity="0.45"
              filter="url(#duoraOrbBlurEdge)"
            >
              <animate {...ORB_MORPH_ANIMATION} />
            </path>

            {/* Glass surface sheen */}
            <rect
              x="20"
              y="20"
              width="160"
              height="160"
              fill="url(#duoraOrbGloss)"
            />

            {/* Edge sheens that drift slowly along the glass */}
            <g filter="url(#duoraOrbBlurSheen)">
              <path
                d={ORB_SHAPE_1}
                fill="none"
                stroke="#ffffff"
                strokeWidth="7"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray="10 90"
                opacity="0.85"
              >
                <animate {...ORB_MORPH_ANIMATION} />
                <animate
                  attributeName="stroke-dashoffset"
                  values="12;22;12"
                  keyTimes="0;0.5;1"
                  keySplines={ORB_EASE_HALF}
                  calcMode="spline"
                  dur="21s"
                  repeatCount="indefinite"
                />
              </path>

              <path
                d={ORB_SHAPE_1}
                fill="none"
                stroke="#ffffff"
                strokeWidth="6"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray="14 86"
                opacity="0.55"
              >
                <animate {...ORB_MORPH_ANIMATION} />
                <animate
                  attributeName="stroke-dashoffset"
                  values="-30;-42;-30"
                  keyTimes="0;0.5;1"
                  keySplines={ORB_EASE_HALF}
                  calcMode="spline"
                  dur="27s"
                  repeatCount="indefinite"
                />
              </path>
            </g>

            {/* White specular highlights */}
            <g filter="url(#duoraOrbBlurHi)">
              <g className="duora-orb-layer duora-orb-spec-a">
                <path
                  d="M47.8,86 C54.6,60.7 78.6,43.9 104.7,46.2 C86,51 60,66 47.8,86 Z"
                  fill="url(#duoraOrbSpec)"
                />
                <ellipse
                  cx="71"
                  cy="58"
                  rx="7"
                  ry="2.2"
                  transform="rotate(-35 71 58)"
                  fill="#ffffff"
                  opacity="0.98"
                />
              </g>

              <g
                className="duora-orb-layer duora-orb-spec-b"
                opacity="0.6"
              >
                <path
                  d="M47.8,86 C54.6,60.7 78.6,43.9 104.7,46.2 C86,51 60,66 47.8,86 Z"
                  transform="rotate(180 100 100)"
                  fill="url(#duoraOrbSpecB)"
                />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}